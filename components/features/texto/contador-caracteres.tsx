"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("texto", "contador-caracteres")!;
const faqs = [
  { question: "Qual o limite de caracteres do Instagram?", answer: "Instagram legenda: 2.200 caracteres (mas apenas as 3 primeiras linhas aparecem sem clicar em 'mais'). Bio: 150 caracteres. Comentário: 100 caracteres. Stories (texto): 250 caracteres." },
  { question: "Quantos caracteres cabem num tweet?", answer: "O Twitter/X permite 280 caracteres por post. Links são encurtados automaticamente e contam como 23 caracteres, independente do tamanho original. Emojis geralmente contam como 2 caracteres." },
  { question: "O que é meta description e qual o limite?", answer: "Meta description é o trecho de texto que aparece nos resultados de pesquisa do Google, abaixo do título da página. O limite recomendado é de 120-160 caracteres. Textos maiores são cortados pelo Google com reticências." },
  { question: "Qual o limite do Title Tag para SEO?", answer: "O título SEO (title tag) idealmente deve ter entre 50-60 caracteres para não ser cortado na exibição do Google. Títulos muito curtos (menos de 30) ou muito longos (mais de 70) podem prejudicar o clique nos resultados de busca." },
  { question: "Emojis contam mais de um caractere?", answer: "Sim. Na maioria das plataformas, emojis ocupam 2 caracteres Unicode (código UTF-16). Alguns emojis compostos (como bandeiras de países) podem ocupar 4 ou mais caracteres. Este contador mostra o número real de caracteres JavaScript." },
];

const limites = [
  { rede: "Twitter/X", limite: 280 },
  { rede: "Instagram Bio", limite: 150 },
  { rede: "Meta Description", limite: 160 },
  { rede: "Title SEO", limite: 60 },
  { rede: "WhatsApp Status", limite: 700 },
];

export function ContadorCaracteres() {
  const [text, setText] = useState("");
  const chars = text.length;

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O contador de caracteres exibe em tempo real a contagem total (com espaços) e sem espaços,
            além de barras de progresso que mostram visualmente o quanto do limite de cada plataforma
            já foi consumido. As barras ficam vermelhas ao ultrapassar o limite.
          </p>
          <p>
            Ideal para criadores de conteúdo que precisam otimizar posts para redes sociais, profissionais
            de marketing digital que escrevem meta descriptions e title tags para SEO, ou qualquer pessoa
            que precise controlar o tamanho de um texto para uma finalidade específica.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Limites de plataformas — referência rápida</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Twitter/X: 280 caracteres</li>
              <li>• Instagram (bio): 150 | (legenda): 2.200</li>
              <li>• LinkedIn (post): 3.000 | (título): 220</li>
              <li>• Meta description SEO: 120–160 caracteres</li>
              <li>• Title tag SEO: 50–60 caracteres</li>
              <li>• WhatsApp (status): 700 caracteres</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-cc">Digite seu texto</Label>
              <textarea
                id="text-cc"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite ou cole o texto aqui..."
                className="min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Total de caracteres</p>
                <p className="mt-1 text-3xl font-bold text-primary">{chars}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Sem espaços</p>
                <p className="mt-1 text-3xl font-bold">{text.replace(/\s/g, "").length}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Limites por plataforma</p>
              {limites.map((l) => (
                <div key={l.rede} className="flex items-center gap-3">
                  <span className="w-36 text-sm text-muted-foreground">{l.rede}</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full transition-all ${chars > l.limite ? "bg-red-500" : "bg-primary"}`}
                      style={{ width: `${Math.min((chars / l.limite) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${chars > l.limite ? "text-red-500" : "text-muted-foreground"}`}>
                    {chars}/{l.limite}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
