import type { JsonLd as JsonLdSchema } from "@/lib/seo";

interface JsonLdProps {
  data: JsonLdSchema | JsonLdSchema[];
}

export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data];

  return (
    <>
      {payload.map((item) => (
        <script
          key={String(item["@type"] ?? item["@context"])}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: server-generated JSON-LD from typed schema builders
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
