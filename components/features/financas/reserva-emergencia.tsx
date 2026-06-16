"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "reserva-emergencia")!;
const faqs = [
  { question: "Quantos meses de reserva de emergência devo ter?", answer: "Para quem tem renda estável (CLT): de 3 a 6 meses de despesas mensais. Para autônomos, freelancers e empresários (renda variável): de 6 a 12 meses. Quem tem dependentes ou profissão de recolocação mais difícil deve manter o valor mais alto da faixa." },
  { question: "Onde guardar a reserva de emergência?", answer: "A reserva deve ficar em aplicações seguras, conservadoras e com liquidez imediata: Tesouro Selic (disponível pelo Tesouro Direto), CDB com liquidez diária de banco grande, Conta remunerada de banco digital ou Fundo DI de taxa zero. Nunca coloque a reserva em renda variável ou aplicações com carência." },
  { question: "A reserva de emergência deve incluir o valor do aluguel?", answer: "Sim. O cálculo de 'despesas mensais' deve incluir todas as despesas fixas e variáveis: aluguel/financiamento, alimentação, transporte, saúde, educação, contas de consumo, lazer e serviços. Basicamente, tudo que você gasta por mês para manter seu padrão de vida." },
  { question: "Posso investir antes de ter a reserva completa?", answer: "O ideal é completar a reserva de emergência antes de investir em ativos de maior risco. Sem reserva, qualquer imprevisto pode forçar o resgate antecipado de investimentos com prejuízo. Com renda alta e estabilidade, é possível construir as duas em paralelo." },
  { question: "Como construir a reserva de emergência rapidamente?", answer: "Defina o valor-alvo com esta calculadora, depois divida por 12 a 18 meses para saber o aporte mensal necessário. Aplique automaticamente logo ao receber o salário (pay yourself first) em um CDB de liquidez diária ou conta remunerada." },
];

export function ReservaEmergencia() {
  const [despesas, setDespesas] = useState("");
  const [perfil, setPerfil] = useState("clt");
  const [result, setResult] = useState<{ minimo: number; ideal: number; maximo: number } | null>(null);

  const meses: Record<string, [number, number, number]> = { clt: [3, 6, 6], autonomo: [6, 9, 12] };

  const calcular = useCallback(() => {
    const D = parseFloat(despesas.replace(",", "."));
    if (isNaN(D) || D <= 0) return;
    const [min, ideal, max] = meses[perfil];
    setResult({ minimo: D * min, ideal: D * ideal, maximo: D * max });
  }, [despesas, perfil]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A reserva de emergência é o alicerce da saúde financeira. Sem ela, qualquer imprevisto —
            demissão, problema de saúde, carro quebrado — pode levar a dívidas caras ou ao resgate
            precoce de investimentos de longo prazo. A calculadora mostra três faixas: mínimo (para
            se manter operacional), ideal (recomendado para o seu perfil) e máximo (conservador).
          </p>
          <p>
            O critério de 3-6 meses para CLT e 6-12 meses para autônomos reflete a diferença no tempo
            médio de recolocação e na estabilidade de renda. O valor deve ser baseado nas{" "}
            <strong>despesas mensais reais</strong>, não na renda — inclua aluguel, alimentação,
            transporte, saúde, educação e todas as despesas recorrentes do mês.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Profissional CLT</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Despesas mensais: R$ 4.000 | Perfil: CLT (renda fixa)
            </p>
            <p className="mt-2 font-semibold text-primary">
              Mínimo: R$ 12.000 (3 meses) | Ideal: R$ 24.000 (6 meses)
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Autônomo / Freelancer</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Despesas mensais: R$ 5.500 | Perfil: Autônomo (renda variável)
            </p>
            <p className="mt-2 font-semibold text-primary">
              Mínimo: R$ 33.000 (6 meses) | Ideal: R$ 49.500 (9 meses) | Máximo: R$ 66.000 (12 meses)
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="desp-re">Despesas mensais (R$)</Label>
              <Input id="desp-re" type="number" placeholder="Ex: 3000" value={despesas} onChange={(e) => setDespesas(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perf-re">Perfil de renda</Label>
              <select id="perf-re" value={perfil} onChange={(e) => setPerfil(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="clt">CLT / Renda fixa</option>
                <option value="autonomo">Autônomo / Empresário</option>
              </select>
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Reserva</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-amber-50 p-4 text-center dark:bg-amber-950/40">
                <p className="text-xs text-muted-foreground">Mínimo</p>
                <p className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">{fmt(result.minimo)}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">Ideal</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.ideal)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Máximo</p>
                <p className="mt-1 text-xl font-bold text-primary">{fmt(result.maximo)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
