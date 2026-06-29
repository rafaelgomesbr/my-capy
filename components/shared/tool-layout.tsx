import { Tool, FAQItem } from "@/types";
import { Container } from "@/components/layout/container";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { AdTop } from "@/components/ads/ad-top";
import { AdMiddle } from "@/components/ads/ad-middle";
import { AdBottom } from "@/components/ads/ad-bottom";
import { FAQSection } from "./faq-section";
import { RelatedTools } from "./related-tools";
import { JsonLd } from "@/components/seo/json-ld";
import { Separator } from "@/components/ui/separator";
import { getRelatedTools } from "@/lib/tools";
import { getCategoryBySlug } from "@/lib/categories";

interface ToolLayoutProps {
  tool: Tool;
  faqs?: FAQItem[];
  children: React.ReactNode;
  explanation?: React.ReactNode;
  examples?: React.ReactNode;
}

export function ToolLayout({ tool, faqs = [], children, explanation, examples }: ToolLayoutProps) {
  const category = getCategoryBySlug(tool.category);
  const relatedTools = getRelatedTools(tool, 4);

  const breadcrumbs = [
    { label: "Ferramentas", href: "/ferramentas" },
    { label: category?.name || tool.category, href: `/ferramentas/${tool.category}` },
    { label: tool.name },
  ];

  const faqJsonLd = faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <Container as="main" className="py-8">
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <BreadcrumbNav items={breadcrumbs} className="mb-6" />

      <AdTop />

      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">{tool.name}</h1>
          <p className="text-lg text-muted-foreground">{tool.description}</p>
        </header>

        <section aria-labelledby="tool-section" className="mb-8">
          <h2 id="tool-section" className="sr-only">
            {tool.name}
          </h2>
          {children}
        </section>

        <AdMiddle />

        {explanation && (
          <>
            <Separator className="my-8" />
            <section aria-labelledby="explanation-heading" className="mb-8 prose prose-neutral dark:prose-invert max-w-none">
              <h2 id="explanation-heading" className="not-prose mb-4 text-2xl font-bold">
                Como funciona
              </h2>
              {explanation}
            </section>
          </>
        )}

        {examples && (
          <>
            <Separator className="my-8" />
            <section aria-labelledby="examples-heading" className="mb-8">
              <h2 id="examples-heading" className="mb-4 text-2xl font-bold">
                Exemplos práticos
              </h2>
              {examples}
            </section>
          </>
        )}

        {faqs.length > 0 && (
          <>
            <Separator className="my-8" />
            <div className="mb-8">
              <FAQSection faqs={faqs} />
            </div>
          </>
        )}

        <AdBottom />

        {relatedTools.length > 0 && (
          <>
            <Separator className="my-8" />
            <RelatedTools tools={relatedTools} />
          </>
        )}
      </div>
    </Container>
  );
}
