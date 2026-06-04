import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { Zap, Shield, Globe, Heart } from "lucide-react";
import { SITE_URL } from "@/lib/seo";
import { tools } from "@/lib/tools";
import { categories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Sobre o MyCapy",
  description: "Conheça o MyCapy: nossa missão, valores e o time por trás das ferramentas gratuitas online mais completas do Brasil.",
  alternates: { canonical: `${SITE_URL}/sobre` },
};

const values = [
  { icon: Zap, title: "Gratuito para sempre", desc: "Acreditamos que boas ferramentas devem ser acessíveis a todos, sem barreiras." },
  { icon: Shield, title: "Privacidade total", desc: "Todos os cálculos acontecem no seu navegador. Seus dados nunca saem do seu dispositivo." },
  { icon: Globe, title: "Para todos os devices", desc: "Funciona perfeitamente em qualquer tela — celular, tablet ou computador." },
  { icon: Heart, title: "Feito com dedicação", desc: "Cada ferramenta é construída pensando na experiência do usuário e na utilidade real." },
];

export default function SobrePage() {
  return (
    <Container as="main" className="py-12">
      <BreadcrumbNav items={[{ label: "Sobre" }]} className="mb-8" />
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Sobre o MyCapy</h1>
          <p className="text-lg text-muted-foreground">
            Nossa missão é democratizar o acesso a ferramentas úteis e de qualidade para todos os brasileiros.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">O que é o MyCapy?</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              O MyCapy é uma plataforma de ferramentas online gratuitas criada para simplificar tarefas do dia a dia.
              Com mais de <strong className="text-foreground">{tools.length} ferramentas</strong> organizadas em{" "}
              <strong className="text-foreground">{categories.length} categorias</strong>, nosso objetivo é ser o ponto
              de referência para calculadoras, conversores e utilitários no Brasil.
            </p>
            <p>
              Todas as ferramentas funcionam diretamente no navegador — sem cadastro, sem instalação e sem
              compartilhamento de dados. Acreditamos que ferramentas úteis devem ser simples, rápidas e acessíveis.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Nossos valores</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4 rounded-xl border p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{v.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-muted/30 p-6 text-center">
          <h2 className="mb-2 text-xl font-bold">Quer sugerir uma ferramenta?</h2>
          <p className="text-muted-foreground">
            Adoramos ouvir feedback e sugestões da nossa comunidade.{" "}
            <a href="/contato" className="text-primary underline-offset-4 hover:underline">
              Entre em contato
            </a>{" "}
            e nos conte o que você precisa.
          </p>
        </section>
      </div>
    </Container>
  );
}
