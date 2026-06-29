"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const faqs = [
  {
    question: "O que é Markdown?",
    answer: "Markdown é uma linguagem de marcação leve criada por John Gruber em 2004. Usa símbolos simples como # para títulos, ** para negrito, * para itálico e permite criar documentos formatados de forma legível mesmo sem renderização. É o padrão de escrita no GitHub, Reddit, Notion, Obsidian e a maioria dos sistemas de documentação técnica.",
  },
  {
    question: "Quais são os elementos Markdown mais usados?",
    answer: "Os mais comuns são: # H1, ## H2, ### H3 para títulos; **negrito** e *itálico* para ênfase; - ou * para listas não ordenadas; 1. para listas numeradas; `código` para inline code e blocos com três crases; > para citações (blockquote); [texto](url) para links; ![alt](url) para imagens; --- para linha horizontal.",
  },
  {
    question: "Markdown é o mesmo que HTML?",
    answer: "Não, mas Markdown é convertido para HTML. Markdown foi criado para ser mais legível e fácil de escrever do que HTML puro. A maioria das plataformas converte Markdown para HTML automaticamente na renderização. Você pode também misturar HTML dentro de Markdown quando precisar de elementos mais complexos.",
  },
  {
    question: "Quais plataformas usam Markdown?",
    answer: "Markdown é amplamente usado em: GitHub e GitLab (READMEs, issues, PRs), Notion, Obsidian, Roam Research (notas), Reddit, Discord e Slack (variantes), Jekyll e Hugo (sites estáticos), Jupyter Notebooks, Stack Overflow, e praticamente todos os geradores de documentação como MkDocs, Docusaurus e GitBook.",
  },
  {
    question: "Existe diferença entre variantes de Markdown?",
    answer: "Sim. O Markdown original (CommonMark) é a especificação base. Existem extensões populares: GitHub Flavored Markdown (GFM) adiciona tabelas, listas de tarefas e syntax highlighting; MultiMarkdown adiciona notas de rodapé e tabelas mais avançadas; MDX permite componentes React dentro de Markdown. Cada plataforma pode suportar variantes diferentes.",
  },
];

function simpleMarkdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h1-6|li|blockquote])(.+)$/gm, (match) => (match.trim() ? match : ""));
}

const DEFAULT_MARKDOWN = `# Título Principal

## Subtítulo

Este é um parágrafo com **negrito** e *itálico*.

- Item um
- Item dois
- Item três

> Citação importante aqui

[Link de exemplo](https://mycapy.app)`;

export function MarkdownEditor() {
  const tool = getToolBySlug("texto", "markdown-generator")!;
  const [md, setMd] = useState(DEFAULT_MARKDOWN);

  const html = simpleMarkdownToHtml(md);

  const explanation = (
    <div className="space-y-3">
      <p>
        O editor mostra em tempo real como o Markdown é renderizado em HTML. Digite no painel
        esquerdo e veja o resultado formatado no painel direito instantaneamente. O conversor
        suporta os elementos mais comuns: títulos (H1-H3), negrito, itálico, código inline,
        listas, citações e links.
      </p>
      <p>
        A conversão acontece localmente no navegador — nenhum texto é enviado a servidores.
        Ideal para escrever e revisar documentação, READMEs, posts e qualquer conteúdo que
        use Markdown como formato de entrada.
      </p>
    </div>
  );

  const examples = (
    <div className="space-y-3">
      <div className="rounded-lg border p-4">
        <p className="font-medium mb-2">Referência rápida de sintaxe</p>
        <div className="grid sm:grid-cols-2 gap-1 font-mono text-sm text-muted-foreground">
          <span># Título H1</span><span>→ Título grande</span>
          <span>## Título H2</span><span>→ Subtítulo</span>
          <span>**negrito**</span><span>→ <strong>negrito</strong></span>
          <span>*itálico*</span><span>→ <em>itálico</em></span>
          <span>`código`</span><span>→ inline code</span>
          <span>- item</span><span>→ lista com marcador</span>
          <span>[texto](url)</span><span>→ hiperlink</span>
          <span>&gt; citação</span><span>→ blockquote</span>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout tool={tool} faqs={faqs} explanation={explanation} examples={examples}>
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="md-editor">Markdown</Label>
              <textarea
                id="md-editor"
                value={md}
                onChange={(e) => setMd(e.target.value)}
                className="min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>
            <div className="space-y-2">
              <Label>Preview</Label>
              <div
                className="min-h-[400px] rounded-md border bg-muted/30 p-3 text-sm prose prose-sm dark:prose-invert max-w-none overflow-auto"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function MarkdownToHtml() {
  const tool = getToolBySlug("texto", "markdown-to-html")!;
  const [md, setMd] = useState("");
  const [copied, setCopied] = useState(false);
  const html = simpleMarkdownToHtml(md);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [html]);

  const explanation2 = (
    <div className="space-y-3">
      <p>
        Cole qualquer texto em Markdown no campo de entrada e obtenha o HTML equivalente
        pronto para usar. O conversor processa títulos, formatação (negrito, itálico),
        listas, citações, links e código inline — os elementos mais comuns da especificação
        CommonMark.
      </p>
      <p>
        O HTML gerado pode ser colado diretamente em sistemas que não suportam Markdown
        nativo, como editores de e-mail, CMS legados, ou templates de e-mail marketing.
      </p>
    </div>
  );

  const examples2 = (
    <div className="space-y-3">
      <div className="rounded-lg border p-4 font-mono text-sm">
        <p className="font-sans font-medium mb-2 not-italic">Entrada Markdown:</p>
        <p className="text-muted-foreground"># Título</p>
        <p className="text-muted-foreground">Texto com **negrito** e *itálico*.</p>
        <p className="font-sans font-medium mt-3 mb-2 not-italic">HTML gerado:</p>
        <p className="text-muted-foreground">&lt;h1&gt;Título&lt;/h1&gt;</p>
        <p className="text-muted-foreground">&lt;p&gt;Texto com &lt;strong&gt;negrito&lt;/strong&gt; e &lt;em&gt;itálico&lt;/em&gt;.&lt;/p&gt;</p>
      </div>
    </div>
  );

  return (
    <ToolLayout tool={tool} faqs={faqs} explanation={explanation2} examples={examples2}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="md-input">Markdown</Label>
            <textarea
              id="md-input"
              value={md}
              onChange={(e) => setMd(e.target.value)}
              placeholder="Cole o seu Markdown aqui..."
              className="min-h-[180px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>
          {html && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>HTML gerado</Label>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2 h-8">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado!" : "Copiar HTML"}
                </Button>
              </div>
              <div className="min-h-[180px] rounded-md border bg-muted/30 p-3 font-mono text-sm whitespace-pre-wrap">{html}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
