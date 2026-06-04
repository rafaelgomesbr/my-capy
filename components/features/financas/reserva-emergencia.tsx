"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "reserva-emergencia")!;
const faqs = [{ question: "Quantos meses de reserva de emergência devo ter?", answer: "Para quem tem renda estável (CLT): 3-6 meses de despesas. Para autônomos e empresários: 6-12 meses. A reserva deve ficar em aplicações seguras e líquidas como Tesouro Selic ou CDB com liquidez diária." }];

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
    <ToolLayout tool={tool} faqs={faqs}>
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
