export type CategorySlug =
  | "financas"
  | "texto"
  | "conversores"
  | "estudos"
  | "criadores"
  | "utilidades"
  | "documentos";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: CategorySlug;
  keywords: string[];
  popular?: boolean;
  new?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolPageProps {
  tool: Tool;
  relatedTools: Tool[];
  faqs: FAQItem[];
}

export interface SearchResult {
  tool: Tool;
  score: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  category: "bug" | "sugestao" | "parceria";
  message: string;
}
