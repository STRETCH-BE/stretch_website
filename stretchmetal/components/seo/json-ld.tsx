// Renders a schema.org JSON-LD object into a <script> tag. The stringified
// payload comes from our own builders in lib/schema.ts (no user input), so
// dangerouslySetInnerHTML is safe here; "<" is escaped defensively anyway.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
