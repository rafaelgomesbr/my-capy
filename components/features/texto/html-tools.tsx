"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

function HtmlTool({ slug, transform, inputLabel, outputLabel, buttonLabel, faqs, explanation, examples }: {
  slug: "html-encode" | "html-decode";
  transform: (t: string) => string;
  inputLabel: string;
  outputLabel: string;
  buttonLabel: string;
  faqs: { question: string; answer: string }[];
  explanation?: React.ReactNode;
  examples?: React.ReactNode;
}) {
  const tool = getToolBySlug("texto", slug)!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => setOutput(transform(input)), [input, transform]);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolLayout tool={tool} faqs={faqs} explanation={explanation} examples={examples}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`in-${slug}`}>{inputLabel}</Label>
            <textarea id={`in-${slug}`} value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Cole o texto aqui..."
              className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
          </div>
          <Button onClick={run} className="w-full">{buttonLabel}</Button>
          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{outputLabel}</Label>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2 h-8">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
              <div className="min-h-[140px] rounded-md border bg-muted/30 p-3 font-mono text-sm whitespace-pre-wrap">{output}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function HtmlEncode() {
  return (
    <HtmlTool
      slug="html-encode"
      transform={(t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")}
      inputLabel="Texto a codificar"
      outputLabel="HTML encoded"
      buttonLabel="Codificar HTML"
      faqs={[
        { question: "Por que codificar HTML?", answer: "Para exibir caracteres especiais (<, >, &, \") como texto literal em uma página HTML sem que o navegador os interprete como código. Sem codificação, um '<' insere uma tag HTML no DOM." },
        { question: "Quais caracteres são convertidos?", answer: "Os principais: & → &amp;, < → &lt;, > → &gt;, \" → &quot; e ' → &#39;. Esses são os cinco caracteres que têm significado especial na sintaxe HTML." },
        { question: "Isso é necessário para prevenir XSS?", answer: "Sim. HTML encoding é uma das principais defesas contra ataques XSS (Cross-Site Scripting). Ao codificar o conteúdo gerado por usuários antes de exibir no HTML, scripts maliciosos são neutralizados." },
        { question: "Qual a diferença entre HTML encoding e URL encoding?", answer: "HTML encoding converte caracteres para entidades HTML (&lt;, &amp;). URL encoding converte caracteres para o formato %XX (espaço → %20, & → %26). São usados em contextos diferentes." },
        { question: "Quando devo usar HTML encoding no backend?", answer: "Sempre que for inserir dados de usuário diretamente em templates HTML. Frameworks modernos (React, Vue, Angular) fazem isso automaticamente. Em templates de string manuais ou SQL raw, o encoding deve ser explícito." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            HTML encoding (ou escape de HTML) converte caracteres que têm significado especial na linguagem
            HTML em suas respectivas entidades de texto. Isso permite exibir o caractere visualmente sem que
            o navegador o interprete como marcação. Por exemplo, <code className="rounded bg-muted px-1 font-mono text-xs">{"<script>"}</code>{" "}
            exibido em HTML deve ser codificado como{" "}
            <code className="rounded bg-muted px-1 font-mono text-xs">{"&lt;script&gt;"}</code>.
          </p>
          <p>
            Além de garantir a exibição correta, o HTML encoding é uma medida de segurança essencial contra
            ataques XSS. Qualquer conteúdo gerado por usuário (comentários, nomes, inputs de formulários)
            deve ser codificado antes de ser inserido no HTML da página.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Codificando uma tag para exibição</p>
            <p className="mt-1 text-sm text-muted-foreground">Entrada: <span className="font-mono">{"<h1>Título & Subtítulo</h1>"}</span></p>
            <p className="mt-1 text-sm text-primary">Saída: <span className="font-mono">{"&lt;h1&gt;Título &amp; Subtítulo&lt;/h1&gt;"}</span></p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Tabela de entidades principais</p>
            <ul className="mt-2 space-y-1 font-mono text-sm text-muted-foreground">
              <li>{"< → &lt;"}</li>
              <li>{"& → &amp;"}</li>
              <li>{'> → &gt;'}</li>
              <li>{'" → &quot;'}</li>
              <li>{"' → &#39;"}</li>
            </ul>
          </div>
        </div>
      }
    />
  );
}

export function HtmlDecode() {
  return (
    <HtmlTool
      slug="html-decode"
      transform={(t) => t.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")}
      inputLabel="HTML encoded"
      outputLabel="Texto decodificado"
      buttonLabel="Decodificar HTML"
      faqs={[
        { question: "O que são entidades HTML?", answer: "São sequências como &amp;, &lt;, &gt; que representam caracteres especiais no HTML para evitar conflitos com a sintaxe da linguagem. A decodificação reverte essas sequências para os caracteres originais." },
        { question: "Quando preciso decodificar HTML?", answer: "Ao copiar texto de páginas web ou APIs que retornam HTML entities, ao exportar conteúdo de CMS que armazena texto encoded, ou ao processar respostas de e-mail que usam entidades HTML." },
        { question: "Entidades numéricas (&#123;) também são suportadas?", answer: "Esta ferramenta decodifica as 5 entidades HTML principais (&amp;, &lt;, &gt;, &quot;, &#39;). Para entidades numéricas diversas, use um parser HTML completo." },
        { question: "Por que o banco de dados armazena HTML entities?", answer: "Alguns sistemas armazenam conteúdo HTML-encoded no banco para prevenir XSS na camada de dados. Isso é uma prática alternativa (e menos recomendada) à codificação na camada de apresentação." },
        { question: "Como decodificar todo o HTML de uma página?", answer: "Esta ferramenta é adequada para trechos de texto. Para decodificar HTML de páginas inteiras, é melhor usar a DOM API do navegador (element.innerHTML) ou uma biblioteca como o DOMParser." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            A decodificação HTML faz o processo inverso do encoding: converte entidades HTML de volta para os
            caracteres originais. Por exemplo, <code className="rounded bg-muted px-1 font-mono text-xs">{"&lt;"}</code>{" "}
            volta a ser <code className="rounded bg-muted px-1 font-mono text-xs">{"<"}</code> e{" "}
            <code className="rounded bg-muted px-1 font-mono text-xs">{"&amp;"}</code> volta a ser{" "}
            <code className="rounded bg-muted px-1 font-mono text-xs">{"&"}</code>.
          </p>
          <p>
            É frequentemente necessário ao trabalhar com conteúdo de APIs, CMS ou feeds RSS que retornam texto
            HTML-encoded. Também é útil ao extrair dados de páginas web via scraping, onde o conteúdo pode vir
            com entidades que precisam ser convertidas para texto legível.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Decodificando texto de uma API</p>
            <p className="mt-1 text-sm text-muted-foreground">Entrada: <span className="font-mono">{"Preço: R$ 10 &amp; 20 &lt;br&gt;"}</span></p>
            <p className="mt-1 text-sm text-primary">Saída: <span className="font-mono">{"Preço: R$ 10 & 20 <br>"}</span></p>
          </div>
        </div>
      }
    />
  );
}
