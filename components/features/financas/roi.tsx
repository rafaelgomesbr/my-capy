"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "roi")!;
const faqs = [
  { question: "O que é um bom ROI?", answer: "Depende do setor e do prazo. Em marketing digital, um ROI de 400% (relação 4:1) é considerado um bom parâmetro. Em investimentos financeiros, o ROI deve superar a taxa livre de risco (Selic/CDI). Em projetos empresariais, leve em conta o prazo de retorno." },
  { question: "Qual a fórmula do ROI?", answer: "ROI = (Retorno – Investimento) / Investimento × 100. Se você investiu R$ 10.000 e obteve de volta R$ 14.000, o ROI é (14.000 – 10.000) / 10.000 × 100 = 40%." },
  { question: "ROI negativo significa prejuízo?", answer: "Sim. Um ROI negativo significa que o retorno foi menor do que o investimento, ou seja, houve perda. Por exemplo, ROI de -20% significa que você perdeu 20% do que investiu." },
  { question: "Qual a diferença entre ROI e ROAS?", answer: "ROI (Return on Investment) mede o lucro líquido em relação ao investimento total. ROAS (Return on Ad Spend) é específico para publicidade e mede a receita gerada por real investido em anúncios, sem descontar o custo do produto." },
  { question: "Como calcular o ROI de uma campanha de marketing?", answer: "Some todos os custos da campanha (criação, mídia, ferramentas). Calcule a receita atribuída à campanha. ROI = (Receita – Custo da campanha) / Custo da campanha × 100. Um ROI de 300% significa que cada R$ 1 investido gerou R$ 4 de retorno (R$ 3 de lucro)." },
];

export function Roi() {
  const [investimento, setInvestimento] = useState("");
  const [retorno, setRetorno] = useState("");
  const [result, setResult] = useState<{ roi: number; lucro: number } | null>(null);

  const calcular = useCallback(() => {
    const I = parseFloat(investimento.replace(",", "."));
    const R = parseFloat(retorno.replace(",", "."));
    if (isNaN(I) || isNaN(R) || I <= 0) return;
    const lucro = R - I;
    const roi = (lucro / I) * 100;
    setResult({ roi, lucro });
  }, [investimento, retorno]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O ROI (Retorno sobre Investimento) é um dos indicadores mais usados para avaliar a eficiência de
            qualquer tipo de investimento — seja em marketing, projetos, equipamentos ou ativos financeiros.
            A fórmula é simples: <strong>ROI = (Retorno – Investimento) / Investimento × 100</strong>.
          </p>
          <p>
            Um ROI positivo indica lucro; negativo indica prejuízo. O ROI por si só não conta toda a história —
            é importante considerar também o prazo do investimento. Um ROI de 50% em 1 mês é muito diferente
            de 50% em 5 anos. Para comparações mais precisas ao longo do tempo, use o CAGR.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Campanha de marketing</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Investimento: R$ 5.000 | Receita gerada: R$ 22.000
            </p>
            <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
              Lucro: R$ 17.000 | ROI: 340%
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Equipamento para empresa</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Investimento: R$ 30.000 | Receita adicional gerada: R$ 45.000
            </p>
            <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
              Lucro: R$ 15.000 | ROI: 50%
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inv-roi">Investimento (R$)</Label>
              <Input id="inv-roi" type="number" placeholder="Ex: 10000" value={investimento} onChange={(e) => setInvestimento(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ret-roi">Retorno obtido (R$)</Label>
              <Input id="ret-roi" type="number" placeholder="Ex: 15000" value={retorno} onChange={(e) => setRetorno(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular ROI</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={`rounded-lg p-4 text-center ${result.lucro >= 0 ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-red-50 dark:bg-red-950/40"}`}>
                <p className="text-xs text-muted-foreground">Lucro / Prejuízo</p>
                <p className={`mt-1 text-xl font-bold ${result.lucro >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{fmt(result.lucro)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">ROI</p>
                <p className="mt-1 text-xl font-bold text-primary">{result.roi.toFixed(2)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
