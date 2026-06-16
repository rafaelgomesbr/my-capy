"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "rentabilidade")!;
const faqs = [
  { question: "Como calcular a rentabilidade de um investimento?", answer: "Rentabilidade = ((Valor Final – Valor Inicial) / Valor Inicial) × 100. Por exemplo, se você investiu R$ 10.000 e agora tem R$ 11.500, a rentabilidade é (11.500 – 10.000) / 10.000 × 100 = 15%." },
  { question: "Qual a diferença entre rentabilidade nominal e real?", answer: "A rentabilidade nominal é o retorno bruto do investimento. A real desconta a inflação do período: rentabilidade real = (1 + nominal) / (1 + inflação) – 1. Um investimento que rendeu 10% com inflação de 5% teve rentabilidade real de apenas ≈ 4,76%." },
  { question: "Como comparar a rentabilidade de investimentos?", answer: "Sempre converta para a mesma base de tempo (mensal ou anual). Uma rentabilidade de 2% ao mês equivale a ≈ 26,8% ao ano (juros compostos), não 24%. Use nossa calculadora de CAGR para anualizar retornos de diferentes períodos." },
  { question: "O que é rentabilidade relativa ao CDI?", answer: "Expressa o retorno em percentual do CDI. Por exemplo, '120% do CDI' significa que o investimento rendeu 20% a mais que o CDI no período. É uma forma prática de comparar renda fixa com a taxa de referência do mercado." },
  { question: "Rentabilidade passada garante rentabilidade futura?", answer: "Não. 'Rentabilidade passada não é garantia de rentabilidade futura' é um aviso obrigatório no mercado financeiro. Histórico de retornos é um dos vários fatores a considerar, junto com risco, gestão, cenário econômico e perfil do investidor." },
];

export function Rentabilidade() {
  const [inicial, setInicial] = useState("");
  const [final, setFinal] = useState("");
  const [result, setResult] = useState<{ absoluta: number; relativa: number } | null>(null);

  const calcular = useCallback(() => {
    const VI = parseFloat(inicial.replace(",", "."));
    const VF = parseFloat(final.replace(",", "."));
    if (isNaN(VI) || isNaN(VF) || VI <= 0) return;
    setResult({ absoluta: VF - VI, relativa: ((VF - VI) / VI) * 100 });
  }, [inicial, final]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A rentabilidade mede o desempenho de um investimento em percentual. A calculadora mostra dois
            valores: o <strong>ganho absoluto</strong> (diferença em reais entre valor final e inicial) e a{" "}
            <strong>rentabilidade relativa</strong> (percentual de retorno sobre o valor inicial).
          </p>
          <p>
            Para comparar investimentos de diferentes períodos, converta sempre para uma base de tempo comum
            usando juros compostos. Lembre-se de considerar a inflação: um retorno de 10% com inflação de
            7% no período representa apenas ≈ 2,8% de ganho real de poder de compra.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Ação na bolsa</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Compra: R$ 28,50 por ação | Venda: R$ 41,20 | Quantidade: 200 ações
            </p>
            <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
              Ganho: R$ 2.540 | Rentabilidade: 44,6%
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: CDB 1 ano</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Aplicado: R$ 5.000 | Resgate: R$ 5.620
            </p>
            <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
              Ganho: R$ 620 | Rentabilidade: 12,4% a.a.
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ini-rent">Valor inicial (R$)</Label>
              <Input id="ini-rent" type="number" placeholder="Ex: 10000" value={inicial} onChange={(e) => setInicial(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fin-rent">Valor final (R$)</Label>
              <Input id="fin-rent" type="number" placeholder="Ex: 11200" value={final} onChange={(e) => setFinal(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Rentabilidade</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={`rounded-lg p-4 text-center ${result.absoluta >= 0 ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-red-50 dark:bg-red-950/40"}`}>
                <p className="text-xs text-muted-foreground">Ganho absoluto</p>
                <p className={`mt-1 text-xl font-bold ${result.absoluta >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{fmt(result.absoluta)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Rentabilidade</p>
                <p className="mt-1 text-xl font-bold text-primary">{result.relativa.toFixed(2)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
