import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { ContactForm } from "./contact-form";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com o MyCapy. Reporte bugs, sugira novas ferramentas ou proponha parcerias.",
  alternates: { canonical: `${SITE_URL}/contato` },
  openGraph: {
    title: "Contato | MyCapy",
    description: "Entre em contato com o MyCapy. Reporte bugs, sugira novas ferramentas ou proponha parcerias.",
    url: `${SITE_URL}/contato`,
    siteName: "MyCapy",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contato | MyCapy",
    description: "Entre em contato com o MyCapy.",
  },
};

export default function ContatoPage() {
  return (
    <Container as="main" className="py-12">
      <BreadcrumbNav items={[{ label: "Contato" }]} className="mb-8" />
      <div className="mx-auto max-w-xl">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Entre em Contato</h1>
          <p className="text-muted-foreground">
            Encontrou um bug? Tem uma sugestão? Quer fazer parceria? Fale conosco!
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Prefere e-mail direto?{" "}
            <a
              href="mailto:rafael.sgomesbr@gmail.com"
              className="font-medium text-primary hover:underline"
            >
              rafael.sgomesbr@gmail.com
            </a>
          </p>
        </header>
        <ContactForm />
      </div>
    </Container>
  );
}
