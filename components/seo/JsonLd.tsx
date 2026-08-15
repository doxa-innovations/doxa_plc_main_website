/**
 * Injects a JSON-LD structured-data document. Server component; render it
 * inside any page body. Pass a single schema node or a full @graph object.
 */
export function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inject as ld+json (data, not executable).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
