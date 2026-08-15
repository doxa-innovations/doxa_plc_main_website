"use client";

import {
  createContext,
  useActionState,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { deleteEntry, type ActionResult, type Collection } from "../actions";

/**
 * One modal, one drawer, one delete confirm, shared by every record on a page.
 *
 * The previous version rendered a complete form per record: eleven stacked
 * forms on the works page, every field of every project on screen at once.
 * Here the list shows only what identifies a record, and exactly one editing
 * surface is mounted at a time, holding whichever record you opened.
 *
 * Detail opens in a drawer from the right; editing opens in a centred modal.
 * That split is deliberate. A drawer is a place you glance into and dismiss; a
 * modal is a task you finish or cancel, and centring it says so.
 */

interface ShellState<T> {
  /** Record whose details are open, or null. */
  viewing: T | null;
  /** Record being edited; `null` inside an open editor means "creating new". */
  editing: T | null;
  isCreating: boolean;
  open: (record: T) => void;
  edit: (record: T | null) => void;
  close: () => void;
}

const Ctx = createContext<ShellState<unknown> | null>(null);

function useShell<T>() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Editor components must be inside <EditorShell>.");
  return ctx as ShellState<T>;
}

export function EditorShell<T extends { id: string | number }>({
  children,
}: {
  children: React.ReactNode;
}) {
  const [viewing, setViewing] = useState<T | null>(null);
  const [editing, setEditing] = useState<T | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const value: ShellState<T> = {
    viewing,
    editing,
    isCreating,
    open: (record) => setViewing(record),
    edit: (record) => {
      setViewing(null);
      setEditing(record);
      setIsCreating(record === null);
    },
    close: () => {
      setViewing(null);
      setEditing(null);
      setIsCreating(false);
    },
  };

  return (
    <Ctx.Provider value={value as ShellState<unknown>}>{children}</Ctx.Provider>
  );
}

/** Opens the detail drawer. Wrap the clickable body of a card or row. */
export function OpenDetail<T extends { id: string | number }>({
  record,
  children,
  className,
}: {
  record: T;
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useShell<T>();
  return (
    <button
      type="button"
      onClick={() => open(record)}
      className={cn("block w-full text-left", className)}
    >
      {children}
    </button>
  );
}

export function EditButton<T extends { id: string | number }>({
  record,
}: {
  record: T;
}) {
  const { edit } = useShell<T>();
  return (
    <button
      type="button"
      onClick={() => edit(record)}
      aria-label="Edit"
      className="grid size-7 place-items-center rounded-md text-ink-muted transition-colors hover:bg-panel-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <Pencil className="size-3.5" strokeWidth={1.75} aria-hidden />
    </button>
  );
}

export function AddButton({ label }: { label: string }) {
  const { edit } = useShell();
  return (
    <Button size="sm" onClick={() => edit(null)}>
      <Plus className="size-4" strokeWidth={2} aria-hidden />
      {label}
    </Button>
  );
}

/**
 * Delete, behind a confirmation.
 *
 * Deleting a project or a tier removes it from the live site immediately and
 * there is no undo, so a stray click on a small icon must not be enough.
 */
export function DeleteButton({
  collection,
  id,
  name,
}: {
  collection: Collection;
  id: string | number;
  name: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${name}`}
        className="grid size-7 place-items-center rounded-md text-ink-muted transition-colors hover:bg-destructive/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Trash2 className="size-3.5" strokeWidth={1.75} aria-hidden />
      </button>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {name}?</DialogTitle>
            <DialogDescription>
              This removes it from the live site straight away, and cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirming(false)}
              disabled={pending}
            >
              Keep it
            </Button>
            <Button
              size="sm"
              disabled={pending}
              className="border border-destructive/50 bg-destructive text-white shadow-none hover:bg-destructive/90 hover:shadow-none"
              onClick={() =>
                startTransition(async () => {
                  const result = await deleteEntry(collection, String(id));
                  if (result.ok) {
                    setConfirming(false);
                    router.refresh();
                  } else {
                    setError(result.error ?? "Could not delete.");
                  }
                })
              }
            >
              {pending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** The detail drawer. `render` receives whichever record was opened. */
export function DetailDrawer<T extends { id: string | number }>({
  title,
  render,
}: {
  title: (record: T) => string;
  render: (record: T) => React.ReactNode;
}) {
  const { viewing, close, edit } = useShell<T>();

  return (
    <Sheet open={viewing !== null} onOpenChange={(o) => !o && close()}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        {viewing && (
          <>
            <SheetHeader>
              <SheetTitle>{title(viewing)}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {render(viewing)}
            </div>
            <div className="border-t border-line p-4">
              <Button size="sm" onClick={() => edit(viewing)}>
                <Pencil className="size-4" strokeWidth={1.75} aria-hidden />
                Edit
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function SaveButton({ isCreating }: { isCreating: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Saving…" : isCreating ? "Create" : "Save changes"}
    </Button>
  );
}

/**
 * The single edit modal.
 *
 * `key` on the form is the record id, so React remounts it when you switch
 * records. Without that, uncontrolled inputs keep the previous record's values
 * and you silently overwrite one thing with another's data.
 */
export function EditModal<T extends { id: string | number }>({
  action,
  title,
  description,
  render,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  title: (record: T | null) => string;
  description?: string;
  render: (record: T | null) => React.ReactNode;
}) {
  const { editing, isCreating, close } = useShell<T>();
  const [state, formAction] = useActionState<ActionResult, FormData>(action, {
    ok: false,
  });
  const router = useRouter();
  const isOpen = editing !== null || isCreating;

  // Close on success and pull the fresh list from the server.
  useEffect(() => {
    if (state.ok) {
      close();
      router.refresh();
    }
    // `close` is recreated each render; depending on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent>
        <form action={formAction} key={editing ? String(editing.id) : "new"}>
          {editing && (
            <input type="hidden" name="id" value={String(editing.id)} />
          )}

          <DialogHeader>
            <DialogTitle>{title(editing)}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">{render(editing)}</div>

          <DialogFooter>
            {state.error && (
              <span role="alert" className="mr-auto text-xs text-destructive">
                {state.error}
              </span>
            )}
            <Button variant="outline" size="sm" type="button" onClick={close}>
              Cancel
            </Button>
            <SaveButton isCreating={isCreating} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
