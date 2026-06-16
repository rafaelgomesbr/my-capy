"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "margem-lucro")!;
const faqs = [
  { question: "Qual a diferença entre margem bruta e líquida?", answer: "A margem bruta desconta apenas o custo dos produtos vendidos (CPV/CMV) da receita. A margem líquida desconta todos os custos e despesas operacionais, financeiras e tributárias. Esta calculadora calcula a margem bruta sobre a receita total menos o custo total informado." },
  { question: "O que é uma boa margem de lucro?", answer: "Depende muito do setor. Varejo: 2-5%. Serviços: 10-20%. Software/SaaS: 60-80%. E-commerce: 10-15%. Compare sua margem com a média do seu setor para ter uma referência real." },
  { question: "Margem de lucro vs. markup: qual usar?", answer: "Use a margem de lucro para analisar a saúde financeira do negócio (quanto do faturamento se converte em lucro). Use o markup para definir preços de venda a partir do custo (quanto adicionar ao custo para chegar no preço)." },
  { question: "Como aumentar a margem de lucro?", answer: "Há dois caminhos: aumentar a receita (preço de venda, volume de vendas, mix de produtos) ou reduzir os custos (negociar fornecedores, reduzir desperdício, melhorar eficiência operacional). Na prática, as melhores empresas trabalham nos dois." },
  { question: "Impostos entram no custo?", answer: "Depende do regime tributário. No Simples Nacional, o imposto é uma porcentagem da receita. No Lucro Presumido/Real, impostos como PIS, COFINS, ICMS e ISS devem ser considerados ao calcular a margem real do negócio." },
];

export function MargemLucro() {
  const [receita, setReceita] = useState("");
  const [custo, setCusto] = useState("");
  const [result, setResult] = useState<{ lucro: number; margem: number } | null>(null);

  const calcular = useCallback(() => {
    const R = parseFloat(receita.replace(",", "."));
    const C = parseFloat(custo.replace(",", "."));
    if (isNaN(R) || isNaN(C) || R <= 0) return;
    const lucro = R - C;
    const margem = (lucro / R) * 100;
    setResult({ lucro, margem });
  }, [receita, custo]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A margem de lucro é calculada pela fórmula <strong>Margem = (Receita – Custo) / Receita × 100</strong>.
            Ela representa a porcentagem da receita que se converte em lucro, após descontar todos os custos
            informados. É um dos indicadores mais importantes para avaliar a saúde financeira de um negócio.
          </p>
          <p>
            Diferente do markup (que calcula o acréscimo sobre o custo), a margem de lucro é sempre expressa
            em relação à receita de venda. Uma margem de 30% significa que, de cada R$ 100 faturados, R$ 30
            são lucro e R$ 70 cobrem custos. Para precificação, é importante saber qual dos dois você está
            usando para não errar no cálculo.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Loja de roupas</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Receita: R$ 20.000 | Custo (produtos + aluguel + funcionários): R$ 14.000
            </p>
            <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
              Lucro: R$ 6.000 | Margem: 30%
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Prestador de serviços</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Receita: R$ 8.000 | Custo (ferramentas + deslocamento + tributos): R$ 2.400
            </p>
            <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
              Lucro: R$ 5.600 | Margem: 70%
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rec-ml">Receita total (R$)</Label>
              <Input id="rec-ml" type="number" placeholder="Ex: 10000" value={receita} onChange={(e) => setReceita(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cus-ml">Custo total (R$)</Label>
              <Input id="cus-ml" type="number" placeholder="Ex: 7000" value={custo} onChange={(e) => setCusto(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Margem</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">Lucro</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.lucro)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Margem de lucro</p>
                <p className="mt-1 text-xl font-bold text-primary">{result.margem.toFixed(2)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
