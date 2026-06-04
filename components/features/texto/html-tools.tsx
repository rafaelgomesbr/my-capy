"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

function HtmlTool({ slug, transform, inputLabel, outputLabel, buttonLabel, faqs }: {
  slug: "html-encode" | "html-decode";
  transform: (t: string) => string;
  inputLabel: string;
  outputLabel: string;
  buttonLabel: string;
  faqs: { question: string; answer: string }[];
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
    <ToolLayout tool={tool} faqs={faqs}>
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
      faqs={[{ question: "Por que codificar HTML?", answer: "Para exibir caracteres especiais (<, >, &, \") como texto numa página HTML sem que o navegador os interprete como código." }]}
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
      faqs={[{ question: "O que são entidades HTML?", answer: "São sequências como &amp;, &lt;, &gt; que representam caracteres especiais no HTML para evitar conflitos com a sintaxe da linguagem." }]}
    />
  );
}
