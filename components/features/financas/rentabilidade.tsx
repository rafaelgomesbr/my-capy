"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "rentabilidade")!;
const faqs = [{ question: "Como calcular a rentabilidade de um investimento?", answer: "Rentabilidade = ((Valor Final - Valor Inicial) / Valor Inicial) × 100. Para comparar investimentos, sempre converta para a mesma base de tempo (anual, mensal)." }];

export function Rentabilidade() {
  const [inicial, setInicial] = useState("");
  const [final, setFinal] = useState("");
  const [result, setResult] = useState<{ absoluta: number; relativa: number } | null>(null);

  const calcular = useCallback(() => {
    const VI = parseFloat(inicial.replace(",", "."));
    const VF = parseFloat(final.replace(",", "."));
    if (isNaN(VI) || isNaN(VF) || VI <= 0) return;
    setResult({ absoluta: VF - VI, relativa: ((VF - VI) / VI) * 100 });
  }, [inicial, final]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ini-rent">Valor inicial (R$)</Label>
              <Input id="ini-rent" type="number" placeholder="Ex: 10000" value={inicial} onChange={(e) => setInicial(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fin-rent">Valor final (R$)</Label>
              <Input id="fin-rent" type="number" placeholder="Ex: 11200" value={final} onChange={(e) => setFinal(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Rentabilidade</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={`rounded-lg p-4 text-center ${result.absoluta >= 0 ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-red-50 dark:bg-red-950/40"}`}>
                <p className="text-xs text-muted-foreground">Ganho absoluto</p>
                <p className={`mt-1 text-xl font-bold ${result.absoluta >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{fmt(result.absoluta)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Rentabilidade</p>
                <p className="mt-1 text-xl font-bold text-primary">{result.relativa.toFixed(2)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
