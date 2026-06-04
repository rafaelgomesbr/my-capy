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
      "Acentos e diacríticos são marcas gráficas adicionadas às letras para indicar pronúncia, como á, é, ê, ã, ç, ú, etc. São comuns no português, espanhol, francês e muitos outros idiomas.",
  },
  {
    question: "Para que serve remover acentos?",
    answer:
      "Remover acentos é útil para normalizar texto antes de comparações, criar URLs amigáveis (slugs), exportar dados para sistemas que não suportam UTF-8, e padronizar nomes em bancos de dados legados.",
  },
  {
    question: "O que é um slug?",
    answer:
      "Slug é uma versão do texto com apenas letras minúsculas, números e hífens, sem espaços ou caracteres especiais. É amplamente usado em URLs de posts, produtos e categorias.",
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
    <ToolLayout tool={tool} faqs={faqs}>
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
