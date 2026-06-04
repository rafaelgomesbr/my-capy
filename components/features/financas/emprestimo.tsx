"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "emprestimo")!;
const faqs = [
  { question: "Como calcular o custo efetivo de um empréstimo?", answer: "O CET (Custo Efetivo Total) inclui taxa de juros, IOF, seguros e tarifas. Compare sempre o CET, não apenas a taxa de juros." },
  { question: "Devo usar empréstimo pessoal ou consignado?", answer: "O consignado costuma ter taxas menores pois o pagamento é descontado em folha. Porém, verifique se a margem consignável não compromete muito sua renda." },
];

export function Emprestimo() {
  const [valor, setValor] = useState("");
  const [taxa, setTaxa] = useState("");
  const [parcelas, setParcelas] = useState("");
  const [result, setResult] = useState<{ pmt: number; total: number; juros: number } | null>(null);

  const calcular = useCallback(() => {
    const PV = parseFloat(valor.replace(",", "."));
    const i = parseFloat(taxa.replace(",", ".")) / 100;
    const n = parseInt(parcelas);
    if (isNaN(PV) || isNaN(i) || isNaN(n) || PV <= 0 || i <= 0 || n <= 0) return;
    const pmt = (PV * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    setResult({ pmt, total: pmt * n, juros: pmt * n - PV });
  }, [valor, taxa, parcelas]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="valor-emp">Valor do empréstimo (R$)</Label>
              <Input id="valor-emp" type="number" placeholder="Ex: 10000" value={valor} onChange={(e) => setValor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa-emp">Taxa mensal (%)</Label>
              <Input id="taxa-emp" type="number" placeholder="Ex: 2.5" value={taxa} onChange={(e) => setTaxa(e.target.value)} step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parcelas-emp">Número de parcelas</Label>
              <Input id="parcelas-emp" type="number" placeholder="Ex: 24" value={parcelas} onChange={(e) => setParcelas(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Empréstimo</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Parcela mensal</p>
                <p className="mt-1 text-xl font-bold">{fmt(result.pmt)}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-950/40">
                <p className="text-xs text-muted-foreground">Total de juros</p>
                <p className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">{fmt(result.juros)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Total a pagar</p>
                <p className="mt-1 text-xl font-bold text-primary">{fmt(result.total)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
