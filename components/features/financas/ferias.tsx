"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "ferias")!;
const faqs = [{ question: "O que é o 1/3 constitucional de férias?", answer: "Todo trabalhador tem direito a receber 1/3 a mais do seu salário durante as férias, garantido pelo Art. 7º, XVII da Constituição Federal." }];

export function Ferias() {
  const [salario, setSalario] = useState("");
  const [dias, setDias] = useState("30");
  const [result, setResult] = useState<{ ferias: number; umTerco: number; total: number } | null>(null);

  const calcular = useCallback(() => {
    const S = parseFloat(salario.replace(",", "."));
    const D = parseInt(dias);
    if (isNaN(S) || S <= 0) return;
    const valorDiario = S / 30;
    const ferias = valorDiario * D;
    const umTerco = ferias / 3;
    setResult({ ferias, umTerco, total: ferias + umTerco });
  }, [salario, dias]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sal-fer">Salário bruto (R$)</Label>
              <Input id="sal-fer" type="number" placeholder="Ex: 3000" value={salario} onChange={(e) => setSalario(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dias-fer">Dias de férias</Label>
              <select id="dias-fer" value={dias} onChange={(e) => setDias(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="30">30 dias</option>
                <option value="20">20 dias</option>
                <option value="10">10 dias</option>
              </select>
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Férias</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Férias ({dias} dias)</p>
                <p className="mt-1 text-xl font-bold">{fmt(result.ferias)}</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4 text-center dark:bg-amber-950/40">
                <p className="text-xs text-muted-foreground">1/3 constitucional</p>
                <p className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">{fmt(result.umTerco)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Total a receber</p>
                <p className="mt-1 text-xl font-bold text-primary">{fmt(result.total)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
