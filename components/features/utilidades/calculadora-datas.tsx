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
const faqs = [{ question: "Como calcular dias úteis entre datas?", answer: "Para dias úteis, subtraia os sábados, domingos e feriados nacionais da contagem total." }];

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
    <ToolLayout tool={tool} faqs={faqs}>
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
