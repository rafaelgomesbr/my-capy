"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("texto", "lorem-ipsum")!;
const faqs = [{ question: "O que é Lorem Ipsum?", answer: "Lorem Ipsum é um texto fictício em latim usado como placeholder em design gráfico, web e tipografia. Permite visualizar o layout sem distrações do conteúdo real." }];

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const words = LOREM.replace(/[.,]/g, "").split(" ");

export function LoremIpsum() {
  const [qtd, setQtd] = useState("50");
  const [tipo, setTipo] = useState("palavras");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const gerar = useCallback(() => {
    const n = parseInt(qtd) || 50;
    if (tipo === "palavras") {
      const result = [];
      for (let i = 0; i < n; i++) result.push(words[i % words.length]);
      setOutput(result.join(" ") + ".");
    } else {
      const paragraphs = [];
      for (let p = 0; p < n; p++) {
        const sentenceCount = 3 + Math.floor(Math.random() * 3);
        const paraWords = [];
        for (let i = 0; i < sentenceCount * 15; i++) paraWords.push(words[(p * 15 + i) % words.length]);
        paragraphs.push(paraWords.join(" ") + ".");
      }
      setOutput(paragraphs.join("\n\n"));
    }
  }, [qtd, tipo]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="qtd-li">Quantidade</Label>
              <Input id="qtd-li" type="number" value={qtd} onChange={(e) => setQtd(e.target.value)} min="1" max="100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo-li">Tipo</Label>
              <select id="tipo-li" value={tipo} onChange={(e) => setTipo(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="palavras">Palavras</option>
                <option value="paragrafos">Parágrafos</option>
              </select>
            </div>
          </div>
          <Button onClick={gerar} className="w-full">Gerar Lorem Ipsum</Button>
          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Texto gerado</Label>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2 h-8">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
              <div className="min-h-[140px] rounded-md border bg-muted/30 p-3 text-sm whitespace-pre-wrap">{output}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
