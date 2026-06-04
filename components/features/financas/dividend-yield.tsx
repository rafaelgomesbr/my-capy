"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "dividend-yield")!;
const faqs = [{ question: "O que é um bom Dividend Yield?", answer: "No Brasil, um DY acima de 6-8% ao ano é geralmente considerado bom para ações. Para FIIs, muitos investidores buscam DY acima de 8-10% ao ano. Sempre compare com a taxa Selic." }];

export function DividendYield() {
  const [dividendos, setDividendos] = useState("");
  const [preco, setPreco] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calcular = useCallback(() => {
    const D = parseFloat(dividendos.replace(",", "."));
    const P = parseFloat(preco.replace(",", "."));
    if (isNaN(D) || isNaN(P) || P <= 0) return;
    setResult((D / P) * 100);
  }, [dividendos, preco]);

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="div-dy">Dividendos pagos (R$) por ação/cota</Label>
              <Input id="div-dy" type="number" placeholder="Ex: 6.00" value={dividendos} onChange={(e) => setDividendos(e.target.value)} step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco-dy">Preço atual (R$)</Label>
              <Input id="preco-dy" type="number" placeholder="Ex: 100" value={preco} onChange={(e) => setPreco(e.target.value)} step="0.01" />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Dividend Yield</Button>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">Dividend Yield</p>
              <p className="mt-2 text-3xl font-bold text-primary">{result.toFixed(2)}% a.a.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {result >= 8 ? "✓ Acima de 8% — bom rendimento" : result >= 6 ? "✓ Entre 6-8% — rendimento razoável" : "⚠ Abaixo de 6% — avalie bem"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
