"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "valor-presente")!;
const faqs = [
  { question: "O que é valor presente (VP)?", answer: "Valor presente é o valor atual de um montante futuro, descontado por uma taxa de juros. Responde à pergunta: 'Quanto vale hoje um pagamento que receberei no futuro?' É o inverso do cálculo de valor futuro." },
  { question: "O que é VPL (Valor Presente Líquido)?", answer: "VPL é a soma dos valores presentes de todos os fluxos de caixa de um projeto, incluindo o investimento inicial (com sinal negativo). Se VPL > 0, o projeto é viável pois gera retorno acima da taxa mínima de atratividade." },
  { question: "Como usar o valor presente para avaliar investimentos?", answer: "Compare o valor presente do retorno esperado com o investimento necessário hoje. Se o VP do retorno for maior que o investimento, o projeto cria valor. A taxa de desconto deve refletir o custo de capital ou a taxa mínima de retorno aceitável." },
  { question: "Qual taxa de desconto usar no valor presente?", answer: "Depende do contexto. Para investimentos empresariais, use o WACC (custo médio ponderado de capital) ou a TMA (taxa mínima de atratividade). Para investimentos pessoais, um bom ponto de partida é a taxa Selic ou CDI como referência de custo de oportunidade." },
  { question: "Qual a fórmula do valor presente?", answer: "VP = FV / (1 + i)^n, onde FV é o valor futuro, i é a taxa de juros por período e n é o número de períodos. Para múltiplos fluxos de caixa, soma-se o VP de cada fluxo individualmente." },
];

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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O valor presente (VP) desconta um valor futuro para o momento atual, usando a taxa de juros como
            fator de desconto. A fórmula é <strong>VP = FV / (1 + i)^n</strong>, onde FV é o valor futuro,
            i é a taxa por período e n é o número de períodos.
          </p>
          <p>
            Este conceito é a base de toda análise de investimentos: dinheiro hoje vale mais do que o mesmo
            dinheiro no futuro, porque o dinheiro presente pode ser investido e gerar rendimentos. Por isso,
            para comparar fluxos de caixa em momentos diferentes, todos precisam ser trazidos para o mesmo
            ponto no tempo usando o conceito de valor presente.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Precificação de título</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Receberei R$ 15.000 daqui a 12 meses | Taxa: 1% a.m.
            </p>
            <p className="mt-2 font-semibold text-primary">Esse R$ 15.000 futuro vale hoje: ≈ R$ 13.328</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Avaliação de projeto</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fluxo esperado em 3 anos: R$ 100.000 | Taxa de desconto: 1,5% a.m. (18% a.a.)
            </p>
            <p className="mt-2 font-semibold text-primary">Valor presente: ≈ R$ 58.860</p>
          </div>
        </div>
      }
    >
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
