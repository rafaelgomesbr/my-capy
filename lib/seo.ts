import type { Metadata } from "next";
import { Tool } from "@/types";
import { getCategoryBySlug } from "./categories";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mycapy.app";
const SITE_NAME = "MyCapy";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function getToolMetadata(tool: Tool): Metadata {
  const title = `${tool.name} — Grátis e Online`;
  const description = `${tool.description}. Ferramenta gratuita e online. Use agora sem cadastro.`;
  const url = `${SITE_URL}/ferramentas/${tool.category}/${tool.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.name} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: "pt_BR",
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} | ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function getCategoryMetadata(categorySlug: string): Metadata | null {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  const title = `Ferramentas de ${category.name} — Grátis e Online`;
  const description = `${category.description}. Todas as ferramentas gratuitas de ${category.name.toLowerCase()} em um só lugar. Sem cadastro.`;
  const url = `${SITE_URL}/ferramentas/${categorySlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `Ferramentas de ${category.name} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: "pt_BR",
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: category.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Ferramentas de ${category.name} | ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function getToolJsonLd(tool: Tool) {
  const url = `${SITE_URL}/ferramentas/${tool.category}/${tool.slug}`;
  return {
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    inLanguage: "pt-BR",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
  };
}

export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildGraphJsonLd(schemas: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}

export { SITE_URL, SITE_NAME };
