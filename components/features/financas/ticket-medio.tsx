"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "ticket-medio")!;
const faqs = [{ question: "Como aumentar o ticket médio?", answer: "Estratégias: upsell (oferecer produto superior), cross-sell (produtos complementares), bundle (pacotes), frete grátis acima de um valor e programas de fidelidade." }];

export function TicketMedio() {
  const [receita, setReceita] = useState("");
  const [vendas, setVendas] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calcular = useCallback(() => {
    const R = parseFloat(receita.replace(",", "."));
    const V = parseInt(vendas);
    if (isNaN(R) || isNaN(V) || V <= 0) return;
    setResult(R / V);
  }, [receita, vendas]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rec-tm">Receita total (R$)</Label>
              <Input id="rec-tm" type="number" placeholder="Ex: 50000" value={receita} onChange={(e) => setReceita(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vend-tm">Número de vendas</Label>
              <Input id="vend-tm" type="number" placeholder="Ex: 200" value={vendas} onChange={(e) => setVendas(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Ticket Médio</Button>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <p className="mt-2 text-3xl font-bold text-primary">{fmt(result)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
