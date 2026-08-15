import type { FaqItem } from "@/content/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageSchema, graph } from "@/lib/jsonld";

/**
 * FAQ accordion. Renders the visible Q&A AND the FAQPage JSON-LD from the same
 * `items` array, so the structured data always matches the page content.
 */
export function FaqSection({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-base font-semibold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-base text-ink/70">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <JsonLd schema={graph(faqPageSchema(items))} />
    </>
  );
}
