import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, tools } from "@/lib/tools";
import { getToolMetadata, getToolJsonLd, getBreadcrumbJsonLd, buildGraphJsonLd, SITE_URL } from "@/lib/seo";
import { getCategoryBySlug } from "@/lib/categories";
import { JsonLd } from "@/components/seo/json-ld";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ToolErrorBoundary } from "@/components/shared/tool-error-boundary";

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  // Finanças
  "financas/juros-compostos": lazy(() =>
    import("@/components/features/financas/juros-compostos").then((m) => ({ default: m.JurosCompostos }))
  ),
  "financas/juros-simples": lazy(() =>
    import("@/components/features/financas/juros-simples").then((m) => ({ default: m.JurosSimples }))
  ),
  "financas/simulador-investimentos": lazy(() =>
    import("@/components/features/financas/simulador-investimentos").then((m) => ({ default: m.SimuladorInvestimentos }))
  ),
  "financas/financiamento": lazy(() =>
    import("@/components/features/financas/financiamento").then((m) => ({ default: m.Financiamento }))
  ),
  "financas/emprestimo": lazy(() =>
    import("@/components/features/financas/emprestimo").then((m) => ({ default: m.Emprestimo }))
  ),
  "financas/salario-liquido": lazy(() =>
    import("@/components/features/financas/salario-liquido").then((m) => ({ default: m.SalarioLiquido }))
  ),
  "financas/decimo-terceiro": lazy(() =>
    import("@/components/features/financas/decimo-terceiro").then((m) => ({ default: m.DecimoTerceiro }))
  ),
  "financas/ferias": lazy(() =>
    import("@/components/features/financas/ferias").then((m) => ({ default: m.Ferias }))
  ),
  "financas/rescisao": lazy(() =>
    import("@/components/features/financas/rescisao").then((m) => ({ default: m.Rescisao }))
  ),
  "financas/inss": lazy(() =>
    import("@/components/features/financas/inss").then((m) => ({ default: m.Inss }))
  ),
  "financas/margem-lucro": lazy(() =>
    import("@/components/features/financas/margem-lucro").then((m) => ({ default: m.MargemLucro }))
  ),
  "financas/markup": lazy(() =>
    import("@/components/features/financas/markup").then((m) => ({ default: m.Markup }))
  ),
  "financas/roi": lazy(() =>
    import("@/components/features/financas/roi").then((m) => ({ default: m.Roi }))
  ),
  "financas/cac": lazy(() =>
    import("@/components/features/financas/cac").then((m) => ({ default: m.Cac }))
  ),
  "financas/ticket-medio": lazy(() =>
    import("@/components/features/financas/ticket-medio").then((m) => ({ default: m.TicketMedio }))
  ),
  "financas/taxas-marketplace": lazy(() =>
    import("@/components/features/financas/taxas-marketplace").then((m) => ({ default: m.TaxasMarketplace }))
  ),
  "financas/taxas-cartao": lazy(() =>
    import("@/components/features/financas/taxas-cartao").then((m) => ({ default: m.TaxasCartao }))
  ),
  "financas/pix": lazy(() =>
    import("@/components/features/financas/pix").then((m) => ({ default: m.Pix }))
  ),
  "financas/valor-futuro": lazy(() =>
    import("@/components/features/financas/valor-futuro").then((m) => ({ default: m.ValorFuturo }))
  ),
  "financas/valor-presente": lazy(() =>
    import("@/components/features/financas/valor-presente").then((m) => ({ default: m.ValorPresente }))
  ),
  "financas/cagr": lazy(() =>
    import("@/components/features/financas/cagr").then((m) => ({ default: m.Cagr }))
  ),
  "financas/rentabilidade": lazy(() =>
    import("@/components/features/financas/rentabilidade").then((m) => ({ default: m.Rentabilidade }))
  ),
  "financas/dividend-yield": lazy(() =>
    import("@/components/features/financas/dividend-yield").then((m) => ({ default: m.DividendYield }))
  ),
  "financas/reserva-emergencia": lazy(() =>
    import("@/components/features/financas/reserva-emergencia").then((m) => ({ default: m.ReservaEmergencia }))
  ),
  "financas/independencia-financeira": lazy(() =>
    import("@/components/features/financas/independencia-financeira").then((m) => ({ default: m.IndependenciaFinanceira }))
  ),
  // Texto
  "texto/contador-palavras": lazy(() =>
    import("@/components/features/texto/contador-palavras").then((m) => ({ default: m.ContadorPalavras }))
  ),
  "texto/contador-caracteres": lazy(() =>
    import("@/components/features/texto/contador-caracteres").then((m) => ({ default: m.ContadorCaracteres }))
  ),
  "texto/remover-espacos": lazy(() =>
    import("@/components/features/texto/transformers").then((m) => ({ default: m.RemoverEspacos }))
  ),
  "texto/remover-linhas-vazias": lazy(() =>
    import("@/components/features/texto/transformers").then((m) => ({ default: m.RemoverLinhasVazias }))
  ),
  "texto/maiusculas": lazy(() =>
    import("@/components/features/texto/transformers").then((m) => ({ default: m.Maiusculas }))
  ),
  "texto/minusculas": lazy(() =>
    import("@/components/features/texto/transformers").then((m) => ({ default: m.Minusculas }))
  ),
  "texto/capitalizar-texto": lazy(() =>
    import("@/components/features/texto/transformers").then((m) => ({ default: m.CapitalizarTexto }))
  ),
  "texto/inverter-texto": lazy(() =>
    import("@/components/features/texto/transformers").then((m) => ({ default: m.InverterTexto }))
  ),
  "texto/ordenar-linhas": lazy(() =>
    import("@/components/features/texto/transformers").then((m) => ({ default: m.OrdenarLinhas }))
  ),
  "texto/remover-duplicados": lazy(() =>
    import("@/components/features/texto/transformers").then((m) => ({ default: m.RemoverDuplicados }))
  ),
  "texto/lorem-ipsum": lazy(() =>
    import("@/components/features/texto/lorem-ipsum").then((m) => ({ default: m.LoremIpsum }))
  ),
  "texto/markdown-generator": lazy(() =>
    import("@/components/features/texto/markdown-editor").then((m) => ({ default: m.MarkdownEditor }))
  ),
  "texto/markdown-to-html": lazy(() =>
    import("@/components/features/texto/markdown-editor").then((m) => ({ default: m.MarkdownToHtml }))
  ),
  "texto/html-encode": lazy(() =>
    import("@/components/features/texto/html-tools").then((m) => ({ default: m.HtmlEncode }))
  ),
  "texto/html-decode": lazy(() =>
    import("@/components/features/texto/html-tools").then((m) => ({ default: m.HtmlDecode }))
  ),
  "texto/json-formatter": lazy(() =>
    import("@/components/features/texto/json-tools").then((m) => ({ default: m.JsonFormatter }))
  ),
  "texto/json-validator": lazy(() =>
    import("@/components/features/texto/json-tools").then((m) => ({ default: m.JsonValidator }))
  ),
  "texto/xml-formatter": lazy(() =>
    import("@/components/features/texto/xml-formatter").then((m) => ({ default: m.XmlFormatter }))
  ),
  "texto/csv-formatter": lazy(() =>
    import("@/components/features/texto/csv-formatter").then((m) => ({ default: m.CsvFormatter }))
  ),
  "texto/regex-tester": lazy(() =>
    import("@/components/features/texto/regex-tester").then((m) => ({ default: m.RegexTester }))
  ),
  // Conversores
  "conversores/celsius-fahrenheit": lazy(() =>
    import("@/components/features/conversores/temperatura").then((m) => ({ default: m.CelsiusFahrenheit }))
  ),
  "conversores/fahrenheit-celsius": lazy(() =>
    import("@/components/features/conversores/temperatura").then((m) => ({ default: m.FahrenheitCelsius }))
  ),
  "conversores/kg-libras": lazy(() =>
    import("@/components/features/conversores/peso").then((m) => ({ default: m.KgLibras }))
  ),
  "conversores/libras-kg": lazy(() =>
    import("@/components/features/conversores/peso").then((m) => ({ default: m.LibrasKg }))
  ),
  "conversores/km-milhas": lazy(() =>
    import("@/components/features/conversores/distancia").then((m) => ({ default: m.KmMilhas }))
  ),
  "conversores/milhas-km": lazy(() =>
    import("@/components/features/conversores/distancia").then((m) => ({ default: m.MilhasKm }))
  ),
  "conversores/metros-pes": lazy(() =>
    import("@/components/features/conversores/distancia").then((m) => ({ default: m.MetrosPes }))
  ),
  "conversores/polegadas-cm": lazy(() =>
    import("@/components/features/conversores/distancia").then((m) => ({ default: m.PolegadasCm }))
  ),
  "conversores/litros-galoes": lazy(() =>
    import("@/components/features/conversores/volume").then((m) => ({ default: m.LitrosGaloes }))
  ),
  "conversores/galoes-litros": lazy(() =>
    import("@/components/features/conversores/volume").then((m) => ({ default: m.GaloesLitros }))
  ),
  "conversores/bytes-mb": lazy(() =>
    import("@/components/features/conversores/digital").then((m) => ({ default: m.BytesMb }))
  ),
  "conversores/mb-gb": lazy(() =>
    import("@/components/features/conversores/digital").then((m) => ({ default: m.MbGb }))
  ),
  "conversores/gb-tb": lazy(() =>
    import("@/components/features/conversores/digital").then((m) => ({ default: m.GbTb }))
  ),
  "conversores/horas-minutos": lazy(() =>
    import("@/components/features/conversores/tempo").then((m) => ({ default: m.HorasMinutos }))
  ),
  "conversores/minutos-segundos": lazy(() =>
    import("@/components/features/conversores/tempo").then((m) => ({ default: m.MinutosSegundos }))
  ),
  "conversores/dias-horas": lazy(() =>
    import("@/components/features/conversores/tempo").then((m) => ({ default: m.DiasHoras }))
  ),
  "conversores/conversor-fusos": lazy(() =>
    import("@/components/features/conversores/fusos").then((m) => ({ default: m.ConversorFusos }))
  ),
  "conversores/conversor-tempo": lazy(() =>
    import("@/components/features/conversores/tempo").then((m) => ({ default: m.ConversorTempo }))
  ),
  "conversores/conversor-moedas": lazy(() =>
    import("@/components/features/conversores/moedas").then((m) => ({ default: m.ConversorMoedas }))
  ),
  // Estudos
  "estudos/regra-de-tres": lazy(() =>
    import("@/components/features/estudos/regra-de-tres").then((m) => ({ default: m.RegraDesTres }))
  ),
  "estudos/equacao-segundo-grau": lazy(() =>
    import("@/components/features/estudos/equacao-segundo-grau").then((m) => ({ default: m.EquacaoSegundoGrau }))
  ),
  "estudos/mmc": lazy(() =>
    import("@/components/features/estudos/mmc-mdc").then((m) => ({ default: m.Mmc }))
  ),
  "estudos/mdc": lazy(() =>
    import("@/components/features/estudos/mmc-mdc").then((m) => ({ default: m.Mdc }))
  ),
  "estudos/media-escolar": lazy(() =>
    import("@/components/features/estudos/media").then((m) => ({ default: m.MediaEscolar }))
  ),
  "estudos/media-ponderada": lazy(() =>
    import("@/components/features/estudos/media").then((m) => ({ default: m.MediaPonderada }))
  ),
  "estudos/porcentagem": lazy(() =>
    import("@/components/features/estudos/porcentagem").then((m) => ({ default: m.Porcentagem }))
  ),
  "estudos/fracoes": lazy(() =>
    import("@/components/features/estudos/fracoes").then((m) => ({ default: m.Fracoes }))
  ),
  "estudos/conversor-fracoes": lazy(() =>
    import("@/components/features/estudos/fracoes").then((m) => ({ default: m.ConversorFracoes }))
  ),
  "estudos/notacao-cientifica": lazy(() =>
    import("@/components/features/estudos/notacao-cientifica").then((m) => ({ default: m.NotacaoCientifica }))
  ),
  "estudos/pitagoras": lazy(() =>
    import("@/components/features/estudos/geometria").then((m) => ({ default: m.Pitagoras }))
  ),
  "estudos/area-triangulo": lazy(() =>
    import("@/components/features/estudos/geometria").then((m) => ({ default: m.AreaTriangulo }))
  ),
  "estudos/area-circulo": lazy(() =>
    import("@/components/features/estudos/geometria").then((m) => ({ default: m.AreaCirculo }))
  ),
  "estudos/volume-cubo": lazy(() =>
    import("@/components/features/estudos/geometria").then((m) => ({ default: m.VolumeCubo }))
  ),
  "estudos/calculadora-cientifica": lazy(() =>
    import("@/components/features/estudos/calculadora-cientifica").then((m) => ({ default: m.CalculadoraCientifica }))
  ),
  // Criadores
  "criadores/gerador-hashtags": lazy(() =>
    import("@/components/features/criadores/gerador-hashtags").then((m) => ({ default: m.GeradorHashtags }))
  ),
  "criadores/gerador-bio-instagram": lazy(() =>
    import("@/components/features/criadores/gerador-bio-instagram").then((m) => ({ default: m.GeradorBioInstagram }))
  ),
  "criadores/gerador-username": lazy(() =>
    import("@/components/features/criadores/gerador-username").then((m) => ({ default: m.GeradorUsername }))
  ),
  "criadores/gerador-nome-canal": lazy(() =>
    import("@/components/features/criadores/gerador-nome-canal").then((m) => ({ default: m.GeradorNomeCanal }))
  ),
  "criadores/gerador-titulos": lazy(() =>
    import("@/components/features/criadores/gerador-titulos").then((m) => ({ default: m.GeradorTitulos }))
  ),
  "criadores/gerador-cta": lazy(() =>
    import("@/components/features/criadores/gerador-cta").then((m) => ({ default: m.GeradorCta }))
  ),
  "criadores/gerador-slogans": lazy(() =>
    import("@/components/features/criadores/gerador-slogans").then((m) => ({ default: m.GeradorSlogans }))
  ),
  "criadores/gerador-descricao-youtube": lazy(() =>
    import("@/components/features/criadores/gerador-descricao-youtube").then((m) => ({ default: m.GeradorDescricaoYoutube }))
  ),
  "criadores/gerador-posts": lazy(() =>
    import("@/components/features/criadores/gerador-posts").then((m) => ({ default: m.GeradorPosts }))
  ),
  "criadores/gerador-ideias-conteudo": lazy(() =>
    import("@/components/features/criadores/gerador-ideias-conteudo").then((m) => ({ default: m.GeradorIdeiasConteudo }))
  ),
  // Utilidades
  "utilidades/gerador-qr-code": lazy(() =>
    import("@/components/features/utilidades/gerador-qr-code").then((m) => ({ default: m.GeradorQrCode }))
  ),
  "utilidades/gerador-senhas": lazy(() =>
    import("@/components/features/utilidades/gerador-senhas").then((m) => ({ default: m.GeradorSenhas }))
  ),
  "utilidades/validador-email": lazy(() =>
    import("@/components/features/utilidades/validador-email").then((m) => ({ default: m.ValidadorEmail }))
  ),
  "utilidades/calculadora-idade": lazy(() =>
    import("@/components/features/utilidades/calculadora-idade").then((m) => ({ default: m.CalculadoraIdade }))
  ),
  "utilidades/calculadora-datas": lazy(() =>
    import("@/components/features/utilidades/calculadora-datas").then((m) => ({ default: m.CalculadoraDatas }))
  ),
  "utilidades/sorteador-numeros": lazy(() =>
    import("@/components/features/utilidades/sorteador-numeros").then((m) => ({ default: m.SorteadorNumeros }))
  ),
  "utilidades/gerador-nomes": lazy(() =>
    import("@/components/features/utilidades/gerador-nomes").then((m) => ({ default: m.GeradorNomes }))
  ),
  // Texto (novos)
  "texto/remover-acentos": lazy(() =>
    import("@/components/features/texto/remover-acentos").then((m) => ({ default: m.RemoverAcentos }))
  ),
  "texto/numero-por-extenso": lazy(() =>
    import("@/components/features/texto/numero-por-extenso").then((m) => ({ default: m.NumeroPorExtenso }))
  ),
  "texto/contador-ocorrencias": lazy(() =>
    import("@/components/features/texto/contador-ocorrencias").then((m) => ({ default: m.ContadorOcorrencias }))
  ),
  // Estudos (novos)
  "estudos/numeros-romanos": lazy(() =>
    import("@/components/features/estudos/numeros-romanos").then((m) => ({ default: m.NumerosRomanos }))
  ),
  "estudos/fatorar-numero": lazy(() =>
    import("@/components/features/estudos/fatorar-numero").then((m) => ({ default: m.FatorarNumero }))
  ),
  "estudos/resto-divisao": lazy(() =>
    import("@/components/features/estudos/resto-divisao").then((m) => ({ default: m.RestoDivisao }))
  ),
  // Documentos
  "documentos/gerador-cpf": lazy(() =>
    import("@/components/features/documentos/gerador-cpf").then((m) => ({ default: m.GeradorCpf }))
  ),
  "documentos/validador-cpf": lazy(() =>
    import("@/components/features/documentos/gerador-cpf").then((m) => ({ default: m.ValidadorCpf }))
  ),
  "documentos/gerador-cnpj": lazy(() =>
    import("@/components/features/documentos/gerador-cnpj").then((m) => ({ default: m.GeradorCnpj }))
  ),
  "documentos/validador-cnpj": lazy(() =>
    import("@/components/features/documentos/gerador-cnpj").then((m) => ({ default: m.ValidadorCnpj }))
  ),
  "documentos/gerador-rg": lazy(() =>
    import("@/components/features/documentos/gerador-rg").then((m) => ({ default: m.GeradorRg }))
  ),
  "documentos/gerador-cnh": lazy(() =>
    import("@/components/features/documentos/gerador-cnh").then((m) => ({ default: m.GeradorCnh }))
  ),
  "documentos/gerador-pis": lazy(() =>
    import("@/components/features/documentos/gerador-pis").then((m) => ({ default: m.GeradorPis }))
  ),
  "documentos/gerador-renavam": lazy(() =>
    import("@/components/features/documentos/gerador-renavam").then((m) => ({ default: m.GeradorRenavam }))
  ),
  "documentos/gerador-placa": lazy(() =>
    import("@/components/features/documentos/gerador-placa").then((m) => ({ default: m.GeradorPlaca }))
  ),
  "documentos/gerador-titulo-eleitor": lazy(() =>
    import("@/components/features/documentos/gerador-titulo-eleitor").then((m) => ({ default: m.GeradorTituloEleitor }))
  ),
  "documentos/gerador-cartao-credito": lazy(() =>
    import("@/components/features/documentos/gerador-cartao-credito").then((m) => ({ default: m.GeradorCartaoCredito }))
  ),
  "documentos/gerador-pessoas": lazy(() =>
    import("@/components/features/documentos/gerador-pessoas").then((m) => ({ default: m.GeradorPessoas }))
  ),
};

