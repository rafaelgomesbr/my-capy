"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "valor-futuro")!;
const faqs = [{ question: "Para que serve o cálculo de valor futuro?", answer: "Serve para projetar quanto um investimento presente valerá no futuro, considerando uma taxa de juros. É fundamental para planejamento financeiro e aposentadoria." }];

export function ValorFuturo() {
  const [pv, setPv] = useState("");
  const [taxa, setTaxa] = useState("");
  const [periodos, setPeriodos] = useState("");
  const [pmt, setPmt] = useState("0");
  const [result, setResult] = useState<number | null>(null);

  const calcular = useCallback(() => {
    const PV = parseFloat(pv.replace(",", "."));
    const i = parseFloat(taxa.replace(",", ".")) / 100;
    const n = parseInt(periodos);
    const PMT = parseFloat(pmt.replace(",", ".")) || 0;
    if (isNaN(PV) || isNaN(i) || isNaN(n) || i <= 0 || n <= 0) return;
    const fv = PV * Math.pow(1 + i, n) + PMT * ((Math.pow(1 + i, n) - 1) / i);
    setResult(fv);
  }, [pv, taxa, periodos, pmt]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pv-vf">Valor presente (R$)</Label>
              <Input id="pv-vf" type="number" placeholder="Ex: 10000" value={pv} onChange={(e) => setPv(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa-vf">Taxa por período (%)</Label>
              <Input id="taxa-vf" type="number" placeholder="Ex: 1" value={taxa} onChange={(e) => setTaxa(e.target.value)} step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="per-vf">Número de períodos</Label>
              <Input id="per-vf" type="number" placeholder="Ex: 12" value={periodos} onChange={(e) => setPeriodos(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pmt-vf">Aporte periódico (R$)</Label>
              <Input id="pmt-vf" type="number" placeholder="Ex: 500" value={pmt} onChange={(e) => setPmt(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Valor Futuro</Button>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">Valor Futuro</p>
              <p className="mt-2 text-3xl font-bold text-primary">{fmt(result)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
