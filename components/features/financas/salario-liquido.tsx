"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "salario-liquido")!;

const faqs = [
  { question: "Como é calculado o INSS em 2024?", answer: "O INSS em 2024 usa alíquotas progressivas: 7,5% até R$ 1.412, 9% de R$ 1.412,01 a R$ 2.666,68, 12% de R$ 2.666,69 a R$ 4.000,03, 14% de R$ 4.000,04 a R$ 7.786,02." },
  { question: "Como é calculado o IRRF?", answer: "O IRRF é calculado sobre a base de cálculo (salário bruto - INSS - dependentes). Faixas: isento até R$ 2.259,20; 7,5% de R$ 2.259,21 a R$ 2.826,65; 15% de R$ 2.826,66 a R$ 3.751,05; 22,5% de R$ 3.751,06 a R$ 4.664,68; 27,5% acima." },
];

function calcularINSS(salario: number): number {
  const faixas = [
    { limite: 1412.00, aliquota: 0.075 },
    { limite: 2666.68, aliquota: 0.09 },
    { limite: 4000.03, aliquota: 0.12 },
    { limite: 7786.02, aliquota: 0.14 },
  ];
  let inss = 0;
  let base = 0;
  for (const faixa of faixas) {
    if (salario <= faixa.limite) {
      inss += (salario - base) * faixa.aliquota;
      break;
    }
    inss += (faixa.limite - base) * faixa.aliquota;
    base = faixa.limite;
    if (salario <= faixa.limite) break;
  }
  return Math.min(inss, 7786.02 * 0.14);
}

function calcularIRRF(baseCalculo: number): number {
  if (baseCalculo <= 2259.20) return 0;
  if (baseCalculo <= 2826.65) return baseCalculo * 0.075 - 169.44;
  if (baseCalculo <= 3751.05) return baseCalculo * 0.15 - 381.44;
  if (baseCalculo <= 4664.68) return baseCalculo * 0.225 - 662.77;
  return baseCalculo * 0.275 - 896.00;
}

export function SalarioLiquido() {
  const [salario, setSalario] = useState("");
  const [dependentes, setDependentes] = useState("0");
  const [result, setResult] = useState<{
    inss: number; irrf: number; liquido: number; descontos: number;
  } | null>(null);

  const calcular = useCallback(() => {
    const S = parseFloat(salario.replace(",", "."));
    const D = parseInt(dependentes) || 0;
    if (isNaN(S) || S <= 0) return;
    const inss = calcularINSS(S);
    const baseIRRF = S - inss - D * 189.59;
    const irrf = Math.max(0, calcularIRRF(baseIRRF));
    const descontos = inss + irrf;
    setResult({ inss, irrf, liquido: S - descontos, descontos });
  }, [salario, dependentes]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salario-bruto">Salário bruto (R$)</Label>
              <Input id="salario-bruto" type="number" placeholder="Ex: 5000" value={salario} onChange={(e) => setSalario(e.target.value)} min="0" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dependentes">Número de dependentes</Label>
              <Input id="dependentes" type="number" placeholder="0" value={dependentes} onChange={(e) => setDependentes(e.target.value)} min="0" />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Salário Líquido</Button>
          {result && (
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">INSS</p>
                  <p className="font-bold text-red-600 dark:text-red-400">-{fmt(result.inss)}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">IRRF</p>
                  <p className="font-bold text-red-600 dark:text-red-400">-{fmt(result.irrf)}</p>
                </div>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/40">
                <p className="text-sm text-muted-foreground">Salário líquido</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.liquido)}</p>
                <p className="text-xs text-muted-foreground">Desconto total: {fmt(result.descontos)} ({((result.descontos / parseFloat(salario)) * 100).toFixed(1)}%)</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
