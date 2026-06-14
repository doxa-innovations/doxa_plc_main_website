import {
  Globe,
  ShoppingCart,
  Wrench,
  Palette,
  Smartphone,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

/** Maps the icon names stored in content (services) to lucide components. */
const ICONS: Record<string, LucideIcon> = {
  Globe,
  ShoppingCart,
  Wrench,
  Palette,
  Smartphone,
  LifeBuoy,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = ICONS[name] ?? Globe;
  return <Cmp className={className} aria-hidden />;
}
