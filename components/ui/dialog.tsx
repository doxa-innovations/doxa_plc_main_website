"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Centered modal.
 *
 * `transform-origin` stays centred here, unlike a popover: a modal is not
 * anchored to the control that opened it, so scaling it out of a corner would
 * imply a relationship that does not exist.
 *
 * Enters from scale(0.96), never scale(0). Nothing in the physical world
 * appears out of literal nothing, and starting from a visible size is what
 * makes the entrance read as an object arriving rather than a glitch.
 */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-[80] bg-deep/70 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-[81] w-[calc(100vw-2rem)] max-w-2xl",
          "-translate-x-1/2 -translate-y-1/2",
          "max-h-[calc(100dvh-3rem)] overflow-y-auto",
          "rounded-[1.4rem] border border-line bg-surface-muted p-6 shadow-[0_40px_90px_-50px_rgba(124,60,180,0.9)]",
          "duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-ink-muted transition-colors hover:bg-panel-strong hover:text-ink focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label="Close"
        >
          <X className="size-4" strokeWidth={2} aria-hidden />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mb-5 pr-10", className)} {...props} />;
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "font-display text-lg font-semibold tracking-tight text-ink",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("mt-1 text-sm text-ink-muted", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-line pt-5",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
