"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("financas", "ferias")!;
const faqs = [
  { question: "O que é o 1/3 constitucional de férias?", answer: "É um adicional de 1/3 sobre o valor das férias, garantido pelo Art. 7º, XVII da Constituição Federal. Quem recebe R$ 3.000 de salário ganha R$ 3.000 de férias + R$ 1.000 de adicional constitucional = R$ 4.000 total." },
  { question: "Posso vender (abonar) parte das férias?", answer: "Sim. O trabalhador pode vender até 10 dos 30 dias de férias (abono pecuniário). Nesse caso tira apenas 20 dias e recebe o equivalente a 10 dias em dinheiro, sem o adicional de 1/3 sobre os dias vendidos." },
  { question: "Quando devo tirar férias?", answer: "As férias devem ser usufruídas dentro dos 12 meses após completar o período aquisitivo (12 meses trabalhados). O empregador deve avisar com 30 dias de antecedência." },
  { question: "O que acontece se eu não tirar férias no prazo?", answer: "Se o empregador deixar passar o prazo, é obrigado a pagar as férias em dobro (férias vencidas). É um direito do trabalhador que prescreve em 2 anos após o término do contrato." },
  { question: "As férias têm desconto de INSS e IR?", answer: "Sim. O valor total das férias (férias + 1/3 constitucional) sofre desconto de INSS e IRRF, da mesma forma que o salário mensal. Esta calculadora mostra o valor bruto." },
];

export function Ferias() {
  const [salario, setSalario] = useState("");
  const [dias, setDias] = useState("30");
  const [result, setResult] = useState<{ ferias: number; umTerco: number; total: number } | null>(null);

  const calcular = useCallback(() => {
    const S = parseFloat(salario.replace(",", "."));
    const D = parseInt(dias);
    if (isNaN(S) || S <= 0) return;
    const valorDiario = S / 30;
    const ferias = valorDiario * D;
    const umTerco = ferias / 3;
    setResult({ ferias, umTerco, total: ferias + umTerco });
  }, [salario, dias]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            As férias são calculadas proporcionalmente ao número de dias de gozo. Para 30 dias:{" "}
            <strong>Férias = Salário</strong>. Para 20 ou 10 dias, calcula-se o valor diário (salário ÷ 30)
            e multiplica-se pelos dias. Sobre esse valor incide o{" "}
            <strong>adicional de 1/3 constitucional</strong>, obrigatório por lei (Art. 7º, XVII da CF/88).
          </p>
          <p>
            O trabalhador também pode fracionar as férias em até 3 períodos, sendo que um deles não pode ser
            inferior a 14 dias corridos. Em qualquer caso, o adicional de 1/3 é sempre devido. O total de férias
            deve ser pago 2 dias úteis antes do início do período de gozo.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: 30 dias de férias, salário R$ 3.000</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Férias: R$ 3.000 | 1/3: R$ 1.000 | Total bruto: R$ 4.000
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: 20 dias + venda de 10 dias, salário R$ 4.000</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Férias (20 dias): R$ 2.667 | 1/3: R$ 889 | Abono (10 dias): R$ 1.333 | Total: ≈ R$ 4.889
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sal-fer">Salário bruto (R$)</Label>
              <Input id="sal-fer" type="number" placeholder="Ex: 3000" value={salario} onChange={(e) => setSalario(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dias-fer">Dias de férias</Label>
              <select id="dias-fer" value={dias} onChange={(e) => setDias(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="30">30 dias</option>
                <option value="20">20 dias</option>
                <option value="10">10 dias</option>
              </select>
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular Férias</Button>
          {result && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Férias ({dias} dias)</p>
                <p className="mt-1 text-xl font-bold">{fmt(result.ferias)}</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4 text-center dark:bg-amber-950/40">
                <p className="text-xs text-muted-foreground">1/3 constitucional</p>
                <p className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">{fmt(result.umTerco)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Total a receber</p>
                <p className="mt-1 text-xl font-bold text-primary">{fmt(result.total)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
