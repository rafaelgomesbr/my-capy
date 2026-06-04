"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "margem-lucro")!;
const faqs = [{ question: "Qual a diferença entre margem bruta e líquida?", answer: "A margem bruta desconta apenas o custo dos produtos vendidos (CPV). A margem líquida desconta todos os custos e despesas do negócio." }];

export function MargemLucro() {
  const [receita, setReceita] = useState("");
  const [custo, setCusto] = useState("");
  const [result, setResult] = useState<{ lucro: number; margem: number } | null>(null);

  const calcular = useCallback(() => {
    const R = parseFloat(receita.replace(",", "."));
    const C = parseFloat(custo.replace(",", "."));
    if (isNaN(R) || isNaN(C) || R <= 0) return;
    const lucro = R - C;
    const margem = (lucro / R) * 100;
    setResult({ lucro, margem });
  }, [receita, custo]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rec-ml">Receita total (R$)</Label>
              <Input id="rec-ml" type="number" placeholder="Ex: 10000" value={receita} onChange={(e) => setReceita(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cus-ml">Custo total (R$)</Label>
              <Input id="cus-ml" type="number" placeholder="Ex: 7000" value={custo} onChange={(e) => setCusto(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Margem</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">Lucro</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.lucro)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Margem de lucro</p>
                <p className="mt-1 text-xl font-bold text-primary">{result.margem.toFixed(2)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
