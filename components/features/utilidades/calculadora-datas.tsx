"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("utilidades", "calculadora-datas")!;
const faqs = [
  { question: "Como calcular dias úteis entre datas?", answer: "Para dias úteis, subtraia os sábados, domingos e feriados nacionais da contagem total de dias. Esta ferramenta calcula dias corridos. Para cálculo com dias úteis, use o número de dias corridos como base e desconte aproximadamente 2 dias por semana (finais de semana) e os feriados do período." },
  { question: "Para que serve adicionar ou subtrair dias de uma data?", answer: "Muito útil em contextos jurídicos (prazos processuais), financeiros (vencimento de parcelas, rendimentos de renda fixa), logísticos (data prevista de entrega) e de planejamento (quantos dias até um evento). Insira a data base e o número de dias para obter a data resultante e o dia da semana." },
  { question: "Como calcular a data de vencimento de um prazo?", answer: "Use a aba 'Adicionar/Subtrair dias'. Insira a data de início como data base, selecione 'Adicionar dias' e informe o prazo em dias. A ferramenta mostrará a data exata de vencimento e o dia da semana correspondente — essencial para prazos contratuais e judiciais." },
  { question: "Qual a diferença entre dias corridos e dias úteis?", answer: "Dias corridos contam todos os dias do calendário, incluindo finais de semana e feriados. Dias úteis excluem sábados, domingos e feriados. Em contratos e prazos legais, especifique sempre qual das duas formas está sendo usada — a diferença pode ser significativa em períodos com muitos feriados." },
  { question: "Quantas semanas há em um ano?", answer: "Um ano tem 52 semanas completas e 1 ou 2 dias extras (anos comuns têm 365 dias = 52 × 7 + 1; anos bissextos têm 366 = 52 × 7 + 2). Para calcular semanas entre duas datas, divida o número de dias por 7 — a ferramenta já mostra esse valor automaticamente." },
];

const DIAS_SEMANA = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export function CalculadoraDatas() {
  const [data1, setData1] = useState("");
  const [data2, setData2] = useState("");
  const [dataBase, setDataBase] = useState(new Date().toISOString().split("T")[0]);
  const [dias, setDias] = useState("");
  const [operacao, setOperacao] = useState("add");
  const [result, setResult] = useState<{ diferenca?: number; novaData?: string; diaSemana?: string } | null>(null);

  const calcularDiferenca = () => {
    if (!data1 || !data2) return;
    const d1 = new Date(data1), d2 = new Date(data2);
    const diff = Math.abs(d2.getTime() - d1.getTime());
    setResult({ diferenca: Math.floor(diff / (1000 * 60 * 60 * 24)) });
  };

  const calcularNovaData = () => {
    if (!dataBase || !dias) return;
    const base = new Date(dataBase);
    const d = parseInt(dias);
    if (isNaN(d)) return;
    base.setDate(base.getDate() + (operacao === "add" ? d : -d));
    const formatted = base.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    setResult({ novaData: formatted, diaSemana: DIAS_SEMANA[base.getDay()] });
  };

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A calculadora de datas tem duas funções: calcular a diferença em dias entre duas datas
            (útil para prazos, durações de contratos e planejamento) e calcular uma nova data a
            partir de uma data base somando ou subtraindo um número de dias (útil para vencimentos,
            prazos judiciais e previsões de entrega).
          </p>
          <p>
            O resultado de diferença também exibe o equivalente em semanas e dias para facilitar
            o planejamento. Na função de adição/subtração, o dia da semana é mostrado junto com a
            data calculada — evitando surpresas de prazos caindo em finais de semana ou feriados.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Casos de uso práticos</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Prazo processual: 15/06/2026 + 15 dias = 30/06/2026 (Terça)</li>
              <li>• Duração de contrato: 01/01/2026 → 01/01/2027 = 365 dias (52 semanas)</li>
              <li>• Vencimento de parcela: hoje + 30 dias = próxima data de cobrança</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="diferenca">
            <TabsList className="w-full">
              <TabsTrigger value="diferenca" className="flex-1">Diferença entre datas</TabsTrigger>
              <TabsTrigger value="calcular" className="flex-1">Adicionar/Subtrair dias</TabsTrigger>
            </TabsList>
            <TabsContent value="diferenca" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="d1-cd">Data inicial</Label><Input id="d1-cd" type="date" value={data1} onChange={(e) => setData1(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="d2-cd">Data final</Label><Input id="d2-cd" type="date" value={data2} onChange={(e) => setData2(e.target.value)} /></div>
              </div>
              <Button onClick={calcularDiferenca} className="w-full">Calcular Diferença</Button>
              {result?.diferenca !== undefined && (
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Diferença</p>
                  <p className="text-3xl font-bold text-primary">{result.diferenca} <span className="text-lg">dias</span></p>
                  <p className="text-sm text-muted-foreground">{Math.floor(result.diferenca / 7)} semanas e {result.diferenca % 7} dias</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="calcular" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2"><Label htmlFor="base-cd">Data base</Label><Input id="base-cd" type="date" value={dataBase} onChange={(e) => setDataBase(e.target.value)} /></div>
                <div className="space-y-2">
                  <Label htmlFor="op-cd">Operação</Label>
                  <select id="op-cd" value={operacao} onChange={(e) => setOperacao(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="add">Adicionar dias</option>
                    <option value="sub">Subtrair dias</option>
                  </select>
                </div>
                <div className="space-y-2"><Label htmlFor="dias-cd">Número de dias</Label><Input id="dias-cd" type="number" placeholder="Ex: 30" value={dias} onChange={(e) => setDias(e.target.value)} /></div>
              </div>
              <Button onClick={calcularNovaData} className="w-full">Calcular Nova Data</Button>
              {result?.novaData && (
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">{result.diaSemana}</p>
                  <p className="text-xl font-bold text-primary">{result.novaData}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
