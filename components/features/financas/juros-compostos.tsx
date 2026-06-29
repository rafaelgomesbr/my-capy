"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { FAQItem } from "@/types";

const tool = getToolBySlug("financas", "juros-compostos")!;

const faqs: FAQItem[] = [
  {
    question: "O que são juros compostos?",
    answer:
      "Juros compostos são aqueles calculados sobre o montante acumulado (capital + juros anteriores). Ao contrário dos juros simples, os rendimentos de cada período são incorporados ao capital base para o próximo período.",
  },
  {
    question: "Qual a diferença entre juros simples e compostos?",
    answer:
      "Nos juros simples, os juros são calculados sempre sobre o capital inicial. Nos juros compostos, cada período calcula sobre o montante acumulado, gerando o efeito de 'juros sobre juros', que resulta em crescimento exponencial.",
  },
  {
    question: "Como calcular juros compostos?",
    answer:
      "A fórmula é: M = C × (1 + i)^t, onde M é o montante final, C é o capital inicial, i é a taxa de juros por período e t é o número de períodos.",
  },
  {
    question: "Para que servem os juros compostos?",
    answer:
      "São amplamente usados em investimentos (poupança, CDB, Tesouro Direto), financiamentos, empréstimos e cartões de crédito. Entender juros compostos é fundamental para tomar boas decisões financeiras.",
  },
  {
    question: "O que é a regra dos 72?",
    answer:
      "A regra dos 72 é um atalho mental para estimar quanto tempo leva para dobrar um investimento com juros compostos: divida 72 pela taxa de juros anual. A 6% ao ano, o dinheiro dobra em aproximadamente 12 anos (72 ÷ 6). A 12% ao ano, dobra em apenas 6 anos — ilustrando o poder exponencial dos juros compostos no longo prazo.",
  },
];

export function JurosCompostos() {
  const [capital, setCapital] = useState("");
  const [taxa, setTaxa] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [unidade, setUnidade] = useState("mensal");
  const [result, setResult] = useState<{ montante: number; juros: number } | null>(null);

  const calcular = useCallback(() => {
    const C = parseFloat(capital.replace(",", "."));
    const i = parseFloat(taxa.replace(",", ".")) / 100;
    const t = parseInt(periodo);
    if (isNaN(C) || isNaN(i) || isNaN(t) || C <= 0 || i <= 0 || t <= 0) return;
    const M = C * Math.pow(1 + i, t);
    setResult({ montante: M, juros: M - C });
  }, [capital, taxa, periodo]);

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            Os juros compostos são calculados pela fórmula <strong>M = C × (1 + i)^t</strong>, onde M é o
            montante final, C é o capital inicial, i é a taxa de juros por período e t é o número de
            períodos. A cada ciclo, os juros gerados passam a integrar a base de cálculo, criando o
            famoso efeito &ldquo;juros sobre juros&rdquo;.
          </p>
          <p>
            O impacto do tempo é decisivo: R$ 10.000 aplicados a 1% ao mês rendem R$ 1.268 em 12 meses,
            mas R$ 23.004 em 84 meses (7 anos) — o saldo mais que dobra sem nenhum aporte adicional.
            É por isso que começar a investir cedo faz mais diferença do que aportar valores maiores depois.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo 1: Investimento em CDB</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Capital: R$ 10.000 | Taxa: 1% ao mês | Período: 12 meses
            </p>
            <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
              Resultado: R$ 11.268,25 (juros: R$ 1.268,25)
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo 2: Dívida no cartão de crédito</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Dívida: R$ 2.000 | Taxa: 14% ao mês | Período: 6 meses sem pagar
            </p>
            <p className="mt-2 font-semibold text-rose-600 dark:text-rose-400">
              Montante: R$ 4.348,63 — a dívida mais que dobrou em 6 meses
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capital">Capital inicial (R$)</Label>
              <Input
                id="capital"
                type="number"
                placeholder="Ex: 10000"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa">Taxa de juros (%)</Label>
              <Input
                id="taxa"
                type="number"
                placeholder="Ex: 1"
                value={taxa}
                onChange={(e) => setTaxa(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodo">Número de períodos</Label>
              <Input
                id="periodo"
                type="number"
                placeholder="Ex: 12"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                min="1"
                step="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade do período</Label>
              <select
                id="unidade"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="diario">Diário</option>
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
            </div>
          </div>
          <Button onClick={calcular} className="w-full">
            Calcular Juros Compostos
          </Button>

          {result && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Capital inicial</p>
                <p className="mt-1 text-xl font-bold">{fmt(parseFloat(capital))}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">Juros ganhos</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {fmt(result.juros)}
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Montante final</p>
                <p className="mt-1 text-xl font-bold text-primary">{fmt(result.montante)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
