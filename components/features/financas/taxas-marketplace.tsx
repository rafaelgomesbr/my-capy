"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "taxas-marketplace")!;
const faqs = [
  { question: "Quais as taxas do Mercado Livre?", answer: "O Mercado Livre cobra entre 9% e 16% dependendo da categoria do produto e do plano do vendedor (Clássico ou Premium). Produtos com frete grátis obrigatório (Full ou Flex) têm custo adicional embutido. As taxas podem mudar — sempre verifique no painel do vendedor." },
  { question: "Quais as taxas da Shopee para vendedores?", answer: "A Shopee cobra uma comissão de 12-16% sobre o valor do produto (sem frete), dependendo da categoria. Há períodos de taxa reduzida ou isenção para produtos elegíveis. Para novos sellers, verifique as condições atuais no Centro do Vendedor." },
  { question: "Devo incluir o frete no cálculo da taxa?", answer: "Depende do marketplace. No Mercado Livre, a taxa incide sobre o preço total incluindo frete. Na Shopee, a comissão geralmente incide apenas sobre o preço do produto. Verifique as regras específicas de cada plataforma." },
  { question: "Como calcular se vou lucrar vendendo em marketplace?", answer: "Calcule: Preço de venda – Taxa do marketplace – Custo do produto – Custo de embalagem e envio – Impostos = Lucro líquido por venda. Se o resultado for negativo, você precisa ajustar o preço ou reduzir custos." },
  { question: "Valer a pena vender em marketplace vs. loja própria?", answer: "Marketplaces têm taxa maior mas oferecem tráfego pronto e credibilidade. Loja própria tem menor custo de transação mas exige investimento em marketing e aquisição de clientes. O ideal é operar nos dois canais de forma complementar." },
];

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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            Cada marketplace cobra uma comissão percentual sobre o valor da venda, chamada de MDR (Merchant
            Discount Rate) ou simplesmente taxa de comissão. Essa taxa é descontada automaticamente do valor
            recebido pelo vendedor antes do repasse. Conhecer essa taxa é essencial para precificar
            corretamente e garantir que a venda seja rentável.
          </p>
          <p>
            <strong>Atenção:</strong> as taxas exibidas são estimativas baseadas em informações públicas e
            podem variar por categoria de produto, volume de vendas e plano do vendedor. Sempre confirme as
            taxas atuais diretamente no painel do vendedor de cada plataforma antes de precificar.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Produto R$ 150 no Mercado Livre Premium (14%)</p>
            <p className="mt-1 text-sm text-muted-foreground">Taxa: R$ 21 | Valor líquido: R$ 129</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Se o custo do produto é R$ 90, o lucro real antes de impostos é R$ 39 (26% de margem)
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Produto R$ 80 na Shopee (14%)</p>
            <p className="mt-1 text-sm text-muted-foreground">Taxa: R$ 11,20 | Valor líquido: R$ 68,80</p>
          </div>
        </div>
      }
    >
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
