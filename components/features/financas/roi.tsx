"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "roi")!;
const faqs = [{ question: "O que é um bom ROI?", answer: "Depende do setor. Em marketing digital, um ROI de 400% (4:1) é considerado bom. Em investimentos de longo prazo, comparar com a taxa livre de risco (Selic/CDI) é uma boa referência." }];

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
    <ToolLayout tool={tool} faqs={faqs}>
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
