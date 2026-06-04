"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "decimo-terceiro")!;
const faqs = [
  { question: "Como é calculado o 13º salário?", answer: "O 13º é proporcional aos meses trabalhados no ano. O valor bruto é o salário bruto × (meses trabalhados / 12). A 1ª parcela é metade do bruto; a 2ª tem descontos de INSS e IRRF." },
];

export function DecimoTerceiro() {
  const [salario, setSalario] = useState("");
  const [meses, setMeses] = useState("12");
  const [result, setResult] = useState<{ bruto: number; primeiraParcela: number; segundaParcela: number } | null>(null);

  const calcular = useCallback(() => {
    const S = parseFloat(salario.replace(",", "."));
    const M = parseInt(meses);
    if (isNaN(S) || S <= 0 || isNaN(M) || M <= 0) return;
    const bruto = S * (M / 12);
    const primeiraParcela = bruto / 2;
    const inss = bruto * 0.14;
    const segundaParcela = bruto / 2 - Math.max(0, inss - bruto / 2);
    setResult({ bruto, primeiraParcela, segundaParcela });
  }, [salario, meses]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sal-13">Salário bruto (R$)</Label>
              <Input id="sal-13" type="number" placeholder="Ex: 4000" value={salario} onChange={(e) => setSalario(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meses-13">Meses trabalhados</Label>
              <select id="meses-13" value={meses} onChange={(e) => setMeses(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m} {m === 1 ? "mês" : "meses"}</option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular 13º Salário</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Valor bruto</p>
                <p className="mt-1 text-xl font-bold">{fmt(result.bruto)}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">1ª Parcela (nov)</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.primeiraParcela)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">2ª Parcela (dez, aprox.)</p>
                <p className="mt-1 text-xl font-bold text-primary">{fmt(result.segundaParcela)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
