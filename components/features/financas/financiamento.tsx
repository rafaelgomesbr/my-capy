"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "financiamento")!;

const faqs = [
  { question: "O que é o sistema PRICE?", answer: "No sistema PRICE (Francês) as parcelas são fixas e iguais. A amortização cresce ao longo do tempo enquanto os juros diminuem. Ideal para quem quer previsibilidade no orçamento." },
  { question: "O que é o sistema SAC?", answer: "No SAC (Sistema de Amortização Constante) a amortização é fixa, mas os juros caem a cada parcela. As prestações começam maiores que no PRICE, mas diminuem ao longo do tempo, e o total de juros pagos é menor." },
  { question: "PRICE ou SAC: qual é melhor?", answer: "O SAC costuma gerar menor custo total (menos juros pagos). Porém, as primeiras parcelas são mais altas. O PRICE é indicado quando a capacidade de pagamento inicial é mais limitada. Compare os dois antes de assinar." },
  { question: "Como calcular a parcela de um financiamento?", answer: "No PRICE: PMT = PV × [i × (1+i)^n] / [(1+i)^n - 1], onde PV é o valor financiado, i é a taxa mensal e n é o número de parcelas." },
  { question: "O financiamento já inclui IOF e seguros?", answer: "Esta calculadora calcula apenas os juros do financiamento (sistema PRICE ou SAC). O custo real, chamado CET (Custo Efetivo Total), inclui também IOF, seguros e tarifas — sempre peça o CET antes de fechar." },
];

export function Financiamento() {
  const [valor, setValor] = useState("");
  const [taxa, setTaxa] = useState("");
  const [meses, setMeses] = useState("");
  const [sistema, setSistema] = useState("price");
  const [result, setResult] = useState<{ parcela: number; total: number; juros: number } | null>(null);

  const calcular = useCallback(() => {
    const PV = parseFloat(valor.replace(",", "."));
    const i = parseFloat(taxa.replace(",", ".")) / 100;
    const n = parseInt(meses);
    if (isNaN(PV) || isNaN(i) || isNaN(n) || PV <= 0 || i <= 0 || n <= 0) return;
    if (sistema === "price") {
      const pmt = (PV * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
      setResult({ parcela: pmt, total: pmt * n, juros: pmt * n - PV });
    } else {
      const amort = PV / n;
      const primeiraParc = amort + PV * i;
      const ultimaParc = amort + amort * i;
      const total = ((primeiraParc + ultimaParc) / 2) * n;
      setResult({ parcela: primeiraParc, total, juros: total - PV });
    }
  }, [valor, taxa, meses, sistema]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            No sistema <strong>PRICE</strong>, a parcela mensal é calculada pela fórmula da anuidade:{" "}
            <strong>PMT = PV × [i × (1+i)^n] / [(1+i)^n – 1]</strong>. As parcelas são iguais, mas a composição
            muda: no início paga-se mais juros; no final, mais amortização.
          </p>
          <p>
            No sistema <strong>SAC</strong>, a amortização é constante (valor financiado ÷ número de parcelas).
            Os juros de cada parcela são calculados sobre o saldo devedor restante, que cai mês a mês. Resultado:
            parcelas decrescentes e total de juros menor que no PRICE.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Financiamento imobiliário</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Valor: R$ 300.000 | Taxa: 0,8% a.m. | Prazo: 360 meses (30 anos) | Sistema: PRICE
            </p>
            <p className="mt-2 font-semibold text-primary">
              Parcela: ≈ R$ 2.399 | Total de juros: ≈ R$ 563.640
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Financiamento de veículo</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Valor: R$ 50.000 | Taxa: 1,2% a.m. | Prazo: 48 meses | Sistema: PRICE
            </p>
            <p className="mt-2 font-semibold text-primary">
              Parcela: ≈ R$ 1.398 | Total de juros: ≈ R$ 17.104
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="valor-fin">Valor financiado (R$)</Label>
              <Input id="valor-fin" type="number" placeholder="Ex: 200000" value={valor} onChange={(e) => setValor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa-fin">Taxa mensal (%)</Label>
              <Input id="taxa-fin" type="number" placeholder="Ex: 0.8" value={taxa} onChange={(e) => setTaxa(e.target.value)} step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meses-fin">Prazo (meses)</Label>
              <Input id="meses-fin" type="number" placeholder="Ex: 360" value={meses} onChange={(e) => setMeses(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sistema-fin">Sistema de amortização</Label>
              <select id="sistema-fin" value={sistema} onChange={(e) => setSistema(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="price">PRICE (parcelas iguais)</option>
                <option value="sac">SAC (parcelas decrescentes)</option>
              </select>
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Financiamento</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">{sistema === "sac" ? "1ª Parcela" : "Parcela mensal"}</p>
                <p className="mt-1 text-xl font-bold">{fmt(result.parcela)}</p>
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
