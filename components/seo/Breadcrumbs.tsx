import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/jsonld";

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Renders a visible breadcrumb trail and emits the matching BreadcrumbList
 * JSON-LD from the same items, so Google shows breadcrumbs in results.
 * Pass the full trail including Home as the first crumb.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-foreground">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="transition-colors hover:text-ink"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <ChevronRight className="size-3.5 shrink-0" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd schema={graph(breadcrumbSchema(items))} />
    </nav>
  );
}
