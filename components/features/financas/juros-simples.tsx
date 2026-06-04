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
      "Juros simples são calculados exclusivamente sobre o capital inicial, sem incorporar juros anteriores. Cada período gera o mesmo valor de juros.",
  },
  {
    question: "Qual a fórmula dos juros simples?",
    answer: "J = C × i × t, onde J são os juros, C é o capital, i é a taxa e t é o tempo. O montante é M = C + J.",
  },
  {
    question: "Quando os juros simples são usados?",
    answer:
      "São comuns em situações de curto prazo, como desconto de duplicatas, algumas modalidades de financiamento e cálculos rápidos do dia a dia.",
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
    <ToolLayout tool={tool} faqs={faqs}>
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