interface PageProps {
  params: Promise<{ categoria: string; ferramenta: string }>;
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    categoria: tool.category,
    ferramenta: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria, ferramenta } = await params;
  const tool = getToolBySlug(categoria, ferramenta);
  if (!tool) return { title: "Ferramenta não encontrada" };
  const meta = getToolMetadata(tool);
  return meta;
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default async function FerramentaPage({ params }: PageProps) {
  const { categoria, ferramenta } = await params;
  const tool = getToolBySlug(categoria, ferramenta);
  if (!tool) notFound();

  const category = getCategoryBySlug(categoria);
  const key = `${categoria}/${ferramenta}`;
  const ToolComponent = toolComponents[key];

  const jsonLd = buildGraphJsonLd([
    getToolJsonLd(tool),
    getBreadcrumbJsonLd([
      { name: "Início", url: `${SITE_URL}/` },
      { name: "Ferramentas", url: `${SITE_URL}/ferramentas` },
      { name: category?.name || categoria, url: `${SITE_URL}/ferramentas/${categoria}` },
      { name: tool.name, url: `${SITE_URL}/ferramentas/${categoria}/${ferramenta}` },
    ]),
  ]);

  if (!ToolComponent) {
    return (
      <>
        <JsonLd data={jsonLd} />
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Ferramenta em desenvolvimento...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <ToolErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <ToolComponent />
        </Suspense>
      </ToolErrorBoundary>
    </>
  );
}
