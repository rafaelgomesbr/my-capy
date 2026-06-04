"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "cac")!;
const faqs = [{ question: "O que é CAC?", answer: "CAC (Custo de Aquisição de Cliente) é quanto sua empresa gasta em média para conquistar cada novo cliente. CAC = Total investido em vendas e marketing ÷ Novos clientes adquiridos." }];

export function Cac() {
  const [investimento, setInvestimento] = useState("");
  const [clientes, setClientes] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calcular = useCallback(() => {
    const I = parseFloat(investimento.replace(",", "."));
    const C = parseInt(clientes);
    if (isNaN(I) || isNaN(C) || I <= 0 || C <= 0) return;
    setResult(I / C);
  }, [investimento, clientes]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inv-cac">Total investido em Marketing/Vendas (R$)</Label>
              <Input id="inv-cac" type="number" placeholder="Ex: 10000" value={investimento} onChange={(e) => setInvestimento(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cli-cac">Novos clientes adquiridos</Label>
              <Input id="cli-cac" type="number" placeholder="Ex: 50" value={clientes} onChange={(e) => setClientes(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular CAC</Button>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">Custo de Aquisição por Cliente (CAC)</p>
              <p className="mt-2 text-3xl font-bold text-primary">{fmt(result)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
