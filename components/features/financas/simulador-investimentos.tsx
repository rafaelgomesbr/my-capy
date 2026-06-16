"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { FAQItem } from "@/types";

const tool = getToolBySlug("financas", "simulador-investimentos")!;

const faqs: FAQItem[] = [
  {
    question: "Como simular um investimento?",
    answer:
      "Insira o capital inicial, os aportes mensais, a taxa de juros anual e o prazo em anos. O simulador calcula o montante total usando juros compostos com capitalização mensal.",
  },
  {
    question: "Qual taxa de juros usar na simulação?",
    answer:
      "Para renda fixa conservadora, use a taxa do CDI ou Selic atual. Para renda variável, use uma estimativa histórica (ex: IBOVESPA médio de 10-15% a.a.). Sempre simule cenários pessimistas e otimistas.",
  },
  {
    question: "Qual a diferença entre rentabilidade bruta e líquida?",
    answer:
      "A rentabilidade bruta é o rendimento antes dos impostos. A líquida desconta o IR sobre os juros, que varia de 22,5% (até 180 dias) a 15% (acima de 720 dias) para renda fixa.",
  },
  {
    question: "Como o aporte mensal impacta o resultado?",
    answer:
      "O aporte mensal tem impacto enorme no longo prazo devido aos juros compostos. Em um horizonte de 20 anos, aportes mensais regulares muitas vezes superam o capital inicial em importância para o resultado final.",
  },
  {
    question: "Quanto preciso investir para ter R$ 1 milhão?",
    answer:
      "Depende do prazo e da rentabilidade. Investindo R$ 1.000/mês com 12% a.a. de rentabilidade, você atinge R$ 1 milhão em aproximadamente 20 anos. Use esta calculadora para simular diferentes cenários.",
  },
];

export function SimuladorInvestimentos() {
  const [capital, setCapital] = useState("");
  const [aporte, setAporte] = useState("");
  const [taxa, setTaxa] = useState("");
  const [anos, setAnos] = useState("");
  const [result, setResult] = useState<{
    montante: number;
    totalAportado: number;
    totalJuros: number;
  } | null>(null);

  const calcular = useCallback(() => {
    const C = parseFloat(capital.replace(",", ".")) || 0;
    const PMT = parseFloat(aporte.replace(",", ".")) || 0;
    const taxaAnual = parseFloat(taxa.replace(",", ".")) / 100;
    const n = parseInt(anos) * 12;
    if (taxaAnual <= 0 || n <= 0) return;
    const i = Math.pow(1 + taxaAnual, 1 / 12) - 1;
    const M = C * Math.pow(1 + i, n) + PMT * ((Math.pow(1 + i, n) - 1) / i);
    const totalAportado = C + PMT * n;
    setResult({ montante: M, totalAportado, totalJuros: M - totalAportado });
  }, [capital, aporte, taxa, anos]);

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O simulador usa juros compostos com capitalização mensal. A taxa anual informada é convertida para
            mensal pela fórmula <strong>i_mensal = (1 + i_anual)^(1/12) - 1</strong>. A cada mês, o aporte é
            somado ao saldo acumulado antes de aplicar os juros, maximizando o efeito dos juros compostos.
          </p>
          <p>
            O resultado mostra o total que você efetivamente aportou versus o quanto os juros geraram. Em prazos
            longos, os rendimentos normalmente superam com folga o total investido — esse é o poder dos juros
            compostos que Albert Einstein chamou de &ldquo;a oitava maravilha do mundo&rdquo;.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Previdência privada</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Capital inicial: R$ 10.000 | Aporte: R$ 500/mês | Taxa: 10% a.a. | Prazo: 20 anos
            </p>
            <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
              Total aportado: R$ 130.000 | Montante final: ≈ R$ 397.000
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Reserva para filhos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Capital: R$ 5.000 | Aporte: R$ 200/mês | Taxa: 12% a.a. | Prazo: 18 anos
            </p>
            <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
              Total aportado: R$ 48.200 | Montante final: ≈ R$ 226.000
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capital-inv">Capital inicial (R$)</Label>
              <Input id="capital-inv" type="number" placeholder="Ex: 1000" value={capital} onChange={(e) => setCapital(e.target.value)} min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aporte-inv">Aporte mensal (R$)</Label>
              <Input id="aporte-inv" type="number" placeholder="Ex: 500" value={aporte} onChange={(e) => setAporte(e.target.value)} min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa-inv">Taxa anual (%)</Label>
              <Input id="taxa-inv" type="number" placeholder="Ex: 12" value={taxa} onChange={(e) => setTaxa(e.target.value)} min="0" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anos-inv">Prazo (anos)</Label>
              <Input id="anos-inv" type="number" placeholder="Ex: 10" value={anos} onChange={(e) => setAnos(e.target.value)} min="1" />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Simular Investimento</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Total aportado</p>
                <p className="mt-1 text-lg font-bold">{fmt(result.totalAportado)}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">Rendimento</p>
                <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.totalJuros)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Montante final</p>
                <p className="mt-1 text-lg font-bold text-primary">{fmt(result.montante)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
