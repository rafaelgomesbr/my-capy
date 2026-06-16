"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "independencia-financeira")!;
const faqs = [
  { question: "O que é a regra dos 4%?", answer: "A regra dos 4% (baseada no Estudo de Trinity) diz que você pode sacar 4% do patrimônio por ano durante 30 anos sem esgotá-lo, com alta probabilidade histórica. Para viver com R$ 5.000/mês (R$ 60.000/ano), você precisaria de R$ 1.500.000 investidos (60.000 / 0,04)." },
  { question: "O que é FIRE?", answer: "FIRE (Financial Independence, Retire Early) é um movimento que busca acumular patrimônio suficiente para viver de renda e se aposentar antecipadamente. O foco é maximizar a taxa de poupança, reduzir gastos desnecessários e investir consistentemente para atingir a meta o mais cedo possível." },
  { question: "A regra dos 4% funciona no Brasil?", answer: "A regra dos 4% foi desenvolvida com base no mercado americano. No Brasil, com taxas de juros reais historicamente mais altas, alguns especialistas sugerem que 3% seja um parâmetro mais conservador e seguro para o contexto brasileiro, especialmente com inflação variável." },
  { question: "Qual a diferença entre FIRE conservador e agressivo?", answer: "FIRE conservador usa taxa de saque de 3% (patrimônio = gastos × 400), para maior segurança e longevidade do patrimônio. FIRE agressivo usa 4-5% (patrimônio = gastos × 200-250). Esta calculadora mostra os dois para você comparar." },
  { question: "Como acelerar o caminho para a independência financeira?", answer: "Os dois principais alavancadores são: aumentar a renda (novas fontes, promoções, projetos paralelos) e reduzir gastos (aumenta a taxa de poupança). Dobrar a taxa de poupança de 10% para 20% reduz o prazo para IF pela metade. Rentabilidade alta ajuda, mas tem menos impacto do que se imagina no começo." },
];

export function IndependenciaFinanceira() {
  const [gastos, setGastos] = useState("");
  const [patrimonio, setPatrimonio] = useState("");
  const [taxa, setTaxa] = useState("12");
  const [aporte, setAporte] = useState("");
  const [result, setResult] = useState<{
    metaFire: number; metaConservadora: number; anosParaFire: number;
  } | null>(null);

  const calcular = useCallback(() => {
    const G = parseFloat(gastos.replace(",", "."));
    const P = parseFloat(patrimonio.replace(",", ".")) || 0;
    const taxaAnual = parseFloat(taxa.replace(",", ".")) / 100;
    const PMT = parseFloat(aporte.replace(",", ".")) || 0;
    if (isNaN(G) || G <= 0) return;
    const metaFire = G * 12 * 25;
    const metaConservadora = G * 12 * 33;
    const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;
    let meses = 0;
    let acumulado = P;
    if (PMT > 0 && taxaMensal > 0) {
      while (acumulado < metaFire && meses < 1200) {
        acumulado = acumulado * (1 + taxaMensal) + PMT;
        meses++;
      }
    }
    setResult({ metaFire, metaConservadora, anosParaFire: meses > 0 ? meses / 12 : 0 });
  }, [gastos, patrimonio, taxa, aporte]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A calculadora de independência financeira usa dois benchmarks: a <strong>Meta FIRE (regra dos 4%)</strong>{" "}
            — patrimônio = gastos anuais × 25 — e a <strong>Meta conservadora (regra dos 3%)</strong> —
            patrimônio = gastos anuais × 33. A diferença entre as duas reflete o grau de segurança desejado
            para que o patrimônio sustente a renda por décadas sem se esgotar.
          </p>
          <p>
            O tempo estimado é calculado simulando mês a mês o crescimento do patrimônio com juros compostos
            sobre o saldo atual e os aportes mensais. O resultado assume rentabilidade constante — na prática,
            a volatilidade dos mercados fará com que o prazo real seja diferente. Use como estimativa de
            planejamento, não como data garantida.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Profissional de 30 anos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Gastos: R$ 6.000/mês | Patrimônio atual: R$ 80.000 | Aporte: R$ 3.000/mês | Rentabilidade: 12% a.a.
            </p>
            <p className="mt-2 font-semibold text-primary">
              Meta FIRE: R$ 1.800.000 | Estimativa: ≈ 22 anos (aposentadoria aos 52)
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Casal com renda alta</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Gastos: R$ 10.000/mês | Patrimônio: R$ 300.000 | Aporte: R$ 8.000/mês | Rentabilidade: 10% a.a.
            </p>
            <p className="mt-2 font-semibold text-primary">
              Meta FIRE: R$ 3.000.000 | Estimativa: ≈ 14 anos
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gas-if">Gastos mensais (R$)</Label>
              <Input id="gas-if" type="number" placeholder="Ex: 5000" value={gastos} onChange={(e) => setGastos(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pat-if">Patrimônio atual (R$)</Label>
              <Input id="pat-if" type="number" placeholder="Ex: 100000" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa-if">Rentabilidade anual esperada (%)</Label>
              <Input id="taxa-if" type="number" placeholder="Ex: 12" value={taxa} onChange={(e) => setTaxa(e.target.value)} step="0.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aporte-if">Aporte mensal (R$)</Label>
              <Input id="aporte-if" type="number" placeholder="Ex: 2000" value={aporte} onChange={(e) => setAporte(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Independência Financeira</Button>
          {result && (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Meta FIRE (regra dos 4%)</p>
                  <p className="mt-1 text-xl font-bold text-primary">{fmt(result.metaFire)}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Meta conservadora (3%)</p>
                  <p className="mt-1 text-xl font-bold">{fmt(result.metaConservadora)}</p>
                </div>
              </div>
              {result.anosParaFire > 0 && (
                <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                  <p className="text-sm text-muted-foreground">Tempo estimado para atingir a meta FIRE</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {result.anosParaFire < 1200 / 12
                      ? `${result.anosParaFire.toFixed(1)} anos`
                      : "Mais de 100 anos — aumente o aporte"}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
