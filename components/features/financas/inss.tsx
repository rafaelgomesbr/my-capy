"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "inss")!;
const faqs = [
  { question: "Qual a tabela INSS 2025?", answer: "Alíquotas progressivas: 7,5% sobre a parcela até R$ 1.412,00; 9% de R$ 1.412,01 a R$ 2.666,68; 12% de R$ 2.666,69 a R$ 4.000,03; 14% de R$ 4.000,04 a R$ 7.786,02. O teto do INSS é R$ 7.786,02." },
  { question: "O que é alíquota progressiva do INSS?", answer: "Significa que cada faixa salarial tem uma alíquota diferente, que incide apenas sobre o valor dentro daquela faixa — não sobre o salário todo. É similar ao funcionamento do Imposto de Renda." },
  { question: "O que acontece com salários acima do teto do INSS?", answer: "Salários acima de R$ 7.786,02 pagam INSS sobre o teto, não sobre o excedente. O desconto máximo de INSS é de aproximadamente R$ 908,86 por mês, independentemente do salário." },
  { question: "Autônomos e MEI pagam INSS diferente?", answer: "Sim. MEI paga R$ 75,90 de INSS fixo por mês (5% do salário mínimo de R$ 1.518). Autônomos contribuem com 20% do salário de contribuição ou optam pelo plano simplificado de 11%. Esta calculadora é para CLT." },
  { question: "O INSS desconta do salário líquido?", answer: "Não. O INSS é descontado do salário bruto. Depois, o IRRF é calculado sobre a base (salário bruto menos INSS), então o INSS também impacta indiretamente no IR — quanto maior o INSS, menor o imposto de renda." },
];

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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O INSS para trabalhadores CLT usa uma tabela progressiva por faixas, similar ao Imposto de Renda.
            Cada faixa salarial tem uma alíquota específica, mas essa alíquota incide <strong>apenas sobre
            o valor dentro daquela faixa</strong>, não sobre o salário total. Isso significa que a
            alíquota efetiva é sempre menor do que a alíquota máxima da sua faixa.
          </p>
          <p>
            Por exemplo: quem ganha R$ 3.000 paga 7,5% sobre os primeiros R$ 1.412, mais 9% sobre a diferença
            até R$ 2.666,68, mais 12% sobre o restante. O resultado é uma alíquota efetiva de cerca de 9,2% —
            bem abaixo dos 12% da faixa em que se encontra.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Salário R$ 2.000</p>
            <p className="mt-1 text-sm text-muted-foreground">
              7,5% sobre R$ 1.412 = R$ 105,90 | 9% sobre R$ 588 = R$ 52,92
            </p>
            <p className="mt-2 font-semibold text-primary">INSS total: R$ 158,82 | Alíquota efetiva: 7,94%</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Salário R$ 5.000</p>
            <p className="mt-1 text-sm text-muted-foreground">
              7,5% sobre R$ 1.412 + 9% sobre R$ 1.254,68 + 12% sobre R$ 1.333,35 + 14% sobre R$ 999,97
            </p>
            <p className="mt-2 font-semibold text-primary">INSS total: ≈ R$ 481 | Alíquota efetiva: ≈ 9,6%</p>
          </div>
        </div>
      }
    >
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
