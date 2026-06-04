"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "taxas-cartao")!;
const faqs = [{ question: "Qual a diferença entre MDR e taxa de antecipação?", answer: "MDR é a taxa descontada por cada transação. Antecipação é o custo para receber o dinheiro antes do prazo normal (32 dias para crédito)." }];

const taxas: Record<string, Record<string, number>> = {
  debito: { cielo: 0.015, stone: 0.015, pagseguro: 0.019, mercadopago: 0.019 },
  credito1x: { cielo: 0.028, stone: 0.028, pagseguro: 0.032, mercadopago: 0.032 },
  credito2a6: { cielo: 0.035, stone: 0.033, pagseguro: 0.039, mercadopago: 0.036 },
  credito7a12: { cielo: 0.045, stone: 0.041, pagseguro: 0.049, mercadopago: 0.045 },
};

export function TaxasCartao() {
  const [valor, setValor] = useState("");
  const [modalidade, setModalidade] = useState("debito");
  const [operadora, setOperadora] = useState("cielo");
  const [result, setResult] = useState<{ taxa: number; liquido: number } | null>(null);

  const calcular = useCallback(() => {
    const V = parseFloat(valor.replace(",", "."));
    const t = taxas[modalidade]?.[operadora] ?? 0.028;
    if (isNaN(V) || V <= 0) return;
    setResult({ taxa: V * t, liquido: V * (1 - t) });
  }, [valor, modalidade, operadora]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="val-cart">Valor da venda (R$)</Label>
              <Input id="val-cart" type="number" placeholder="Ex: 500" value={valor} onChange={(e) => setValor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mod-cart">Modalidade</Label>
              <select id="mod-cart" value={modalidade} onChange={(e) => setModalidade(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="debito">Débito</option>
                <option value="credito1x">Crédito 1x</option>
                <option value="credito2a6">Crédito 2 a 6x</option>
                <option value="credito7a12">Crédito 7 a 12x</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="op-cart">Operadora</Label>
              <select id="op-cart" value={operadora} onChange={(e) => setOperadora(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="cielo">Cielo</option>
                <option value="stone">Stone</option>
                <option value="pagseguro">PagSeguro</option>
                <option value="mercadopago">Mercado Pago</option>
              </select>
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-950/40">
                <p className="text-xs text-muted-foreground">Taxa cobrada</p>
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
