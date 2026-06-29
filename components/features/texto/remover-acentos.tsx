"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { Copy, CheckCheck } from "lucide-react";

const tool = getToolBySlug("texto", "remover-acentos")!;

const faqs = [
  {
    question: "O que são acentos e diacríticos?",
    answer:
      "Acentos e diacríticos são marcas gráficas adicionadas às letras para indicar pronúncia, como á, é, ê, ã, ç, ú, etc. São comuns no português, espanhol, francês e muitos outros idiomas. Tecnicamente, são chamados de 'combining diacritical marks' no padrão Unicode — caracteres separados que se combinam visualmente com a letra base.",
  },
  {
    question: "Para que serve remover acentos de um texto?",
    answer:
      "Remover acentos é útil em vários cenários técnicos: criar URLs amigáveis (slugs) para posts e produtos, normalizar texto antes de comparações em bancos de dados, exportar dados para sistemas legados que não suportam UTF-8, padronizar nomes de arquivos em sistemas de arquivos antigos, gerar usernames e logins sem caracteres especiais.",
  },
  {
    question: "O que é um slug e quando usá-lo?",
    answer:
      "Slug é uma versão simplificada do texto com apenas letras minúsculas, números e hífens, sem espaços ou caracteres especiais. É o formato padrão de URLs em sistemas como WordPress, Shopify e a maioria dos CMSes. Exemplo: 'Política de Privacidade' vira 'politica-de-privacidade'. A opção 'Converter para Slug' desta ferramenta aplica exatamente essa transformação.",
  },
  {
    question: "Como funciona tecnicamente a remoção de acentos?",
    answer:
      "O método mais robusto é usar Unicode NFD (Normalization Form Decomposed): decompõe cada caractere acentuado nos seus componentes (letra base + diacrítico), depois remove os diacríticos com regex. Por exemplo, 'ã' vira 'a' + '̃' → remove '̃' → 'a'. O JavaScript oferece string.normalize('NFD') para isso, que é o método que esta ferramenta usa.",
  },
  {
    question: "A ferramenta preserva espaços e pontuação?",
    answer:
      "No modo 'Remover Acentos', sim — apenas os caracteres acentuados são substituídos pela letra base, mantendo espaços, pontuação e maiúsculas. No modo 'Converter para Slug', o texto também é convertido para minúsculas, espaços viram hífens e toda pontuação é removida, gerando uma string URL-safe.",
  },
];

function removerAcentos(str: string): string {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function toSlug(str: string): string {
  return removerAcentos(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} title="Copiar resultado">
      {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export function RemoverAcentos() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"acentos" | "slug">("acentos");

  const handleRemover = () => {
    setOutput(removerAcentos(input));
    setMode("acentos");
  };

  const handleSlug = () => {
    setOutput(toSlug(input));
    setMode("slug");
  };

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A ferramenta usa a normalização Unicode NFD (Normalization Form Decomposed) via
            <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-sm">string.normalize(&apos;NFD&apos;)</code>
            para decompor cada letra acentuada em seus componentes individuais (letra base + marca diacrítica),
            depois remove as marcas com uma expressão regular. Isso cobre todos os caracteres do
            português, espanhol, francês, alemão e outros idiomas latinos.
          </p>
          <p>
            O modo <strong>Slug</strong> vai além: converte para minúsculas, substitui espaços e
            caracteres não-alfanuméricos por hífens, e remove hífens extras no início e fim —
            gerando strings prontas para URLs.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium mb-2">Exemplos de conversão</p>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex gap-4">
                <span className="text-muted-foreground w-48">São Paulo — Ação</span>
                <span>→ Sao Paulo — Acao</span>
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground w-48">Política de Privacidade</span>
                <span>→ Politica de Privacidade</span>
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground w-48">Política de Privacidade (slug)</span>
                <span>→ politica-de-privacidade</span>
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground w-48">João & Maria 2024!</span>
                <span>→ joao-maria-2024 (slug)</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-texto">Texto de entrada</Label>
            <textarea
              id="input-texto"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite ou cole o texto com acentos aqui..."
              className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleRemover} disabled={!input.trim()}>
              Remover Acentos
            </Button>
            <Button variant="outline" onClick={handleSlug} disabled={!input.trim()}>
              Converter para Slug
            </Button>
          </div>

          {output !== "" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output-texto">
                  {mode === "slug" ? "Slug gerado" : "Texto sem acentos"}
                </Label>
                <CopyButton text={output} />
              </div>
              <textarea
                id="output-texto"
                value={output}
                readOnly
                className="min-h-[140px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm resize-y focus:outline-none"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
