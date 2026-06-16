"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "markup")!;
const faqs = [
  { question: "Qual a diferença entre markup e margem de lucro?", answer: "Markup é calculado sobre o custo: Preço = Custo × (1 + Markup%). Margem é calculada sobre o preço de venda. Um markup de 100% equivale a uma margem de 50%. Um markup de 50% equivale a uma margem de 33,3%." },
  { question: "Como calcular o preço de venda ideal?", answer: "O preço deve cobrir: custo do produto (CMV), despesas fixas e variáveis (aluguel, funcionários, embalagem), tributos sobre faturamento e ainda gerar o lucro desejado. Divida todos esses custos pela receita esperada para encontrar a margem necessária e depois calcule o markup correspondente." },
  { question: "O que é markup divisor?", answer: "O markup divisor é uma fórmula que facilita o cálculo do preço. Em vez de somar as porcentagens de custo, usa-se: Preço = Custo / (1 – % custos). Por exemplo, se os custos representam 40% do preço, o markup divisor é 0,6: Preço = Custo / 0,6." },
  { question: "Qual markup usar no varejo?", answer: "Depende do produto e margem desejada. Roupas e calçados: 100-200%. Alimentos frescos: 30-50%. Eletrônicos: 20-40%. Serviços: 100-500%. Sempre leve em conta impostos, frete e despesas fixas no cálculo." },
  { question: "Um markup de 100% significa dobrar o preço?", answer: "Sim. Markup de 100% sobre o custo = preço de venda é o dobro do custo. Se o produto custa R$ 50 e você aplica 100% de markup, vende por R$ 100. Isso equivale a uma margem de lucro de 50%." },
];

export function Markup() {
  const [custo, setCusto] = useState("");
  const [markup, setMarkup] = useState("");
  const [result, setResult] = useState<{ preco: number; lucro: number; margem: number } | null>(null);

  const calcular = useCallback(() => {
    const C = parseFloat(custo.replace(",", "."));
    const M = parseFloat(markup.replace(",", ".")) / 100;
    if (isNaN(C) || isNaN(M) || C <= 0) return;
    const preco = C * (1 + M);
    const lucro = preco - C;
    const margem = (lucro / preco) * 100;
    setResult({ preco, lucro, margem });
  }, [custo, markup]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O markup é um percentual adicionado ao custo para definir o preço de venda:{" "}
            <strong>Preço = Custo × (1 + Markup / 100)</strong>. É amplamente usado no varejo e na indústria
            para precificação rápida. A calculadora também mostra a margem de lucro efetiva, que é sempre menor
            do que o markup aplicado.
          </p>
          <p>
            Para precificar corretamente, o &ldquo;custo&rdquo; deve incluir não só o preço de compra do produto
            mas também todas as despesas variáveis (impostos, frete, comissões) e uma parcela das despesas fixas
            (aluguel, funcionários) rateada por produto. O markup deverá cobrir esses custos e ainda gerar o
            lucro desejado.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Produto de moda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Custo: R$ 80 | Markup: 150%
            </p>
            <p className="mt-2 font-semibold text-primary">
              Preço de venda: R$ 200 | Lucro: R$ 120 | Margem efetiva: 60%
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Produto alimentício</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Custo: R$ 30 | Markup: 60%
            </p>
            <p className="mt-2 font-semibold text-primary">
              Preço de venda: R$ 48 | Lucro: R$ 18 | Margem efetiva: 37,5%
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="custo-mk">Custo do produto (R$)</Label>
              <Input id="custo-mk" type="number" placeholder="Ex: 50" value={custo} onChange={(e) => setCusto(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="markup-mk">Markup (%)</Label>
              <Input id="markup-mk" type="number" placeholder="Ex: 100" value={markup} onChange={(e) => setMarkup(e.target.value)} step="0.1" />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Preço de Venda</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Preço de venda</p>
                <p className="mt-1 text-xl font-bold text-primary">{fmt(result.preco)}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">Lucro</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.lucro)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Margem efetiva</p>
                <p className="mt-1 text-xl font-bold">{result.margem.toFixed(2)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
