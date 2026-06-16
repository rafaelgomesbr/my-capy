"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "cagr")!;
const faqs = [
  { question: "O que é CAGR?", answer: "CAGR (Compound Annual Growth Rate) é a Taxa de Crescimento Anual Composta. Mede a taxa constante de crescimento que um ativo precisaria ter por ano para ir de um valor inicial a um valor final no período especificado. É um dos indicadores mais usados para comparar performance de investimentos." },
  { question: "Qual a fórmula do CAGR?", answer: "CAGR = (Valor Final / Valor Inicial)^(1/n) – 1, onde n é o número de anos. Por exemplo: se um investimento foi de R$ 10.000 para R$ 16.105 em 5 anos, o CAGR é (16.105/10.000)^(1/5) – 1 = 10% a.a." },
  { question: "Qual a diferença entre CAGR e retorno total?", answer: "O retorno total é o percentual de ganho absoluto no período. O CAGR é a taxa anualizada que explica esse retorno. Um fundo que dobrou de valor em 5 anos tem retorno total de 100%, mas CAGR de ≈ 14,87% ao ano." },
  { question: "O CAGR é um bom indicador de desempenho?", answer: "O CAGR é excelente para comparar investimentos de diferentes durações em base anualizada. Porém, ele 'suaviza' a volatilidade — dois ativos com o mesmo CAGR podem ter tido trajetórias completamente diferentes. Use junto com o desvio padrão para uma análise mais completa." },
  { question: "Como comparar o CAGR de ações com a renda fixa?", answer: "O CDI e a Selic são as taxas de referência de renda fixa no Brasil. Se o CAGR de uma ação for menor do que o CDI do mesmo período, significa que você teria se saído melhor na renda fixa com menos risco. É sempre importante comparar o retorno ajustado ao risco." },
];

export function Cagr() {
  const [inicial, setInicial] = useState("");
  const [final, setFinal] = useState("");
  const [anos, setAnos] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calcular = useCallback(() => {
    const VI = parseFloat(inicial.replace(",", "."));
    const VF = parseFloat(final.replace(",", "."));
    const n = parseFloat(anos.replace(",", "."));
    if (isNaN(VI) || isNaN(VF) || isNaN(n) || VI <= 0 || n <= 0) return;
    setResult((Math.pow(VF / VI, 1 / n) - 1) * 100);
  }, [inicial, final, anos]);

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O CAGR (Taxa de Crescimento Anual Composta) normaliza o crescimento de um investimento para uma
            taxa anual constante, permitindo comparar ativos com históricos diferentes. A fórmula é{" "}
            <strong>CAGR = (Valor Final / Valor Inicial)^(1/anos) – 1</strong>. O resultado representa como
            se o ativo tivesse crescido à mesma taxa todos os anos, mesmo que na prática tenha oscilado.
          </p>
          <p>
            O CAGR é amplamente usado para comparar fundos de investimento, ações, ETFs e outros ativos ao
            longo de períodos distintos. Porém, lembre-se: ele não revela a volatilidade do caminho. Dois
            investimentos com o mesmo CAGR podem ter riscos muito diferentes — um pode ter sido estável, o
            outro pode ter sofrido grandes quedas e recuperações.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Fundo de ações</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Valor inicial (jan/2020): R$ 50.000 | Valor atual (jan/2025): R$ 82.000 | Período: 5 anos
            </p>
            <p className="mt-2 font-semibold text-primary">CAGR: ≈ 10,4% ao ano</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Imóvel</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Preço de compra: R$ 200.000 | Valor atual: R$ 350.000 | Período: 8 anos
            </p>
            <p className="mt-2 font-semibold text-primary">CAGR: ≈ 7,2% ao ano</p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ini-cagr">Valor inicial (R$)</Label>
              <Input id="ini-cagr" type="number" placeholder="Ex: 10000" value={inicial} onChange={(e) => setInicial(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fin-cagr">Valor final (R$)</Label>
              <Input id="fin-cagr" type="number" placeholder="Ex: 20000" value={final} onChange={(e) => setFinal(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anos-cagr">Número de anos</Label>
              <Input id="anos-cagr" type="number" placeholder="Ex: 5" value={anos} onChange={(e) => setAnos(e.target.value)} step="0.5" />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular CAGR</Button>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">CAGR — Taxa de Crescimento Anual Composta</p>
              <p className="mt-2 text-3xl font-bold text-primary">{result.toFixed(2)}% a.a.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
