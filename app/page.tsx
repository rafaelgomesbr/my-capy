import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Container } from "@/components/layout/container";
import { CategoryCard } from "@/components/shared/category-card";
import { ToolCard } from "@/components/shared/tool-card";
import { FAQSection } from "@/components/shared/faq-section";
import { HeroSearch } from "@/components/shared/hero-search";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AdMiddle } from "@/components/ads/ad-middle";
import { categories } from "@/lib/categories";
import { getPopularTools, getToolsByCategory, tools } from "@/lib/tools";
import { SITE_URL, SITE_NAME, buildGraphJsonLd, getFaqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MyCapy — Ferramentas Gratuitas Online",
  description:
    "Mais de 90 ferramentas gratuitas online: calculadoras financeiras, conversores, ferramentas de texto, estudos e muito mais. Sem cadastro, sem complicação.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "MyCapy — Ferramentas Gratuitas Online",
    description: "Mais de 90 ferramentas gratuitas online. Sem cadastro, sem complicação.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyCapy — Ferramentas Gratuitas Online",
    description: "Mais de 90 ferramentas gratuitas online. Sem cadastro.",
  },
};

const homeFaqs = [
  {
    question: "As ferramentas do MyCapy são realmente gratuitas?",
    answer:
      "Sim! Todas as ferramentas do MyCapy são 100% gratuitas e não requerem cadastro ou login. Você pode usar quantas vezes quiser, sem limitações.",
  },
  {
    question: "Preciso criar uma conta para usar as ferramentas?",
    answer:
      "Não. Todas as ferramentas funcionam diretamente no seu navegador, sem necessidade de cadastro, login ou instalação de qualquer software.",
  },
  {
    question: "Os dados que eu insiro nas ferramentas são salvos?",
    answer:
      "Não. Todos os cálculos e processamentos são feitos localmente no seu navegador. Nenhum dado é enviado para nossos servidores.",
  },
  {
    question: "Posso usar o MyCapy no celular?",
    answer:
      "Sim! O MyCapy é totalmente responsivo e funciona perfeitamente em smartphones, tablets e computadores.",
  },
  {
    question: "Com que frequência novas ferramentas são adicionadas?",
    answer:
      "Adicionamos novas ferramentas regularmente com base nas sugestões dos usuários. Se você tem uma sugestão, entre em contato conosco!",
  },
];

const homeJsonLd = buildGraphJsonLd([
  {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Mais de 90 ferramentas gratuitas online para facilitar o seu dia a dia.",
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/ferramentas?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Portal de ferramentas gratuitas online.",
  },
  getFaqJsonLd(homeFaqs),
]);

const popularTools = getPopularTools(8);

const features = [
  {
    icon: Zap,
    title: "Instantâneo",
    description: "Sem login, sem cadastro. Acesse qualquer ferramenta em menos de 3 segundos.",
  },
  {
    icon: Shield,
    title: "100% Privado",
    description: "Tudo roda no seu navegador. Nenhum dado é enviado para nossos servidores.",
  },
  {
    icon: Globe,
    title: "Qualquer Dispositivo",
    description: "Otimizado para celular, tablet e desktop. Funciona em qualquer tela.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd} />

      <main>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden border-b py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 hero-gradient" aria-hidden="true" />
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {tools.length}+ ferramentas gratuitas
              </p>

              <h1
                className="mb-5 text-4xl font-bold sm:text-5xl lg:text-[3.5rem]"
                style={{ letterSpacing: "-0.025em", lineHeight: "1.1" }}
              >
                Ferramentas online para{" "}
                <span className="text-gradient">qualquer desafio</span>
              </h1>

              <p className="mb-10 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Calculadoras financeiras, conversores, texto, estudos e muito mais.
                Tudo gratuito, sem cadastro e sem limite de uso.
              </p>

              <div className="flex flex-col items-center gap-6">
                <HeroSearch />
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Link href="/ferramentas">
                    <Button size="sm" className="gap-1.5 text-sm font-medium">
                      Explorar ferramentas
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href="/ferramentas/financas">
                    <Button size="sm" variant="ghost" className="gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                      Calculadoras financeiras
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Container>

          {/* Stats strip */}
          <div className="mt-16 border-t">
            <Container>
              <div className="grid grid-cols-3 sm:grid-cols-6">
                {categories.map((cat) => {
                  const count = getToolsByCategory(cat.slug).length;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/ferramentas/${cat.slug}`}
                      className="group flex flex-col items-center gap-1 border-r border-border/60 px-4 py-4 last:border-r-0 transition-colors hover:text-primary [&:nth-child(3)]:border-r-0 sm:[&:nth-child(3)]:border-r"
                    >
                      <span className="text-xl font-semibold tabular-nums leading-none" style={{ letterSpacing: "-0.02em" }}>{count}</span>
                      <span className="text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            </Container>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="border-b py-10" aria-labelledby="features-heading">
          <Container>
            <h2 id="features-heading" className="sr-only">Por que usar o MyCapy</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <feature.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-semibold">{feature.title}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── CATEGORIAS ── */}
        <section className="py-16 sm:py-20" aria-labelledby="categories-heading">
          <Container>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Categorias
                </p>
                <h2
                  id="categories-heading"
                  className="text-2xl font-bold sm:text-3xl"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Tudo que você precisa
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {categories.length} categorias · {tools.length} ferramentas
                </p>
              </div>
              <Link
                href="/ferramentas"
                className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
              >
                Ver todas <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </Container>
        </section>

        <Separator />

        {/* ── AD ── */}
        <Container>
          <AdMiddle />
        </Container>

        {/* ── POPULARES ── */}
        <section className="py-16 sm:py-20" aria-labelledby="popular-tools-heading">
          <Container>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Mais usadas
                </p>
                <h2
                  id="popular-tools-heading"
                  className="text-2xl font-bold sm:text-3xl"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Ferramentas populares
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  As mais acessadas pelos nossos usuários
                </p>
              </div>
              <Link
                href="/ferramentas"
                className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
              >
                Ver todas <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {popularTools.map((tool) => (
                <ToolCard key={`${tool.category}/${tool.slug}`} tool={tool} />
              ))}
            </div>
          </Container>
        </section>

        <Separator />

        {/* ── FAQ ── */}
        <section className="border-t py-16 sm:py-20" aria-labelledby="faq-home-heading">
          <Container>
            <div className="mx-auto max-w-2xl">
              <p className="mb-1.5 text-center font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Dúvidas
              </p>
              <h2
                id="faq-home-heading"
                className="mb-8 text-center text-2xl font-bold sm:text-3xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                Perguntas frequentes
              </h2>
              <FAQSection faqs={homeFaqs} title="" />
            </div>
          </Container>
        </section>

        {/* ── CTA ── */}
        <section className="border-t py-16 sm:py-20">
          <Container>
            <div className="mx-auto max-w-xl text-center">
              <h2
                className="mb-3 text-2xl font-bold sm:text-3xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                Pronto para começar?
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                Acesse todas as ferramentas gratuitamente. Sem cadastro, sem limite, para sempre.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Link href="/ferramentas">
                  <Button size="sm" className="gap-1.5 font-medium">
                    Explorar todas as ferramentas
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href="/contato">
                  <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground hover:text-foreground">
                    Sugerir ferramenta
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
