"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "dividend-yield")!;
const faqs = [
  { question: "O que é Dividend Yield?", answer: "Dividend Yield (DY) é a relação entre os dividendos pagos por uma ação ou cota de FII e o preço atual do ativo. Indica quanto o investidor recebe em proventos em relação ao valor que investiu. DY = (Dividendos anuais por ação / Preço atual da ação) × 100." },
  { question: "O que é um bom Dividend Yield?", answer: "Depende do contexto e da taxa Selic. Com Selic a 10% a.a., um DY de 8% pode não compensar o risco. Com Selic a 6%, um DY de 8% é atrativo. Para ações, DY acima de 6-8% é geralmente bom; para FIIs, muitos investidores buscam DY mensal de 0,7% a 1% (equivalente a 8-12% a.a.)." },
  { question: "DY alto sempre é bom sinal?", answer: "Não necessariamente. Um DY muito alto pode indicar que o preço da ação caiu muito (o que aumenta o DY matematicamente sem que os dividendos tenham aumentado). Sempre analise o DY em conjunto com o histórico de pagamentos e a saúde financeira da empresa." },
  { question: "Qual a diferença entre DY de ações e FIIs?", answer: "FIIs (Fundos de Investimento Imobiliário) são obrigados por lei a distribuir 95% do lucro, pagando rendimentos mensais isentos de IR para pessoa física. Ações pagam dividendos conforme a política de cada empresa, geralmente trimestral, semestral ou anual, também isentos de IR." },
  { question: "O que são JCP (Juros sobre Capital Próprio)?", answer: "JCP é uma forma alternativa de distribuição de proventos usada por empresas brasileiras. Diferente dos dividendos, os JCP têm desconto de 15% de IR na fonte. Para fins práticos de cálculo do DY, some dividendos e JCP recebidos no ano." },
];

export function DividendYield() {
  const [dividendos, setDividendos] = useState("");
  const [preco, setPreco] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calcular = useCallback(() => {
    const D = parseFloat(dividendos.replace(",", "."));
    const P = parseFloat(preco.replace(",", "."));
    if (isNaN(D) || isNaN(P) || P <= 0) return;
    setResult((D / P) * 100);
  }, [dividendos, preco]);

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O Dividend Yield (DY) é calculado pela fórmula{" "}
            <strong>DY = (Dividendos anuais por ação ou cota) / Preço atual × 100</strong>. Ele representa
            a porcentagem do preço que o ativo &ldquo;devolveu&rdquo; ao investidor em proventos durante
            o período, sem considerar a valorização ou desvalorização do preço.
          </p>
          <p>
            Investidores de longo prazo que buscam renda passiva costumam montar carteiras com ações e FIIs
            de alto DY consistente. É importante verificar se os dividendos são sustentáveis (payout ratio
            razoável, lucros crescentes) e não apenas uma distribuição pontual que não se repetirá.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Ação de empresa de energia elétrica</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Dividendos pagos no ano: R$ 4,20 por ação | Preço atual: R$ 48,00
            </p>
            <p className="mt-2 font-semibold text-primary">Dividend Yield: 8,75% a.a.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: FII de logística</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Rendimento mensal: R$ 0,90 por cota | Preço da cota: R$ 110,00
            </p>
            <p className="mt-2 font-semibold text-primary">DY mensal: 0,82% | DY anual: ≈ 9,8%</p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="div-dy">Dividendos pagos (R$) por ação/cota</Label>
              <Input id="div-dy" type="number" placeholder="Ex: 6.00" value={dividendos} onChange={(e) => setDividendos(e.target.value)} step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco-dy">Preço atual (R$)</Label>
              <Input id="preco-dy" type="number" placeholder="Ex: 100" value={preco} onChange={(e) => setPreco(e.target.value)} step="0.01" />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Dividend Yield</Button>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">Dividend Yield</p>
              <p className="mt-2 text-3xl font-bold text-primary">{result.toFixed(2)}% a.a.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {result >= 8 ? "✓ Acima de 8% — bom rendimento" : result >= 6 ? "✓ Entre 6-8% — rendimento razoável" : "⚠ Abaixo de 6% — avalie bem"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
