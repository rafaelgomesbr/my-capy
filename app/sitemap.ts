import { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { categories } from "@/lib/categories";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mycapy.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/ferramentas`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacidade`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/termos`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/ferramentas/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = tools
    .filter((tool) => !(tool.category === "documentos" && tool.slug.startsWith("gerador-")))
    .map((tool) => ({
      url: `${BASE_URL}/ferramentas/${tool.category}/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: tool.popular ? 0.9 : 0.7,
    }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
