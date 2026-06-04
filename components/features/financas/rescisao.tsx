"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "rescisao")!;
const faqs = [{ question: "O que compõe a rescisão?", answer: "A rescisão inclui saldo de salário, férias proporcionais + 1/3, 13º proporcional, aviso prévio e multa do FGTS (nos casos aplicáveis)." }];

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
    <ToolLayout tool={tool} faqs={faqs}>
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
