"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "taxas-marketplace")!;
const faqs = [{ question: "Quais as taxas do Mercado Livre?", answer: "O Mercado Livre cobra entre 9% e 16% dependendo da categoria, mais uma taxa fixa por venda em alguns casos. Vendas no Mercado Pago acrescentam taxa de processamento." }];

const marketplaces = [
  { name: "Mercado Livre (Full)", taxa: 0.14 },
  { name: "Mercado Livre (Clássico)", taxa: 0.11 },
  { name: "Shopee", taxa: 0.14 },
  { name: "Amazon", taxa: 0.12 },
  { name: "Magazine Luiza", taxa: 0.16 },
  { name: "B2W (Americanas/Submarino)", taxa: 0.16 },
];

export function TaxasMarketplace() {
  const [preco, setPreco] = useState("");
  const [marketplace, setMarketplace] = useState("0");
  const [result, setResult] = useState<{ taxa: number; liquido: number; nomeMP: string } | null>(null);

  const calcular = useCallback(() => {
    const P = parseFloat(preco.replace(",", "."));
    const mp = marketplaces[parseInt(marketplace)];
    if (isNaN(P) || P <= 0 || !mp) return;
    setResult({ taxa: P * mp.taxa, liquido: P * (1 - mp.taxa), nomeMP: mp.name });
  }, [preco, marketplace]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preco-mp">Preço de venda (R$)</Label>
              <Input id="preco-mp" type="number" placeholder="Ex: 200" value={preco} onChange={(e) => setPreco(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mp-select">Marketplace</Label>
              <select id="mp-select" value={marketplace} onChange={(e) => setMarketplace(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {marketplaces.map((mp, i) => (
                  <option key={mp.name} value={i}>{mp.name} ({(mp.taxa * 100).toFixed(0)}%)</option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Taxas</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-950/40">
                <p className="text-xs text-muted-foreground">Taxa {result.nomeMP}</p>
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
