"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("texto", "contador-palavras")!;
const faqs = [
  { question: "Como contar palavras de um texto?", answer: "Esta ferramenta conta palavras como sequências de caracteres separadas por espaços em branco, ignorando espaços múltiplos e tabulações. Pontuação junto às palavras é tratada como parte da palavra (ex: 'olá,' conta como uma palavra)." },
  { question: "Qual o limite de palavras do Twitter/X?", answer: "O Twitter/X tem limite de 280 caracteres por post, não palavras. Um post típico em português cabe entre 40-60 palavras dentro desse limite, dependendo do tamanho médio das palavras usadas." },
  { question: "Quantas palavras tem uma redação do ENEM?", answer: "A redação do ENEM tem limite mínimo de 7 linhas para não zerar e máximo de 30 linhas. Em geral, isso equivale a cerca de 100-500 palavras. Redações nota 1000 costumam ter entre 25 e 30 linhas (350-500 palavras)." },
  { question: "Qual o tempo médio de leitura por palavras?", answer: "A velocidade de leitura média de um adulto é de cerca de 200 palavras por minuto (leitura tranquila) a 300 palavras por minuto (leitura rápida). Esta ferramenta usa 200 palavras por minuto como base para estimar o tempo de leitura." },
  { question: "Qual é o limite de caracteres das principais redes sociais?", answer: "Twitter/X: 280 caracteres. LinkedIn (post): 3.000 caracteres. Instagram (legenda): 2.200 caracteres. Facebook (post): 63.206 caracteres. TikTok (bio): 80 caracteres. WhatsApp (status): 139 caracteres." },
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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            Esta ferramenta analisa o texto em tempo real e exibe seis métricas de uma vez: número de palavras,
            total de caracteres (com espaços), caracteres sem espaços, número de linhas, parágrafos e uma
            estimativa do tempo de leitura baseada em 200 palavras por minuto.
          </p>
          <p>
            É útil para escritores que precisam verificar o tamanho de artigos e redações, criadores de
            conteúdo que precisam respeitar limites de redes sociais, estudantes que precisam checar se
            um texto cumpre o requisito mínimo de palavras, ou desenvolvedores que precisam validar o
            tamanho de textos para campos de formulário.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Limites úteis de referência</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Tweet/X: 280 caracteres (≈ 40-50 palavras)</li>
              <li>• Bio Instagram: 150 caracteres</li>
              <li>• Legenda Instagram: 2.200 caracteres</li>
              <li>• Artigo de blog: 1.200–2.500 palavras</li>
              <li>• E-mail profissional: 200–300 palavras</li>
              <li>• Redação ENEM: 300–500 palavras</li>
            </ul>
          </div>
        </div>
      }
    >
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
