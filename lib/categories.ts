import { Category } from "@/types";

export const categories: Category[] = [
  {
    slug: "financas",
    name: "Finanças",
    description: "Calculadoras financeiras para investimentos, empréstimos, salários e muito mais",
    icon: "TrendingUp",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    slug: "texto",
    name: "Texto",
    description: "Ferramentas para manipular, formatar e transformar textos e dados",
    icon: "Type",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    slug: "conversores",
    name: "Conversores",
    description: "Converta unidades de medida, temperatura, peso, moeda e muito mais",
    icon: "ArrowLeftRight",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/40",
  },
  {
    slug: "estudos",
    name: "Estudos",
    description: "Calculadoras matemáticas para estudantes e profissionais",
    icon: "GraduationCap",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/40",
  },
  {
    slug: "criadores",
    name: "Criadores",
    description: "Geradores de conteúdo para redes sociais e marketing digital",
    icon: "Sparkles",
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/40",
  },
  {
    slug: "utilidades",
    name: "Utilidades",
    description: "Ferramentas práticas do dia a dia para produtividade e segurança",
    icon: "Wrench",
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950/40",
  },
  {
    slug: "documentos",
    name: "Documentos",
    description: "Geradores e validadores de documentos brasileiros: CPF, CNPJ, RG, CNH e muito mais",
    icon: "FileText",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/40",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
