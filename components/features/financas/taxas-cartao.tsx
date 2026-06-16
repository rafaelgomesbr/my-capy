"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "taxas-cartao")!;
const faqs = [
  { question: "Qual a diferença entre MDR e taxa de antecipação?", answer: "MDR (Merchant Discount Rate) é a taxa descontada automaticamente por cada transação de cartão. A taxa de antecipação é um custo adicional cobrado quando o vendedor quer receber o dinheiro antes do prazo normal (que é de 30 dias para crédito)." },
  { question: "Quando recebo o dinheiro das vendas no cartão?", answer: "Débito: 1 a 2 dias úteis. Crédito à vista: 30 dias. Crédito parcelado: as parcelas chegam mensalmente, 30 dias após cada parcela vencer. Para receber antes, usa-se a antecipação de recebíveis (com custo adicional)." },
  { question: "O que é taxa de antecipação de recebíveis?", answer: "É o custo para receber vendas a prazo de forma imediata. Por exemplo, se você vendeu R$ 1.000 a prazo e quer receber agora, a adquirente desconta uma porcentagem (geralmente 2-5% a.m.) sobre o valor antecipado." },
  { question: "Existe diferença de taxa entre bandeiras (Visa, Master, Elo)?", answer: "Sim. Diferentes bandeiras têm acordos comerciais distintos com as adquirentes. Na prática, as diferenças costumam ser pequenas (0,1-0,5%), mas podem impactar em volume alto de vendas." },
  { question: "Como negociar taxas de cartão?", answer: "Vendedores com alto volume de vendas têm mais poder de negociação. Solicite propostas de múltiplas adquirentes (Cielo, Stone, PagSeguro, etc.) e apresente as concorrentes para conseguir melhor taxa. Maquininhas 'sem aluguel' geralmente compensam a isenção com taxas ligeiramente maiores." },
];

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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            Toda venda com cartão de crédito ou débito tem um custo para o vendedor: a taxa MDR (Merchant
            Discount Rate), cobrada como percentual sobre o valor da transação. Essa taxa varia conforme a
            modalidade (débito é mais barata que crédito parcelado) e a operadora contratada.
          </p>
          <p>
            <strong>Atenção:</strong> as taxas exibidas são estimativas típicas do mercado e podem variar
            conforme o volume de vendas, ramo de atividade e negociação com a adquirente. Sempre verifique
            as condições vigentes no seu contrato ou consulte sua adquirente para obter as taxas exatas.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Venda de R$ 500 no débito (Cielo 1,5%)</p>
            <p className="mt-1 text-sm text-muted-foreground">Taxa: R$ 7,50 | Líquido recebido: R$ 492,50</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Venda de R$ 1.000 no crédito 6x (Stone 3,3%)</p>
            <p className="mt-1 text-sm text-muted-foreground">Taxa: R$ 33,00 | Líquido recebido: R$ 967,00</p>
          </div>
        </div>
      }
    >
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
