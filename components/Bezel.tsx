import { cn } from "@/lib/utils";

/**
 * Double-bezel ("machined hardware") container: a hairline outer shell with a
 * tiny inset, wrapping an inner core with a top highlight and concentric
 * radius. Use where elevation is real (feature/work cards), not everywhere.
 */
export function Bezel({
  className,
  innerClassName,
  children,
}: {
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-1.5 shadow-[0_40px_90px_-50px_rgba(124,60,180,0.7)]",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-[1.225rem] bg-surface-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
