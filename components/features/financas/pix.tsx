"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "pix")!;
const faqs = [{ question: "Pix tem taxa para pessoa física?", answer: "Para pessoa física, o Pix é gratuito para envio. Para empresas e MEI que recebem via Pix, os bancos podem cobrar uma taxa (geralmente entre 0,5% e 1,3% sobre o valor recebido)." }];

export function Pix() {
  const [valor, setValor] = useState("");
  const [taxa, setTaxa] = useState("0.99");
  const [result, setResult] = useState<{ taxa: number; liquido: number } | null>(null);

  const calcular = useCallback(() => {
    const V = parseFloat(valor.replace(",", "."));
    const T = parseFloat(taxa.replace(",", ".")) / 100;
    if (isNaN(V) || V <= 0) return;
    setResult({ taxa: V * T, liquido: V * (1 - T) });
  }, [valor, taxa]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="val-pix">Valor da venda (R$)</Label>
              <Input id="val-pix" type="number" placeholder="Ex: 200" value={valor} onChange={(e) => setValor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxa-pix">Taxa do Pix (%)</Label>
              <Input id="taxa-pix" type="number" placeholder="Ex: 0.99" value={taxa} onChange={(e) => setTaxa(e.target.value)} step="0.01" />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-950/40">
                <p className="text-xs text-muted-foreground">Taxa descontada</p>
                <p className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">-{fmt(result.taxa)}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">Valor líquido</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.liquido)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
