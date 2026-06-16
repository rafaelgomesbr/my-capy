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
  { question: "Como calcular o custo efetivo de um empréstimo?", answer: "O CET (Custo Efetivo Total) inclui taxa de juros, IOF, seguros e tarifas administrativas. Compare sempre o CET entre diferentes ofertas, não apenas a taxa nominal de juros." },
  { question: "Devo usar empréstimo pessoal ou consignado?", answer: "O empréstimo consignado costuma ter taxas menores (de 1,5% a 2,5% ao mês) porque o desconto é direto na folha de pagamento, reduzindo o risco de inadimplência para o banco." },
  { question: "Qual é a taxa máxima do consignado INSS?", answer: "O Governo Federal regula o teto das taxas do consignado INSS. Em 2025, a taxa máxima é de 1,80% ao mês para empréstimos pessoais. Sempre verifique a tabela atualizada no site do INSS." },
  { question: "Quando vale a pena fazer um empréstimo?", answer: "Vale quando a taxa do empréstimo é menor do que o custo da alternativa (como parcelar no cartão de crédito a 15% a.m.) ou quando é para uma necessidade urgente ou investimento com retorno superior à taxa cobrada." },
  { question: "Como a fórmula do empréstimo é calculada?", answer: "Usamos a Tabela PRICE: PMT = PV × [i × (1+i)^n] / [(1+i)^n - 1], onde PMT é a parcela, PV é o valor do empréstimo, i é a taxa mensal e n é o número de parcelas." },
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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            Esta calculadora usa o sistema <strong>Tabela PRICE</strong> (parcelas iguais), o mais comum em
            empréstimos pessoais e consignados no Brasil. A fórmula é{" "}
            <strong>PMT = PV × [i × (1+i)^n] / [(1+i)^n – 1]</strong>, onde PV é o valor emprestado, i é a
            taxa mensal e n é o número de parcelas.
          </p>
          <p>
            O resultado mais importante é o <strong>total de juros pagos</strong>: a diferença entre o total a
            pagar e o valor emprestado. Compare esse número entre diferentes instituições e sempre solicite o
            CET (Custo Efetivo Total) antes de assinar qualquer contrato.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Empréstimo pessoal</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Valor: R$ 10.000 | Taxa: 3% a.m. | Parcelas: 24
            </p>
            <p className="mt-2 font-semibold text-primary">
              Parcela: ≈ R$ 569 | Total de juros: ≈ R$ 3.658
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Consignado INSS</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Valor: R$ 5.000 | Taxa: 1,8% a.m. | Parcelas: 36
            </p>
            <p className="mt-2 font-semibold text-primary">
              Parcela: ≈ R$ 200 | Total de juros: ≈ R$ 2.211
            </p>
          </div>
        </div>
      }
    >
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
