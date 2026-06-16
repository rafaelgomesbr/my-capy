"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "decimo-terceiro")!;
const faqs = [
  { question: "Como é calculado o 13º salário?", answer: "O 13º é proporcional aos meses trabalhados no ano. Quem trabalha o ano inteiro recebe um salário completo dividido em duas parcelas. Para frações, conta-se o mês se trabalhou 15 dias ou mais." },
  { question: "Quando é pago o 13º salário?", answer: "A primeira parcela deve ser paga até 30 de novembro. A segunda parcela (com descontos de INSS e IRRF) deve ser paga até 20 de dezembro. O empregador pode antecipar o pagamento." },
  { question: "A 1ª parcela do 13º tem desconto de IR?", answer: "Não. A primeira parcela (paga até novembro) equivale a metade do salário bruto, sem desconto de IR. Apenas a segunda parcela sofre desconto de INSS e IRRF calculados sobre o total." },
  { question: "Quem tem direito ao 13º?", answer: "Todo trabalhador CLT, empregado doméstico e aposentado pelo INSS. Estagiários e trabalhadores autônomos (PJ) geralmente não têm direito ao 13º, salvo previsão contratual." },
  { question: "O 13º conta para o cálculo de férias?", answer: "O 13º não é considerado na base de cálculo das férias. As férias são calculadas sobre o salário mensal normal acrescido de 1/3 constitucional." },
];

export function DecimoTerceiro() {
  const [salario, setSalario] = useState("");
  const [meses, setMeses] = useState("12");
  const [result, setResult] = useState<{ bruto: number; primeiraParcela: number; segundaParcela: number } | null>(null);

  const calcular = useCallback(() => {
    const S = parseFloat(salario.replace(",", "."));
    const M = parseInt(meses);
    if (isNaN(S) || S <= 0 || isNaN(M) || M <= 0) return;
    const bruto = S * (M / 12);
    const primeiraParcela = bruto / 2;
    const inss = bruto * 0.14;
    const segundaParcela = bruto / 2 - Math.max(0, inss - bruto / 2);
    setResult({ bruto, primeiraParcela, segundaParcela });
  }, [salario, meses]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O décimo terceiro salário é um direito garantido pela Constituição Federal (Art. 7º, VIII) a todo
            trabalhador com vínculo empregatício CLT. O valor bruto proporcional é calculado como:{" "}
            <strong>13º bruto = Salário × (meses trabalhados / 12)</strong>. Considera-se um mês completo
            quando o trabalhador permaneceu mais de 15 dias no mês.
          </p>
          <p>
            A <strong>primeira parcela</strong> (paga até 30/11) corresponde a metade do valor bruto, sem
            descontos de IR. A <strong>segunda parcela</strong> (paga até 20/12) sofre desconto de INSS sobre
            o valor total do 13º e de IRRF sobre a base líquida. Os valores desta calculadora são estimativas —
            o cálculo exato depende de outros benefícios e deduções do contracheque.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Ano completo, salário R$ 4.000</p>
            <p className="mt-1 text-sm text-muted-foreground">
              12 meses trabalhados | 1ª parcela: R$ 2.000 | 2ª parcela (aprox.): ≈ R$ 1.721
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: 8 meses trabalhados, salário R$ 3.000</p>
            <p className="mt-1 text-sm text-muted-foreground">
              13º bruto: R$ 2.000 | 1ª parcela: R$ 1.000 | 2ª parcela (aprox.): ≈ R$ 854
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sal-13">Salário bruto (R$)</Label>
              <Input id="sal-13" type="number" placeholder="Ex: 4000" value={salario} onChange={(e) => setSalario(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meses-13">Meses trabalhados</Label>
              <select id="meses-13" value={meses} onChange={(e) => setMeses(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m} {m === 1 ? "mês" : "meses"}</option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular 13º Salário</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Valor bruto</p>
                <p className="mt-1 text-xl font-bold">{fmt(result.bruto)}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                <p className="text-xs text-muted-foreground">1ª Parcela (nov)</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.primeiraParcela)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">2ª Parcela (dez, aprox.)</p>
                <p className="mt-1 text-xl font-bold text-primary">{fmt(result.segundaParcela)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
