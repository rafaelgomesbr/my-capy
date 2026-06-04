"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "markup")!;
const faqs = [{ question: "Qual a diferença entre markup e margem de lucro?", answer: "Markup é calculado sobre o custo: Preço = Custo × (1 + Markup%). Margem é calculada sobre o preço de venda. Um markup de 50% equivale a uma margem de 33,3%." }];

export function Markup() {
  const [custo, setCusto] = useState("");
  const [markup, setMarkup] = useState("");
  const [result, setResult] = useState<{ preco: number; lucro: number; margem: number } | null>(null);

  const calcular = useCallback(() => {
    const C = parseFloat(custo.replace(",", "."));
    const M = parseFloat(markup.replace(",", ".")) / 100;
    if (isNaN(C) || isNaN(M) || C <= 0) return;
    const preco = C * (1 + M);
    const lucro = preco - C;
    const margem = (lucro / preco) * 100;
    setResult({ preco, lucro, margem });
  }, [custo, markup]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="custo-mk">Custo do produto (R$)</Label>
              <Input id="custo-mk" type="number" placeholder="Ex: 50" value={custo} onChange={(e) => setCusto(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="markup-mk">Markup (%)</Label>
              <Input id="markup-mk" type="number" placeholder="Ex: 100" value={markup} onChange={(e) => setMarkup(e.target.value)} step="0.1" />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Preço de Venda</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Preço de venda</p>
                <p className="mt-1 text-xl font-bold text-primary">{fmt(result.preco)}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">Lucro</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.lucro)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Margem efetiva</p>
                <p className="mt-1 text-xl font-bold">{result.margem.toFixed(2)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
