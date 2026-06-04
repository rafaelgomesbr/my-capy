"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "inss")!;
const faqs = [{ question: "Qual a tabela INSS 2024?", answer: "Alíquotas progressivas: 7,5% até R$1.412; 9% de R$1.412,01 a R$2.666,68; 12% de R$2.666,69 a R$4.000,03; 14% de R$4.000,04 a R$7.786,02." }];

export function Inss() {
  const [salario, setSalario] = useState("");
  const [result, setResult] = useState<{ inss: number; aliquotaEfetiva: number } | null>(null);

  const calcular = useCallback(() => {
    const S = parseFloat(salario.replace(",", "."));
    if (isNaN(S) || S <= 0) return;
    const faixas = [
      { limite: 1412.00, aliquota: 0.075 },
      { limite: 2666.68, aliquota: 0.09 },
      { limite: 4000.03, aliquota: 0.12 },
      { limite: 7786.02, aliquota: 0.14 },
    ];
    let inss = 0;
    let base = 0;
    for (const faixa of faixas) {
      const teto = Math.min(S, faixa.limite);
      inss += (teto - base) * faixa.aliquota;
      base = faixa.limite;
      if (S <= faixa.limite) break;
    }
    setResult({ inss, aliquotaEfetiva: (inss / S) * 100 });
  }, [salario]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="sal-inss">Salário bruto (R$)</Label>
            <Input id="sal-inss" type="number" placeholder="Ex: 5000" value={salario} onChange={(e) => setSalario(e.target.value)} />
          </div>
          <Button onClick={calcular} className="w-full">Calcular INSS</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Salário bruto</p>
                <p className="mt-1 text-xl font-bold">{fmt(parseFloat(salario))}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-950/40">
                <p className="text-xs text-muted-foreground">Desconto INSS</p>
                <p className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">-{fmt(result.inss)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Alíquota efetiva</p>
                <p className="mt-1 text-xl font-bold">{result.aliquotaEfetiva.toFixed(2)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
