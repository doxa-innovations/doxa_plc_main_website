"use client";

import { useId, useState, useTransition } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

import { reorderEntries, type Collection } from "../actions";

/**
 * Drag to reorder, replacing the "order" number field.
 *
 * Asking someone to type 10, 20, 30 to arrange three cards is making a person
 * do arithmetic to express a spatial idea. The new sequence is written back as
 * evenly spaced numbers by `reorderEntries`.
 *
 * The list is optimistic: it moves immediately and persists in the background,
 * because a drag that visibly snaps back while a request completes feels
 * broken even when it succeeds. A failed save restores the previous order and
 * says so.
 *
 * `PointerSensor` has an activation distance so a click on the card (which
 * opens the detail drawer) is not swallowed as a micro-drag. Keyboard sorting
 * is wired up too, which is the part drag-and-drop UIs usually drop.
 */
export function SortableArea<T extends { id: string | number }>({
  items,
  collection,
  layout = "list",
  className,
  children,
}: {
  items: T[];
  collection: Collection;
  layout?: "list" | "grid";
  className?: string;
  children: (item: T) => React.ReactNode;
}) {
  const [ordered, setOrdered] = useState(items);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const contextId = useId();

  /**
   * Re-sync when the server sends a new list, after a save, create or delete.
   *
   * Adjusting state DURING render rather than in an effect. React handles this
   * case specially: it discards the in-progress render and immediately retries
   * with the new state, without a browser paint in between. Doing it in an
   * effect would paint the stale order first and then correct it, which is the
   * cascading re-render that react-hooks/set-state-in-effect exists to catch.
   */
  const [syncedFrom, setSyncedFrom] = useState(items);
  if (syncedFrom !== items) {
    setSyncedFrom(items);
    setOrdered(items);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = ordered.findIndex((i) => String(i.id) === String(active.id));
    const to = ordered.findIndex((i) => String(i.id) === String(over.id));
    if (from === -1 || to === -1) return;

    const previous = ordered;
    const next = arrayMove(ordered, from, to);
    setOrdered(next);
    setError(null);

    startTransition(async () => {
      const result = await reorderEntries(
        collection,
        next.map((i) => String(i.id)),
      );
      if (!result.ok) {
        setOrdered(previous);
        setError(result.error ?? "Could not save the new order.");
      }
    });
  };

  return (
    <>
      {error && (
        <p role="alert" className="mb-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <DndContext
        id={contextId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        modifiers={
          layout === "list"
            ? [restrictToVerticalAxis, restrictToParentElement]
            : [restrictToParentElement]
        }
      >
        <SortableContext
          items={ordered.map((i) => String(i.id))}
          strategy={
            layout === "list"
              ? verticalListSortingStrategy
              : rectSortingStrategy
          }
        >
          <div
            className={cn(
              layout === "list"
                ? "space-y-3"
                : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
              className,
            )}
          >
            {ordered.map((item) => children(item))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}

/**
 * One draggable item.
 *
 * The handle is a dedicated grip rather than the whole card, so clicking the
 * card can still open its details. Dragging from anywhere would make the two
 * gestures compete and the card would feel unclickable.
 */
export function SortableItem({
  id,
  children,
  className,
}: {
  id: string | number;
  children: (handle: React.ReactNode) => React.ReactNode;
  className?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(id) });

  const handle = (
    <button
      ref={setActivatorNodeRef}
      type="button"
      aria-label="Reorder"
      className="grid size-7 cursor-grab touch-none place-items-center rounded-md text-ink-muted/60 transition-colors hover:bg-panel-strong hover:text-ink active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" strokeWidth={2} aria-hidden />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        isDragging && "relative z-10 opacity-90 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children(handle)}
    </div>
  );
}
