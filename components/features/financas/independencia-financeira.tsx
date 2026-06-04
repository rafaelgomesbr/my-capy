"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "independencia-financeira")!;
const faqs = [
  { question: "O que é a regra dos 4%?", answer: "A regra dos 4% (método FIRE) diz que você pode sacar 4% do seu patrimônio por ano sem esgotá-lo. Assim, para viver com R$5.000/mês, precisa de R$1.500.000 investidos." },
  { question: "O que é FIRE?", answer: "FIRE (Financial Independence, Retire Early) é um movimento que busca acumular patrimônio suficiente para viver de renda e aposentar cedo, geralmente antes dos 50 anos." },
];

export function IndependenciaFinanceira() {
  const [gastos, setGastos] = useState("");
  const [patrimonio, setPatrimonio] = useState("");
  const [taxa, setTaxa] = useState("12");
  const [aporte, setAporte] = useState("");
  const [result, setResult] = useState<{
    metaFire: number; metaConservadora: number; anosParaFire: number;
  } | null>(null);

  const calcular = useCallback(() => {
    const G = parseFloat(gastos.replace(",", "."));
    const P = parseFloat(patrimonio.replace(",", ".")) || 0;
    const taxaAnual = parseFloat(taxa.replace(",", ".")) / 100;
    const PMT = parseFloat(aporte.replace(",", ".")) || 0;
    if (isNaN(G) || G <= 0) return;
    const metaFire = G * 12 * 25;
    const metaConservadora = G * 12 * 33;
    const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;
    let meses = 0;
    let acumulado = P;
    if (PMT > 0 && taxaMensal > 0) {
      while (acumulado < metaFire && meses < 1200) {
        acumulado = acumulado * (1 + taxaMensal) + PMT;
        meses++;
      }
    }
    setResult({ metaFire, metaConservadora, anosParaFire: meses > 0 ? meses / 12 : 0 });
  }, [gastos, patrimonio, taxa, aporte]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gas-if">Gastos mensais (R$)</Label>
              <Input id="gas-if" type="number" placeholder="Ex: 5000" value={gastos} onChange={(e) => setGastos(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pat-if">Patrimônio atual (R$)</Label>
              <Input id="pat-if" type="number" placeholder="Ex: 100000" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa-if">Rentabilidade anual esperada (%)</Label>
              <Input id="taxa-if" type="number" placeholder="Ex: 12" value={taxa} onChange={(e) => setTaxa(e.target.value)} step="0.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aporte-if">Aporte mensal (R$)</Label>
              <Input id="aporte-if" type="number" placeholder="Ex: 2000" value={aporte} onChange={(e) => setAporte(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Independência Financeira</Button>
          {result && (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Meta FIRE (regra dos 4%)</p>
                  <p className="mt-1 text-xl font-bold text-primary">{fmt(result.metaFire)}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Meta conservadora (3%)</p>
                  <p className="mt-1 text-xl font-bold">{fmt(result.metaConservadora)}</p>
                </div>
              </div>
              {result.anosParaFire > 0 && (
                <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                  <p className="text-sm text-muted-foreground">Tempo estimado para atingir a meta FIRE</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {result.anosParaFire < 1200 / 12
                      ? `${result.anosParaFire.toFixed(1)} anos`
                      : "Mais de 100 anos — aumente o aporte"}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
