"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "pix")!;
const faqs = [
  { question: "Pix tem taxa para pessoa física?", answer: "Para pessoa física, o Pix é totalmente gratuito para envio, conforme regra do Banco Central. Já para MEI, empresas e profissionais autônomos que recebem via Pix, as instituições financeiras podem cobrar uma taxa sobre cada recebimento." },
  { question: "Qual a taxa do Pix para empresas?", answer: "A taxa do Pix para recebimento empresarial varia por instituição: bancos digitais costumam cobrar 0,5% a 0,99%; bancos tradicionais podem cobrar até 1,3%. Alguns oferecem gratuidade para pequenos volumes ou para determinados perfis de cliente." },
  { question: "Vale mais a pena receber Pix ou cartão de crédito?", answer: "O Pix tende a ser mais barato para o vendedor (0,5% a 1% vs 2,8% a 4,5% no crédito). Além disso, o Pix cai na conta imediatamente, sem necessidade de antecipação. A desvantagem é que não oferece parcelamento." },
  { question: "Pix tem limite de valor?", answer: "Por padrão, o Pix tem limite de R$ 1.000 por transação entre 20h e 6h (Pix noturno) e o banco define o limite diurno (geralmente R$ 5.000 a R$ 20.000 para PF). Empresas podem ter limites maiores, negociáveis com o banco." },
  { question: "O que é Pix parcelado?", answer: "O Pix parcelado (ou Pix garantido) é uma modalidade em desenvolvimento no Brasil que permitirá parcelamentos via Pix. Diferente do Pix comum, o valor é garantido por uma instituição financeira, similar ao crédito parcelado, mas com liquidação via Pix." },
];

export function Pix() {
  const [valor, setValor] = useState("");
  const [taxa, setTaxa] = useState("0.99");
  const [result, setResult] = useState<{ taxa: number; liquido: number } | null>(null);

  const calcular = useCallback(() => {
    const V = parseFloat(valor.replace(",", "."));
    const T = parseFloat(taxa.replace(",", ".")) / 100;
    if (isNaN(V) || V <= 0) return;
    setResult({ taxa: V * T, liquido: V * (1 - T) });
  }, [valor, taxa]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O Pix é gratuito para pessoas físicas, mas instituições financeiras podem cobrar uma taxa sobre
            recebimentos de MEIs e empresas. Esta calculadora ajuda a descobrir quanto você recebe de fato
            após o desconto da taxa cobrada pelo seu banco ou fintech. Informe o valor da venda e a taxa que
            sua instituição cobra para ver o valor líquido.
          </p>
          <p>
            Comparado ao cartão de crédito (taxas de 2,8% a 4,5%) e ao cartão de débito (1,5% a 1,9%), o
            Pix empresarial costuma ser significativamente mais barato. A liquidação também é imediata —
            sem prazo de 30 dias como no crédito — o que melhora o fluxo de caixa do negócio.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Venda de R$ 800 (taxa de 0,99%)</p>
            <p className="mt-1 text-sm text-muted-foreground">Taxa descontada: R$ 7,92 | Líquido: R$ 792,08</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Comparação: mesmo R$ 800 no crédito 1x (2,8%)</p>
            <p className="mt-1 text-sm text-muted-foreground">Taxa descontada: R$ 22,40 | Líquido: R$ 777,60 (e só cai em 30 dias)</p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="val-pix">Valor da venda (R$)</Label>
              <Input id="val-pix" type="number" placeholder="Ex: 200" value={valor} onChange={(e) => setValor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa-pix">Taxa do Pix (%)</Label>
              <Input id="taxa-pix" type="number" placeholder="Ex: 0.99" value={taxa} onChange={(e) => setTaxa(e.target.value)} step="0.01" />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-950/40">
                <p className="text-xs text-muted-foreground">Taxa descontada</p>
                <p className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">-{fmt(result.taxa)}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">Valor líquido</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.liquido)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
