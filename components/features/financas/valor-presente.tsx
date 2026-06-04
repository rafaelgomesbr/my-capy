"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "valor-presente")!;
const faqs = [{ question: "O que é valor presente líquido (VPL)?", answer: "VPL é o valor atual de um fluxo de caixa futuro, descontado por uma taxa. Se VPL > 0, o investimento é viável pois supera a taxa mínima de atratividade." }];

export function ValorPresente() {
  const [fv, setFv] = useState("");
  const [taxa, setTaxa] = useState("");
  const [periodos, setPeriodos] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calcular = useCallback(() => {
    const FV = parseFloat(fv.replace(",", "."));
    const i = parseFloat(taxa.replace(",", ".")) / 100;
    const n = parseInt(periodos);
    if (isNaN(FV) || isNaN(i) || isNaN(n) || i <= 0 || n <= 0) return;
    setResult(FV / Math.pow(1 + i, n));
  }, [fv, taxa, periodos]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="fv-vp">Valor futuro (R$)</Label>
              <Input id="fv-vp" type="number" placeholder="Ex: 15000" value={fv} onChange={(e) => setFv(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa-vp">Taxa por período (%)</Label>
              <Input id="taxa-vp" type="number" placeholder="Ex: 1" value={taxa} onChange={(e) => setTaxa(e.target.value)} step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="per-vp">Número de períodos</Label>
              <Input id="per-vp" type="number" placeholder="Ex: 12" value={periodos} onChange={(e) => setPeriodos(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Valor Presente</Button>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">Valor Presente</p>
              <p className="mt-2 text-3xl font-bold text-primary">{fmt(result)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
