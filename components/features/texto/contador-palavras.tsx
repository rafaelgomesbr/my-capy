"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("texto", "contador-palavras")!;
const faqs = [
  { question: "Como contar palavras de um texto?", answer: "Palavras são sequências de caracteres separadas por espaços. Este contador ignora espaços múltiplos e conta corretamente." },
  { question: "Qual o limite de palavras do Twitter/X?", answer: "O Twitter/X tem limite de 280 caracteres por tweet, não palavras. Já o LinkedIn permite posts com até 3.000 caracteres." },
];

export function ContadorPalavras() {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const lines = text ? text.split("\n").length : 0;
  const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
  const readTime = Math.ceil(words / 200);

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-cp">Cole ou digite o seu texto</Label>
              <textarea
                id="text-cp"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Cole ou digite seu texto aqui..."
                className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                aria-label="Texto para análise"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Palavras", value: words },
                { label: "Caracteres", value: chars },
                { label: "Sem espaços", value: charsNoSpace },
                { label: "Linhas", value: lines },
                { label: "Parágrafos", value: paragraphs },
                { label: "Tempo leitura", value: `~${readTime} min` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
