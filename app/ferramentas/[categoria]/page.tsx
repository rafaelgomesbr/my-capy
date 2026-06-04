import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ToolCard } from "@/components/shared/tool-card";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategoryBySlug, categories } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools";
import { getCategoryMetadata, SITE_URL } from "@/lib/seo";

interface PageProps {
  params: Promise<{ categoria: string }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ categoria: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria } = await params;
  const meta = getCategoryMetadata(categoria);
  if (!meta) return { title: "Categoria não encontrada" };
  return meta;
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria } = await params;
  const category = getCategoryBySlug(categoria);
  if (!category) notFound();

  const categoryTools = getToolsByCategory(categoria);

  const breadcrumbs = [
    { label: "Ferramentas", href: "/ferramentas" },
    { label: category.name },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Ferramentas de ${category.name} — MyCapy`,
    description: category.description,
    url: `${SITE_URL}/ferramentas/${categoria}`,
    numberOfItems: categoryTools.length,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Container as="main" className="py-8">
        <BreadcrumbNav items={breadcrumbs} className="mb-6" />

        <header className="mb-10">
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Ferramentas de {category.name}
          </h1>
          <p className="text-lg text-muted-foreground">{category.description}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {categoryTools.length} {categoryTools.length === 1 ? "ferramenta" : "ferramentas"}{" "}
            disponíveis
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryTools.map((tool) => (
            <ToolCard key={`${tool.category}/${tool.slug}`} tool={tool} />
          ))}
        </div>
      </Container>
    </>
  );
}
