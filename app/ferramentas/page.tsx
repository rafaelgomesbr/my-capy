import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { CategoryCard } from "@/components/shared/category-card";
import { ToolCard } from "@/components/shared/tool-card";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Todas as Ferramentas Gratuitas",
  description:
    "Explore mais de 90 ferramentas gratuitas online organizadas por categoria: finanças, texto, conversores, estudos, criadores e utilidades.",
  alternates: {
    canonical: `${SITE_URL}/ferramentas`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Ferramentas Gratuitas Online — MyCapy",
  description: "Mais de 90 ferramentas gratuitas organizadas por categoria.",
  url: `${SITE_URL}/ferramentas`,
};

export default function FerramentasPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Container as="main" className="py-8">
        <BreadcrumbNav items={[{ label: "Ferramentas" }]} className="mb-6" />

        <header className="mb-10">
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Todas as Ferramentas
          </h1>
          <p className="text-lg text-muted-foreground">
            Mais de 90 ferramentas gratuitas organizadas em {categories.length} categorias
          </p>
        </header>

        <section aria-labelledby="categories-section" className="mb-12">
          <h2 id="categories-section" className="mb-6 text-2xl font-semibold">
            Categorias
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>

        {categories.map((category) => {
          const categoryTools = getToolsByCategory(category.slug);
          return (
            <section key={category.slug} aria-labelledby={`cat-${category.slug}`} className="mb-12">
              <Separator className="mb-10" />
              <div className="mb-6 flex items-end justify-between">
                <h2 id={`cat-${category.slug}`} className="text-2xl font-semibold">
                  {category.name}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {categoryTools.length} ferramentas
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categoryTools.map((tool) => (
                  <ToolCard key={`${tool.category}/${tool.slug}`} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </Container>
    </>
  );
}
