"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "cac")!;
const faqs = [
  { question: "O que é CAC?", answer: "CAC (Custo de Aquisição de Cliente) é quanto sua empresa gasta em média para conquistar cada novo cliente no período analisado. CAC = Total investido em vendas e marketing ÷ Novos clientes adquiridos no período." },
  { question: "O que incluir no CAC?", answer: "No investimento total em vendas e marketing, inclua: salários da equipe de marketing e vendas, gastos com anúncios (Google, Meta, etc.), ferramentas e softwares de marketing, eventos e feiras, comissões de vendedores e qualquer outro custo voltado para aquisição." },
  { question: "Qual deve ser a relação entre LTV e CAC?", answer: "Uma regra geral é que o LTV (Lifetime Value — quanto o cliente gera de receita durante toda a relação) deve ser pelo menos 3x maior que o CAC. Uma relação LTV:CAC abaixo de 1:1 é insustentável a longo prazo." },
  { question: "Como reduzir o CAC?", answer: "Investir em marketing de conteúdo e SEO (que geram tráfego orgânico), melhorar as taxas de conversão do funil de vendas, focar na retenção de clientes e criar programas de indicação são formas eficientes de reduzir o CAC ao longo do tempo." },
  { question: "Com que frequência devo calcular o CAC?", answer: "O ideal é calcular o CAC mensalmente ou trimestralmente, usando o mesmo período tanto para o investimento quanto para os novos clientes. Evite misturar períodos diferentes, pois isso distorce o resultado." },
];

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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O CAC (Custo de Aquisição de Cliente) é uma métrica essencial para qualquer negócio que investe em
            crescimento. A fórmula é direta: <strong>CAC = Total investido em marketing e vendas ÷ Número de
            novos clientes</strong> no mesmo período. Um CAC alto pode indicar ineficiência nas estratégias de
            captação ou um funil de vendas com baixas taxas de conversão.
          </p>
          <p>
            O CAC deve sempre ser analisado em conjunto com o <strong>LTV (Lifetime Value)</strong> — o valor
            total que um cliente gera durante toda a relação com a empresa. A regra geral do mercado é manter
            LTV:CAC ≥ 3:1. Se você gasta R$ 200 para adquirir um cliente que só gera R$ 150 de receita,
            o negócio é insustentável no longo prazo.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: E-commerce</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Gasto com anúncios e marketing no mês: R$ 15.000 | Novos clientes: 300
            </p>
            <p className="mt-2 font-semibold text-primary">CAC: R$ 50 por cliente</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: SaaS B2B</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Equipe de vendas + marketing no trimestre: R$ 90.000 | Novos clientes: 30
            </p>
            <p className="mt-2 font-semibold text-primary">CAC: R$ 3.000 por cliente</p>
          </div>
        </div>
      }
    >
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
