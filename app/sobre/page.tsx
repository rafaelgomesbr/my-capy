import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Zap, Shield, Globe, Heart, Users, Target, Clock, Star, Mail, Code2 } from "lucide-react";
import { SITE_URL } from "@/lib/seo";
import { tools } from "@/lib/tools";
import { categories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Sobre o MyCapy — Quem Somos e Nossa Missão",
  description: "Conheça o MyCapy: nossa história, missão, valores e o projeto por trás das ferramentas gratuitas online mais completas do Brasil. Mais de 90 ferramentas, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/sobre` },
};

const values = [
  { icon: Zap, title: "Gratuito para sempre", desc: "Acreditamos que boas ferramentas devem ser acessíveis a todos, sem barreiras financeiras ou cadastros obrigatórios." },
  { icon: Shield, title: "Privacidade total", desc: "Todos os cálculos acontecem no seu navegador. Seus dados nunca saem do seu dispositivo e nunca são armazenados em nossos servidores." },
  { icon: Globe, title: "Para todos os dispositivos", desc: "Funciona perfeitamente em qualquer tela — celular, tablet ou computador. Design responsivo pensado para o uso real do dia a dia." },
  { icon: Heart, title: "Feito com dedicação", desc: "Cada ferramenta é construída pensando na experiência do usuário e na utilidade real. Nada genérico, nada desnecessário." },
];

const stats = [
  { icon: Target, label: "Ferramentas disponíveis", value: `${tools.length}+` },
  { icon: Users, label: "Categorias de ferramentas", value: `${categories.length}` },
  { icon: Clock, label: "Tempo médio de uso", value: "< 3s" },
  { icon: Star, label: "Sem cadastro necessário", value: "100%" },
];

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MyCapy",
  url: SITE_URL,
  description:
    "Plataforma brasileira de ferramentas online gratuitas: calculadoras financeiras, conversores, ferramentas de texto e muito mais.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "rafael.sgomesbr@gmail.com",
    availableLanguage: "Portuguese",
  },
  foundingDate: "2025",
  areaServed: "BR",
  inLanguage: "pt-BR",
};

export default function SobrePage() {
  return (
    <Container as="main" className="py-12">
      <JsonLd data={organizationJsonLd} />
      <BreadcrumbNav items={[{ label: "Sobre" }]} className="mb-8" />
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Sobre o MyCapy</h1>
          <p className="text-lg text-muted-foreground">
            Nossa missão é democratizar o acesso a ferramentas úteis e de qualidade para todos os brasileiros — sem barreiras, sem cadastro, sem custo.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">O que é o MyCapy?</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              O MyCapy é uma plataforma brasileira de ferramentas online gratuitas criada para simplificar tarefas
              do dia a dia de estudantes, profissionais, empreendedores e qualquer pessoa que precise de uma
              calculadora, conversor ou utilitário rápido.
            </p>
            <p>
              Com mais de <strong className="text-foreground">{tools.length} ferramentas</strong> organizadas em{" "}
              <strong className="text-foreground">{categories.length} categorias</strong>, o MyCapy cobre desde
              calculadoras financeiras completas (juros compostos, simulador de investimentos, cálculo de INSS e
              salário líquido) até conversores de unidades, ferramentas de texto para desenvolvedores e geradores
              de conteúdo para criadores de redes sociais.
            </p>
            <p>
              Todas as ferramentas funcionam diretamente no navegador — sem cadastro, sem instalação e sem
              compartilhamento de dados. Acreditamos que ferramentas úteis devem ser simples, rápidas e acessíveis
              a qualquer pessoa com acesso à internet, independente de renda ou conhecimento técnico.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Nossa história</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              O MyCapy nasceu da frustração com a experiência típica de buscar ferramentas online no Brasil:
              sites lentos, cheios de anúncios invasivos, que pedem cadastro para funções básicas ou que
              simplesmente não funcionam bem no celular.
            </p>
            <p>
              Criado em 2025, o projeto começou com um punhado de calculadoras financeiras e cresceu rapidamente
              para cobrir as necessidades mais comuns de quem trabalha, estuda ou empreende no Brasil. Cada
              ferramenta adicionada passa por um processo de curadoria: só entra no MyCapy o que resolve um
              problema real de forma clara e eficiente.
            </p>
            <p>
              Hoje o MyCapy é um projeto independente, desenvolvido e mantido de forma contínua com foco na
              qualidade da experiência do usuário. Contamos com o feedback da nossa comunidade para priorizar
              novas ferramentas e melhorar as existentes.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Números do MyCapy</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center rounded-xl border p-5 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
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

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">O que você encontra aqui</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">Finanças:</strong> Calculadoras de juros compostos e simples,
              simulador de investimentos, cálculo de INSS, IRRF, salário líquido, 13º salário, férias, rescisão,
              margem de lucro, ROI, CAC, ticket médio, dividend yield, reserva de emergência e muito mais.
            </p>
            <p>
              <strong className="text-foreground">Texto e desenvolvimento:</strong> Contador de palavras e
              caracteres, transformadores de texto, gerador de Lorem Ipsum, formatador e validador de JSON, XML,
              CSV, HTML encoder/decoder e testador de regex.
            </p>
            <p>
              <strong className="text-foreground">Conversores:</strong> Temperatura, peso, distância, volume,
              armazenamento digital, tempo e fusos horários, além de conversor de moedas com cotações atualizadas.
            </p>
            <p>
              <strong className="text-foreground">Estudos:</strong> Regra de três, equação do segundo grau, MMC
              e MDC, médias, porcentagem, frações, notação científica, geometria e calculadora científica completa.
            </p>
            <p>
              <strong className="text-foreground">Criadores de conteúdo:</strong> Gerador de hashtags com IA,
              bio para Instagram, nomes de usuário e canal, títulos, CTAs, slogans e ideias de conteúdo.
            </p>
            <p>
              <strong className="text-foreground">Utilidades:</strong> Gerador de QR Code, senhas seguras,
              validador de e-mail, calculadora de idades e datas, sorteador e gerador de nomes.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Quem mantém o MyCapy</h2>
          <div className="rounded-xl border p-6 flex flex-col sm:flex-row gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Code2 className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-2 text-muted-foreground">
              <p>
                O MyCapy é desenvolvido e mantido por um desenvolvedor brasileiro independente apaixonado
                por criar produtos que resolvam problemas reais do cotidiano. O projeto é construído com
                Next.js, TypeScript e Tailwind CSS, com foco total em performance, acessibilidade e
                experiência do usuário.
              </p>
              <p>
                Toda decisão de produto é guiada por uma pergunta simples: <em>&quot;Isso resolve um problema
                real de forma mais rápida e simples do que qualquer alternativa existente?&quot;</em> Se a resposta
                for sim, a ferramenta entra no MyCapy.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Mail className="h-4 w-4 shrink-0" />
                <a
                  href="mailto:rafael.sgomesbr@gmail.com"
                  className="text-primary hover:underline underline-offset-4 font-medium"
                >
                  rafael.sgomesbr@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-muted/30 p-6">
          <h2 className="mb-2 text-xl font-bold">Quer sugerir uma ferramenta ou reportar um problema?</h2>
          <p className="text-muted-foreground">
            Adoramos ouvir feedback e sugestões da nossa comunidade. Se encontrou um bug, tem uma ideia de nova
            ferramenta ou quer nos contar sobre sua experiência com o MyCapy, fale com a gente!{" "}
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
