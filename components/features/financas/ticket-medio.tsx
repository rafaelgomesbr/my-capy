"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "ticket-medio")!;
const faqs = [
  { question: "O que é ticket médio?", answer: "Ticket médio é o valor médio de cada venda ou pedido no período analisado. É calculado dividindo a receita total pelo número de vendas: Ticket médio = Receita total ÷ Número de vendas." },
  { question: "Como aumentar o ticket médio?", answer: "As principais estratégias são: upsell (oferecer versão superior do produto), cross-sell (produtos complementares), bundling (pacotes com desconto), frete grátis acima de um valor mínimo, programas de fidelidade e recomendações personalizadas." },
  { question: "Por que o ticket médio é importante?", answer: "Aumentar o ticket médio é uma das formas mais eficientes de crescer sem aumentar o número de clientes ou o investimento em marketing. Uma melhoria de 20% no ticket médio com a mesma base de clientes significa 20% mais receita." },
  { question: "Devo calcular o ticket médio por período ou por segmento?", answer: "O ideal é calcular nos dois níveis. O ticket médio geral dá uma visão do negócio como um todo; por segmento (canal de venda, região, produto) identifica oportunidades específicas de melhoria." },
  { question: "Qual a diferença entre ticket médio e valor médio do pedido (AOV)?", answer: "São essencialmente o mesmo conceito. Ticket médio é o termo mais usado no varejo brasileiro; AOV (Average Order Value) é o equivalente em inglês, comum em e-commerces internacionais e análises de ferramentas como Google Analytics." },
];

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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O ticket médio é uma das métricas fundamentais do varejo e do e-commerce. Ele indica quanto cada
            cliente gasta em média por compra, permitindo que o gestor avalie a eficiência das estratégias de
            vendas e o potencial de crescimento sem aumentar o volume de clientes.
          </p>
          <p>
            Para obter um resultado preciso, use dados do mesmo período para receita e número de vendas.
            Ao longo do tempo, monitore a evolução do ticket médio em conjunto com o volume de vendas — às vezes
            uma queda no ticket pode ser compensada por um aumento no número de pedidos, mantendo a receita
            total estável.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: E-commerce de moda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Receita do mês: R$ 85.000 | Pedidos realizados: 340
            </p>
            <p className="mt-2 font-semibold text-primary">Ticket médio: R$ 250</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Restaurante delivery</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Faturamento semanal: R$ 12.600 | Pedidos: 180
            </p>
            <p className="mt-2 font-semibold text-primary">Ticket médio: R$ 70</p>
          </div>
        </div>
      }
    >
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
