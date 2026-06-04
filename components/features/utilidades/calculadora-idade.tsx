"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("utilidades", "calculadora-idade")!;
const faqs = [{ question: "Como é calculada a idade exata?", answer: "A idade é calculada em anos, meses e dias completos desde a data de nascimento até hoje." }];

export function CalculadoraIdade() {
  const [nascimento, setNascimento] = useState("");

  const calcularIdade = (nasc: string) => {
    if (!nasc) return null;
    const nascDate = new Date(nasc);
    const hoje = new Date();
    if (nascDate > hoje) return null;

    let anos = hoje.getFullYear() - nascDate.getFullYear();
    let meses = hoje.getMonth() - nascDate.getMonth();
    let dias = hoje.getDate() - nascDate.getDate();

    if (dias < 0) { meses--; dias += new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate(); }
    if (meses < 0) { anos--; meses += 12; }

    const totalDias = Math.floor((hoje.getTime() - nascDate.getTime()) / (1000 * 60 * 60 * 24));
    const proximoAniversario = new Date(nascDate);
    proximoAniversario.setFullYear(hoje.getFullYear());
    if (proximoAniversario < hoje) proximoAniversario.setFullYear(hoje.getFullYear() + 1);
    const diasParaAniversario = Math.floor((proximoAniversario.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    return { anos, meses, dias, totalDias, diasParaAniversario };
  };

  const result = calcularIdade(nascimento);

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nasc-date">Data de nascimento</Label>
            <Input id="nasc-date" type="date" value={nascimento} onChange={(e) => setNascimento(e.target.value)} max={new Date().toISOString().split("T")[0]} />
          </div>
          {result && (
            <div className="space-y-3">
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Sua idade</p>
                <p className="mt-1 text-4xl font-bold text-primary">{result.anos} <span className="text-lg">anos</span></p>
                <p className="mt-1 text-sm text-muted-foreground">{result.meses} meses e {result.dias} dias</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total de dias vividos</p>
                  <p className="mt-1 text-xl font-bold">{result.totalDias.toLocaleString("pt-BR")}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Dias para o aniversário</p>
                  <p className="mt-1 text-xl font-bold">{result.diasParaAniversario === 0 ? "🎂 Hoje!" : result.diasParaAniversario}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
