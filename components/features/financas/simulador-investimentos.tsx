"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { FAQItem } from "@/types";

const tool = getToolBySlug("financas", "simulador-investimentos")!;

const faqs: FAQItem[] = [
  {
    question: "Como simular um investimento?",
    answer:
      "Insira o capital inicial, os aportes mensais, a taxa de juros anual e o prazo. O simulador mostrará o montante total acumulado.",
  },
  {
    question: "Qual a diferença entre rentabilidade bruta e líquida?",
    answer:
      "A rentabilidade bruta é o rendimento total antes dos impostos. A líquida desconta o IR sobre os juros, que varia de 22,5% (até 6 meses) a 15% (acima de 720 dias).",
  },
];

export function SimuladorInvestimentos() {
  const [capital, setCapital] = useState("");
  const [aporte, setAporte] = useState("");
  const [taxa, setTaxa] = useState("");
  const [anos, setAnos] = useState("");
  const [result, setResult] = useState<{
    montante: number;
    totalAportado: number;
    totalJuros: number;
  } | null>(null);

  const calcular = useCallback(() => {
    const C = parseFloat(capital.replace(",", ".")) || 0;
    const PMT = parseFloat(aporte.replace(",", ".")) || 0;
    const taxaAnual = parseFloat(taxa.replace(",", ".")) / 100;
    const n = parseInt(anos) * 12;
    if (taxaAnual <= 0 || n <= 0) return;
    const i = Math.pow(1 + taxaAnual, 1 / 12) - 1;
    const M = C * Math.pow(1 + i, n) + PMT * ((Math.pow(1 + i, n) - 1) / i);
    const totalAportado = C + PMT * n;
    setResult({ montante: M, totalAportado, totalJuros: M - totalAportado });
  }, [capital, aporte, taxa, anos]);

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capital-inv">Capital inicial (R$)</Label>
              <Input id="capital-inv" type="number" placeholder="Ex: 1000" value={capital} onChange={(e) => setCapital(e.target.value)} min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aporte-inv">Aporte mensal (R$)</Label>
              <Input id="aporte-inv" type="number" placeholder="Ex: 500" value={aporte} onChange={(e) => setAporte(e.target.value)} min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa-inv">Taxa anual (%)</Label>
              <Input id="taxa-inv" type="number" placeholder="Ex: 12" value={taxa} onChange={(e) => setTaxa(e.target.value)} min="0" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anos-inv">Prazo (anos)</Label>
              <Input id="anos-inv" type="number" placeholder="Ex: 10" value={anos} onChange={(e) => setAnos(e.target.value)} min="1" />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Simular Investimento</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Total aportado</p>
                <p className="mt-1 text-lg font-bold">{fmt(result.totalAportado)}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">Rendimento</p>
                <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.totalJuros)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Montante final</p>
                <p className="mt-1 text-lg font-bold text-primary">{fmt(result.montante)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
