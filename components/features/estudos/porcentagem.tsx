"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("estudos", "porcentagem")!;
const faqs = [
  { question: "Como calcular porcentagem?", answer: "Para calcular X% de Y: multiplique Y por X e divida por 100. Ex: 15% de 200 = (200 × 15) / 100 = 30. Esta ferramenta cobre três tipos de cálculo de porcentagem nas abas." },
  { question: "Como calcular desconto em percentual?", answer: "Preço com desconto = preço original × (1 - desconto/100). Ex: R$ 500 com 20% de desconto = 500 × 0,80 = R$ 400. Na aba Aumento/Desconto, a ferramenta calcula os dois ao mesmo tempo." },
  { question: "Como calcular aumento percentual entre dois valores?", answer: "Variação % = ((valor final - valor inicial) / valor inicial) × 100. Ex: produto que custava R$ 80 e passou a custar R$ 100: ((100-80)/80) × 100 = 25%. Use a aba 'X é % de Y' para calcular esse tipo." },
  { question: "Como calcular quantos por cento X é de Y?", answer: "% = (X / Y) × 100. Ex: 45 é qual percentual de 180? (45/180) × 100 = 25%. Use a aba 'X é % de Y' nesta ferramenta." },
  { question: "Como funciona juros e inflação com porcentagem?", answer: "Para aumentos sucessivos, os percentuais não somam: 10% de aumento seguido de 10% de desconto não retorna ao valor original. 100 × 1,10 = 110; 110 × 0,90 = 99. O correto é multiplicar os fatores: 1,10 × 0,90 = 0,99 = -1%." },
];

export function Porcentagem() {
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [v3, setV3] = useState("");
  const [v4, setV4] = useState("");
  const [v5, setV5] = useState("");

  const r1 = v1 && v2 ? (parseFloat(v2) * parseFloat(v1) / 100).toFixed(2) : null;
  const r2 = v3 && v4 ? ((parseFloat(v3) / parseFloat(v4)) * 100).toFixed(2) : null;
  const r3 = v5 && v1 ? ((parseFloat(v5) * parseFloat(v1) / 100) + parseFloat(v5)).toFixed(2) : null;
  const rDesc = v5 && v1 ? (parseFloat(v5) - parseFloat(v5) * parseFloat(v1) / 100).toFixed(2) : null;

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A calculadora de porcentagem cobre três operações em abas: <strong>X% de Y</strong> (valor
            absoluto de uma porcentagem), <strong>X é % de Y</strong> (descobrir o percentual de
            comparação) e <strong>Aumento/Desconto</strong> (aplicar variação percentual sobre um valor base).
          </p>
          <p>
            Porcentagens aparecem no cotidiano em descontos e promoções, reajustes salariais, impostos,
            comissões de vendas, inflação, rendimento de investimentos e muito mais. Os três tipos de cálculo
            cobertos aqui respondem às perguntas mais comuns envolvendo porcentagem.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Desconto em produto</p>
            <p className="mt-1 text-sm text-muted-foreground">Tênis de R$ 350 com 30% de desconto → R$ 245</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Comissão de vendas</p>
            <p className="mt-1 text-sm text-muted-foreground">Vendas de R$ 15.000 com 5% de comissão → R$ 750 de comissão</p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="porcento">
            <TabsList className="w-full">
              <TabsTrigger value="porcento" className="flex-1">X% de Y</TabsTrigger>
              <TabsTrigger value="qual" className="flex-1">X é % de Y</TabsTrigger>
              <TabsTrigger value="aumento" className="flex-1">Aumento/Desconto</TabsTrigger>
            </TabsList>
            <TabsContent value="porcento" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pct-p1">Porcentagem (%)</Label>
                  <Input id="pct-p1" type="number" placeholder="Ex: 15" value={v1} onChange={(e) => setV1(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="val-p1">Valor base</Label>
                  <Input id="val-p1" type="number" placeholder="Ex: 200" value={v2} onChange={(e) => setV2(e.target.value)} />
                </div>
              </div>
              {r1 && <div className="rounded-lg bg-primary/10 p-4 text-center"><p className="text-sm text-muted-foreground">{v1}% de {v2} =</p><p className="text-3xl font-bold text-primary">{r1}</p></div>}
            </TabsContent>
            <TabsContent value="qual" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="val-q1">Valor parcial (X)</Label>
                  <Input id="val-q1" type="number" placeholder="Ex: 30" value={v3} onChange={(e) => setV3(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="val-q2">Valor total (Y)</Label>
                  <Input id="val-q2" type="number" placeholder="Ex: 200" value={v4} onChange={(e) => setV4(e.target.value)} />
                </div>
              </div>
              {r2 && <div className="rounded-lg bg-primary/10 p-4 text-center"><p className="text-sm text-muted-foreground">{v3} é</p><p className="text-3xl font-bold text-primary">{r2}%</p><p className="text-sm text-muted-foreground">de {v4}</p></div>}
            </TabsContent>
            <TabsContent value="aumento" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="val-a1">Valor original</Label>
                  <Input id="val-a1" type="number" placeholder="Ex: 500" value={v5} onChange={(e) => setV5(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pct-a1">Percentual (%)</Label>
                  <Input id="pct-a1" type="number" placeholder="Ex: 20" value={v1} onChange={(e) => setV1(e.target.value)} />
                </div>
              </div>
              {r3 && rDesc && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                    <p className="text-xs text-muted-foreground">Com aumento de {v1}%</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{r3}</p>
                  </div>
                  <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-950/40">
                    <p className="text-xs text-muted-foreground">Com desconto de {v1}%</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{rDesc}</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
