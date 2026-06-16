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

const categoryIntros: Record<string, { intro: string; details: string; useCases: string }> = {
  financas: {
    intro:
      "As calculadoras financeiras do MyCapy foram desenvolvidas para ajudar você a tomar decisões financeiras mais inteligentes no dia a dia. Seja para calcular investimentos, simular financiamentos, entender descontos no holerite ou planejar sua aposentadoria antecipada, tudo está aqui — gratuito e sem cadastro.",
    details:
      "Cobrimos desde o básico (juros simples e compostos) até ferramentas mais avançadas como simulador de investimentos com aportes mensais, calculadora FIRE para independência financeira, análise de rentabilidade e dividend yield para investidores em ações e FIIs. Para empresários e autônomos, temos calculadoras de markup, margem de lucro, ROI, CAC e taxas de marketplace.",
    useCases:
      "Use nossas calculadoras para: comparar produtos de investimento, descobrir quanto rende seu dinheiro no CDB ou Tesouro Direto, simular parcelas de financiamento imobiliário, calcular seu salário líquido com descontos de INSS e IRRF, ou descobrir quanto você precisa acumular para se aposentar.",
  },
  texto: {
    intro:
      "As ferramentas de texto do MyCapy atendem desde estudantes que precisam contar palavras até desenvolvedores que trabalham com JSON, XML e expressões regulares. Todas funcionam diretamente no navegador, sem enviar seus dados para nenhum servidor.",
    details:
      "Nossa coleção inclui contadores de palavras e caracteres com estatísticas detalhadas (linhas, parágrafos, tempo de leitura), transformadores de texto (maiúsculas, minúsculas, capitalização, inversão), ferramentas de limpeza (remover espaços, linhas vazias, duplicatas) e utilitários para desenvolvedores como formatador de JSON, XML e CSV, HTML encoder/decoder, testador de regex e gerador de Lorem Ipsum.",
    useCases:
      "Ideal para: revisores de texto que precisam verificar limites de caracteres para redes sociais, desenvolvedores que querem formatar e validar JSON de APIs, escritores que precisam gerar Lorem Ipsum para mockups, ou qualquer pessoa que precise transformar texto sem instalar software.",
  },
  conversores: {
    intro:
      "Os conversores de unidades do MyCapy são precisos, rápidos e cobrem as conversões mais usadas no cotidiano brasileiro — de temperatura e peso a moedas e fusos horários. Resultados instantâneos, sem precisar decorar fórmulas.",
    details:
      "Convertemos temperatura (Celsius, Fahrenheit, Kelvin), peso (kg, libras, gramas, onças), distância (km, milhas, metros, pés, polegadas, centímetros), volume (litros, galões, mililitros), armazenamento digital (bytes, KB, MB, GB, TB), tempo (horas, minutos, segundos, dias) e fusos horários ao redor do mundo. Também oferecemos conversor de moedas com cotações atualizadas.",
    useCases:
      "Útil para: compras internacionais em sites americanos que usam libras e polegadas, viagens ao exterior que exigem conversão de temperatura e moedas, receitas culinárias com medidas em galões ou xícaras, profissionais de TI que precisam converter unidades de armazenamento, ou qualquer situação que envolva unidades de medida diferentes.",
  },
  estudos: {
    intro:
      "As calculadoras matemáticas do MyCapy foram desenvolvidas para estudantes do ensino fundamental ao superior, além de profissionais que precisam de cálculos matemáticos precisos no dia a dia. Do básico ao avançado, de forma clara e didática.",
    details:
      "Cobrimos álgebra (equação do segundo grau, regra de três, frações, porcentagem, notação científica), teoria dos números (MMC, MDC, fatoração, números romanos, resto de divisão), estatística (média aritmética, média ponderada, média escolar), geometria (teorema de Pitágoras, área de triângulos e círculos, volume de cubo) e uma calculadora científica completa com funções trigonométricas.",
    useCases:
      "Use para: resolver listas de exercícios de matemática, verificar respostas de provas, converter notas e calcular médias escolares, resolver problemas do dia a dia envolvendo porcentagens e frações, ou simplesmente ter uma calculadora científica acessível no celular sem precisar de aplicativo.",
  },
  criadores: {
    intro:
      "As ferramentas para criadores de conteúdo do MyCapy usam inteligência artificial para ajudar você a produzir mais em menos tempo. Hashtags, bios, títulos, CTAs e ideias de conteúdo gerados com IA para impulsionar seu alcance nas redes sociais.",
    details:
      "Com nossa suíte de ferramentas IA para criadores, você pode gerar sets de hashtags segmentadas para Instagram, TikTok, Twitter/X, LinkedIn e YouTube, criar bios de impacto para seu perfil, descobrir nomes de usuário e canais disponíveis, gerar títulos de posts e vídeos otimizados, criar CTAs (chamadas para ação) persuasivas, desenvolver slogans memoráveis e brainstormar ideias de conteúdo para semanas.",
    useCases:
      "Ideal para: criadores de conteúdo que querem aumentar o alcance orgânico, empreendedores que gerenciam redes sociais sem equipe de marketing, agências que precisam escalar produção de conteúdo, ou qualquer pessoa que está começando nas redes sociais e precisa de orientação sobre estratégia de conteúdo.",
  },
  utilidades: {
    intro:
      "As ferramentas de utilidade do MyCapy resolvem tarefas práticas do dia a dia: gerar senhas seguras, criar QR Codes, validar e-mails, calcular idades e diferenças entre datas. Tudo sem cadastro, sem aplicativo, direto no navegador.",
    details:
      "Nossa seção de utilidades inclui: gerador de senhas com configurações de comprimento e complexidade, gerador de QR Code para links, textos e contatos, validador de endereços de e-mail, calculadora de idade precisa (anos, meses e dias), calculadora de diferença entre datas, sorteador de números aleatórios e gerador de nomes para projetos e personagens.",
    useCases:
      "Use para: criar senhas seguras para novas contas, gerar QR Codes para divulgar seu site ou contato, verificar se um e-mail tem formato válido antes de enviar, saber exatamente quantos dias faltam para uma data importante, ou precisar de um número ou nome aleatório para um projeto.",
  },
  documentos: {
    intro:
      "As ferramentas de documentos do MyCapy geram e validam dados de documentos brasileiros para fins de teste e desenvolvimento de software. Todos os dados gerados são fictícios e válidos apenas para uso em ambientes de teste — nunca para fins fraudulentos.",
    details:
      "Geramos e validamos CPF, CNPJ, RG, CNH, PIS/PASEP, RENAVAM, placas de veículos (formato antigo e Mercosul) e Título de Eleitor. Também temos gerador de cartões de crédito para teste (com números válidos pelo algoritmo Luhn) e gerador de pessoas completas (com nome, CPF, endereço e data de nascimento) para popular bancos de dados de desenvolvimento.",
    useCases:
      "Essencial para: desenvolvedores que precisam testar formulários com validação de CPF/CNPJ, QA engineers que precisam de massa de dados para testes, criação de ambientes de homologação e staging, ou qualquer situação em que você precise de dados brasileiros válidos para desenvolvimento de software — nunca para fins reais ou fraudulentos.",
  },
};

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria } = await params;
  const category = getCategoryBySlug(categoria);
  if (!category) notFound();

  const categoryTools = getToolsByCategory(categoria);
  const intro = categoryIntros[categoria];

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

        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Ferramentas de {category.name}
          </h1>
          <p className="text-lg text-muted-foreground">{category.description}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {categoryTools.length} {categoryTools.length === 1 ? "ferramenta" : "ferramentas"}{" "}
            disponíveis · gratuitas e sem cadastro
          </p>
        </header>

        {intro && (
          <div className="mb-10 rounded-xl border bg-muted/20 p-6">
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>{intro.intro}</p>
              <p>{intro.details}</p>
              <p>{intro.useCases}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryTools.map((tool) => (
            <ToolCard key={`${tool.category}/${tool.slug}`} tool={tool} />
          ))}
        </div>
      </Container>
    </>
  );
}
