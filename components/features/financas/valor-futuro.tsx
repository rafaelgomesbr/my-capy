"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "valor-futuro")!;
const faqs = [
  { question: "Para que serve o cálculo de valor futuro?", answer: "O valor futuro (FV) permite projetar quanto um investimento presente valerá no futuro, considerando uma taxa de juros e aportes periódicos. É fundamental para planejamento de aposentadoria, metas financeiras e comparação entre investimentos." },
  { question: "Qual a fórmula do valor futuro?", answer: "FV = PV × (1 + i)^n + PMT × [(1 + i)^n – 1] / i, onde PV é o valor presente, i é a taxa por período, n é o número de períodos e PMT é o aporte periódico. Sem aportes, a fórmula simplifica para FV = PV × (1 + i)^n." },
  { question: "Como a inflação afeta o valor futuro?", answer: "O valor futuro calculado é nominal (não descontado pela inflação). Para obter o valor real (poder de compra), use a taxa de juros real: taxa real = (1 + taxa nominal) / (1 + inflação) – 1. Por exemplo, 12% a.a. com inflação de 5% equivale a ≈ 6,67% de retorno real." },
  { question: "Qual a diferença entre valor futuro e valor presente?", answer: "Valor futuro (FV) responde: 'Quanto vai valer hoje no futuro?' Valor presente (PV) responde: 'Quanto vale hoje um dinheiro futuro?' São operações inversas: FV projeta para o futuro; PV traz de volta ao presente." },
  { question: "Como simular a aposentadoria com o cálculo de valor futuro?", answer: "Some o patrimônio atual (PV) com os aportes mensais planejados (PMT), defina uma rentabilidade anual estimada e o prazo em meses até a aposentadoria. O resultado é o patrimônio que você terá acumulado. Compare com a nossa calculadora de independência financeira para ver se será suficiente." },
];

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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O valor futuro calcula quanto um investimento ou série de aportes valerão ao final de um período,
            considerando a taxa de juros compostos. A fórmula completa é{" "}
            <strong>FV = PV × (1 + i)^n + PMT × [(1 + i)^n – 1] / i</strong>, onde PV é o capital inicial,
            i é a taxa por período, n é o número de períodos e PMT é o aporte periódico.
          </p>
          <p>
            Esta ferramenta é útil para responder perguntas como: &ldquo;Quanto terei daqui a 10 anos se
            investir R$ 500 por mês a 1% ao mês?&rdquo; ou &ldquo;Qual será o patrimônio acumulado na minha
            aposentadoria?&rdquo;. O resultado é o valor nominal — para calcular o poder de compra real,
            desconte a inflação projetada.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: CDB sem aportes</p>
            <p className="mt-1 text-sm text-muted-foreground">
              PV: R$ 10.000 | Taxa: 0,9% a.m. | Período: 24 meses
            </p>
            <p className="mt-2 font-semibold text-primary">Valor futuro: ≈ R$ 12.381</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Previdência com aportes mensais</p>
            <p className="mt-1 text-sm text-muted-foreground">
              PV: R$ 20.000 | Aporte: R$ 1.000/mês | Taxa: 1% a.m. | 60 meses
            </p>
            <p className="mt-2 font-semibold text-primary">Valor futuro: ≈ R$ 113.879</p>
          </div>
        </div>
      }
    >
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
