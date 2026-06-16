"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { FAQItem } from "@/types";

const tool = getToolBySlug("financas", "juros-simples")!;

const faqs: FAQItem[] = [
  {
    question: "O que são juros simples?",
    answer:
      "Juros simples são calculados exclusivamente sobre o capital inicial, sem incorporar juros anteriores. Cada período gera o mesmo valor de juros, resultando em crescimento linear do montante ao longo do tempo.",
  },
  {
    question: "Qual a fórmula dos juros simples?",
    answer: "J = C × i × t, onde J são os juros totais, C é o capital inicial, i é a taxa de juros por período (em decimal) e t é o número de períodos. O montante final é M = C + J = C × (1 + i × t).",
  },
  {
    question: "Quando os juros simples são usados?",
    answer:
      "São comuns em operações de curto prazo, como desconto de duplicatas, notas promissórias, alguns tipos de financiamento de capital de giro e cálculos de multas por atraso.",
  },
  {
    question: "Qual a diferença entre juros simples e compostos?",
    answer:
      "Nos juros simples, a base de cálculo é sempre o capital inicial. Nos compostos, os juros de cada período são incorporados ao capital para o período seguinte (juros sobre juros). Para prazos longos, os compostos geram valores muito maiores.",
  },
  {
    question: "Como converter taxa mensal em anual nos juros simples?",
    answer:
      "Na capitalização simples, a conversão é proporcional: taxa anual = taxa mensal × 12. Por exemplo, 2% ao mês equivale a 24% ao ano nos juros simples.",
  },
];

export function JurosSimples() {
  const [capital, setCapital] = useState("");
  const [taxa, setTaxa] = useState("");
  const [tempo, setTempo] = useState("");
  const [result, setResult] = useState<{ juros: number; montante: number } | null>(null);

  const calcular = useCallback(() => {
    const C = parseFloat(capital.replace(",", "."));
    const i = parseFloat(taxa.replace(",", ".")) / 100;
    const t = parseFloat(tempo.replace(",", "."));
    if (isNaN(C) || isNaN(i) || isNaN(t) || C <= 0 || i <= 0 || t <= 0) return;
    const J = C * i * t;
    setResult({ juros: J, montante: C + J });
  }, [capital, taxa, tempo]);

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            Os juros simples seguem a fórmula <strong>J = C × i × t</strong>, onde o juro de cada período é
            sempre calculado sobre o capital original. Isso significa que o crescimento é linear: se você aplica
            R$ 1.000 a 2% ao mês por 10 meses, os juros serão sempre R$ 20 por mês, totalizando R$ 200 de juros
            ao final (montante de R$ 1.200).
          </p>
          <p>
            Diferentemente dos juros compostos, não há capitalização dos rendimentos. Isso torna os juros simples
            mais fáceis de calcular mentalmente e mais transparentes em operações de curto prazo como descontos
            comerciais e financiamentos de giro.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo 1: Nota promissória</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Capital: R$ 5.000 | Taxa: 3% ao mês | Período: 4 meses
            </p>
            <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
              Juros: R$ 600 | Montante: R$ 5.600
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo 2: Multa por atraso</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Dívida: R$ 2.000 | Taxa: 1% ao mês | Atraso: 3 meses
            </p>
            <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
              Multa: R$ 60 | Total a pagar: R$ 2.060
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="capital-s">Capital (R$)</Label>
              <Input
                id="capital-s"
                type="number"
                placeholder="Ex: 5000"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa-s">Taxa por período (%)</Label>
              <Input
                id="taxa-s"
                type="number"
                placeholder="Ex: 2"
                value={taxa}
                onChange={(e) => setTaxa(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tempo-s">Número de períodos</Label>
              <Input
                id="tempo-s"
                type="number"
                placeholder="Ex: 6"
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                min="1"
              />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">
            Calcular
          </Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Capital</p>
                <p className="mt-1 text-xl font-bold">{fmt(parseFloat(capital))}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">Juros</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {fmt(result.juros)}
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Montante</p>
                <p className="mt-1 text-xl font-bold text-primary">{fmt(result.montante)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
