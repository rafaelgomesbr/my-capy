"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "rescisao")!;
const faqs = [
  { question: "O que compõe a rescisão?", answer: "A rescisão inclui: saldo de salário (dias trabalhados no mês da demissão), férias proporcionais + 1/3 constitucional, 13º proporcional, aviso prévio (quando devido) e multa de 40% do FGTS (apenas na demissão sem justa causa pelo empregador)." },
  { question: "Qual a diferença entre demissão sem justa causa e pedido de demissão?", answer: "Na demissão sem justa causa o empregador deve pagar aviso prévio e multa de 40% do FGTS. No pedido de demissão o funcionário também deve o aviso prévio (ou desconto equivalente), e não recebe a multa do FGTS." },
  { question: "O que é a multa de 40% do FGTS?", answer: "É uma penalidade devida pelo empregador ao demitir sem justa causa. Equivale a 40% de tudo que foi depositado no FGTS durante o período de trabalho. Além disso, o trabalhador pode sacar o saldo do FGTS." },
  { question: "O aviso prévio pode ser indenizado?", answer: "Sim. O empregador pode optar por pagar o valor do aviso prévio em dinheiro (aviso indenizado) em vez de manter o funcionário trabalhando por 30 dias. Para quem tem mais de 1 ano de empresa, acrescentam-se 3 dias por ano trabalhado, até 60 dias adicionais." },
  { question: "Qual o prazo para receber a rescisão?", answer: "O prazo é de 10 dias corridos após o término do contrato, independente do tipo de rescisão. O não pagamento gera multa para o empregador." },
];

export function Rescisao() {
  const [salario, setSalario] = useState("");
  const [meses, setMeses] = useState("");
  const [tipo, setTipo] = useState("semjusta");
  const [result, setResult] = useState<{ saldo: number; ferias: number; decTerceiro: number; aviso: number; total: number } | null>(null);

  const calcular = useCallback(() => {
    const S = parseFloat(salario.replace(",", "."));
    const M = parseInt(meses);
    if (isNaN(S) || S <= 0 || isNaN(M) || M <= 0) return;
    const diasMes = new Date().getDate();
    const saldo = S * (diasMes / 30);
    const mesesAno = M % 12 || 12;
    const ferias = S * (mesesAno / 12) * (4 / 3);
    const decTerceiro = S * (mesesAno / 12);
    const aviso = tipo === "semjusta" ? S : 0;
    setResult({ saldo, ferias, decTerceiro, aviso, total: saldo + ferias + decTerceiro + aviso });
  }, [salario, meses, tipo]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O cálculo de rescisão estima os principais valores devidos ao término do contrato CLT. O{" "}
            <strong>saldo de salário</strong> é calculado proporcionalmente aos dias trabalhados no mês da
            demissão. As <strong>férias proporcionais</strong> consideram os meses trabalhados no período
            aquisitivo atual (incompleto), mais o adicional de 1/3. O <strong>13º proporcional</strong> cobre
            os meses do ano em curso.
          </p>
          <p>
            <strong>Atenção:</strong> esta calculadora apresenta estimativas. O valor exato da rescisão depende
            de variáveis como: aviso prévio proporcional ao tempo de serviço, multa de 40% do FGTS, saldo do
            FGTS, outros benefícios contratuais e eventuais descontos. Para o cálculo completo e oficial,
            utilize o sistema homologNet do Ministério do Trabalho ou consulte um contador.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Demissão sem justa causa (2 anos de empresa)</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Salário: R$ 3.500 | Meses trabalhados: 24 | Tipo: Sem justa causa
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Saldo + férias + 13º + aviso + multa FGTS (estimativa)
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Pedido de demissão (1 ano de empresa)</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Salário: R$ 2.800 | Meses trabalhados: 12 | Tipo: Pedido de demissão
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Saldo + férias + 13º (sem aviso prévio recebido e sem multa FGTS)
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sal-res">Último salário (R$)</Label>
              <Input id="sal-res" type="number" placeholder="Ex: 3500" value={salario} onChange={(e) => setSalario(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meses-res">Meses trabalhados</Label>
              <Input id="meses-res" type="number" placeholder="Ex: 24" value={meses} onChange={(e) => setMeses(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo-res">Tipo de demissão</Label>
              <select id="tipo-res" value={tipo} onChange={(e) => setTipo(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="semjusta">Sem justa causa</option>
                <option value="comjusta">Com justa causa</option>
                <option value="pedido">Pedido de demissão</option>
              </select>
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Rescisão</Button>
          {result && (
            <div className="space-y-2">
              {[
                { label: "Saldo de salário", value: result.saldo },
                { label: "Férias prop. + 1/3", value: result.ferias },
                { label: "13º proporcional", value: result.decTerceiro },
                { label: "Aviso prévio", value: result.aviso },
              ].map((item) => (
                <div key={item.label} className="flex justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm">{item.label}</span>
                  <span className="font-medium">{fmt(item.value)}</span>
                </div>
              ))}
              <div className="flex justify-between rounded-lg bg-primary/10 p-4">
                <span className="font-bold">Total estimado</span>
                <span className="text-xl font-bold text-primary">{fmt(result.total)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
