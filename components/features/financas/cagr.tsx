"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "cagr")!;
const faqs = [{ question: "O que é CAGR?", answer: "CAGR (Compound Annual Growth Rate) é a taxa de crescimento anual composta. Mede a taxa de crescimento constante que um investimento teria que ter por ano para ir de um valor inicial para um valor final." }];

export function Cagr() {
  const [inicial, setInicial] = useState("");
  const [final, setFinal] = useState("");
  const [anos, setAnos] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calcular = useCallback(() => {
    const VI = parseFloat(inicial.replace(",", "."));
    const VF = parseFloat(final.replace(",", "."));
    const n = parseFloat(anos.replace(",", "."));
    if (isNaN(VI) || isNaN(VF) || isNaN(n) || VI <= 0 || n <= 0) return;
    setResult((Math.pow(VF / VI, 1 / n) - 1) * 100);
  }, [inicial, final, anos]);

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ini-cagr">Valor inicial (R$)</Label>
              <Input id="ini-cagr" type="number" placeholder="Ex: 10000" value={inicial} onChange={(e) => setInicial(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fin-cagr">Valor final (R$)</Label>
              <Input id="fin-cagr" type="number" placeholder="Ex: 20000" value={final} onChange={(e) => setFinal(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anos-cagr">Número de anos</Label>
              <Input id="anos-cagr" type="number" placeholder="Ex: 5" value={anos} onChange={(e) => setAnos(e.target.value)} step="0.5" />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular CAGR</Button>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">CAGR — Taxa de Crescimento Anual Composta</p>
              <p className="mt-2 text-3xl font-bold text-primary">{result.toFixed(2)}% a.a.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
