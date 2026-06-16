"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}
function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}
function gcdMultiple(nums: number[]): number {
  return nums.reduce((acc, n) => gcd(acc, n));
}
function lcmMultiple(nums: number[]): number {
  return nums.reduce((acc, n) => lcm(acc, n));
}

const faqsMmc = [
  { question: "Para que serve o MMC?", answer: "O MMC (Mínimo Múltiplo Comum) é usado para encontrar o menor denominador comum ao somar frações com denominadores diferentes, e em problemas de periodicidade — quando dois eventos periódicos coincidem." },
  { question: "Como calcular o MMC na mão?", answer: "Método da fatoração: fatore cada número em primos, escolha cada fator primo com o maior expoente que aparece, e multiplique. Exemplo: MMC(12,18) = 2² × 3² = 36." },
  { question: "Qual é o MMC de dois números primos entre si?", answer: "Se dois números não têm fatores comuns (são coprimos), o MMC deles é o produto dos dois. MMC(7, 13) = 7 × 13 = 91." },
  { question: "Posso calcular MMC de mais de dois números?", answer: "Sim. O MMC de vários números é calculado progressivamente: MMC(a, b, c) = MMC(MMC(a, b), c). Esta ferramenta aceita qualquer quantidade de números separados por vírgula ou espaço." },
  { question: "Qual a relação entre MMC e MDC?", answer: "Para dois números a e b: MMC(a, b) × MDC(a, b) = a × b. Conhecendo um, você pode calcular o outro dividindo o produto dos números pelo valor conhecido." },
];

const faqsMdc = [
  { question: "Para que serve o MDC?", answer: "O MDC (Máximo Divisor Comum) é usado para simplificar frações ao máximo, em problemas de divisão igualitária (dividir itens em grupos iguais sem sobras), e para encontrar a maior unidade de medida comum." },
  { question: "Como calcular o MDC pelo algoritmo de Euclides?", answer: "Divida o maior pelo menor, substitua o maior pelo menor e o menor pelo resto, repita até o resto ser zero. O último divisor não nulo é o MDC. Ex: MDC(48, 18): 48 = 2×18+12; 18 = 1×12+6; 12 = 2×6+0 → MDC = 6." },
  { question: "Qual o MDC de dois números consecutivos?", answer: "O MDC de qualquer dois números consecutivos é sempre 1. Eles são coprimos (sem fatores comuns além de 1). Ex: MDC(8, 9) = 1." },
  { question: "Como simplificar uma fração usando o MDC?", answer: "Calcule o MDC do numerador e denominador, depois divida ambos pelo MDC. Ex: 18/24 → MDC(18,24) = 6 → 18÷6 / 24÷6 = 3/4 (fração irredutível)." },
  { question: "Posso calcular MDC de mais de dois números?", answer: "Sim. MDC(a, b, c) = MDC(MDC(a, b), c). Esta ferramenta aceita múltiplos números separados por vírgula ou espaço." },
];

function MmcMdcTool({ slug, isMmc }: { slug: "mmc" | "mdc"; isMmc: boolean }) {
  const tool = getToolBySlug("estudos", slug)!;
  const [input, setInput] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calcular = useCallback(() => {
    const nums = input.split(/[,;\s]+/).map(Number).filter((n) => n > 0 && !isNaN(n));
    if (nums.length < 2) return;
    setResult(isMmc ? lcmMultiple(nums) : gcdMultiple(nums));
  }, [input, isMmc]);

  const faqs = isMmc ? faqsMmc : faqsMdc;

  const explanation = isMmc ? (
    <div className="space-y-3">
      <p>
        O Mínimo Múltiplo Comum (MMC) é o menor número positivo que é múltiplo de todos os números
        fornecidos simultaneamente. O cálculo usa o algoritmo de Euclides para o MDC e depois aplica
        a relação <strong>MMC(a,b) = |a×b| / MDC(a,b)</strong> para pares, estendida progressivamente
        para múltiplos números.
      </p>
      <p>
        O MMC é fundamental ao somar frações com denominadores diferentes — o denominador comum mínimo
        é o MMC dos denominadores. Também aparece em problemas de periodicidade: quando dois ônibus têm
        frequências diferentes, o MMC dos intervalos diz quando os dois passam juntos.
      </p>
    </div>
  ) : (
    <div className="space-y-3">
      <p>
        O Máximo Divisor Comum (MDC) é o maior número inteiro que divide todos os números fornecidos
        sem deixar resto. O cálculo usa o algoritmo de Euclides, que é extremamente eficiente mesmo
        para números grandes.
      </p>
      <p>
        O MDC é usado para simplificar frações ao máximo (dividir numerador e denominador pelo MDC),
        em problemas de divisão igualitária sem sobras, e para encontrar a maior régua que mede
        exatamente dois ou mais comprimentos.
      </p>
    </div>
  );

  const examples = isMmc ? (
    <div className="space-y-3">
      <div className="rounded-lg border p-4">
        <p className="font-medium">Quando dois ônibus partem juntos?</p>
        <p className="mt-1 text-sm text-muted-foreground">Linha A: a cada 12 min | Linha B: a cada 18 min</p>
        <p className="mt-2 text-sm text-primary font-semibold">MMC(12, 18) = 36 min → coincidem a cada 36 minutos</p>
      </div>
      <div className="rounded-lg border p-4">
        <p className="font-medium">Soma de frações 1/4 + 1/6</p>
        <p className="mt-1 text-sm text-muted-foreground">MMC(4, 6) = 12 → 3/12 + 2/12 = 5/12</p>
      </div>
    </div>
  ) : (
    <div className="space-y-3">
      <div className="rounded-lg border p-4">
        <p className="font-medium">Simplificar 18/24</p>
        <p className="mt-1 text-sm text-muted-foreground">MDC(18, 24) = 6 → 18÷6 / 24÷6 = 3/4</p>
      </div>
      <div className="rounded-lg border p-4">
        <p className="font-medium">Dividir 48 chocolates e 36 balas igualmente</p>
        <p className="mt-1 text-sm text-muted-foreground">MDC(48, 36) = 12 → 12 pessoas recebem 4 chocolates e 3 balas cada</p>
      </div>
    </div>
  );

  return (
    <ToolLayout tool={tool} faqs={faqs} explanation={explanation} examples={examples}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`nums-${slug}`}>Números (separados por vírgula ou espaço)</Label>
            <Input id={`nums-${slug}`} type="text" placeholder="Ex: 12, 18, 24" value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <Button onClick={calcular} className="w-full">Calcular {isMmc ? "MMC" : "MDC"}</Button>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">{isMmc ? "Mínimo Múltiplo Comum" : "Máximo Divisor Comum"}</p>
              <p className="mt-2 text-3xl font-bold text-primary">{result}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function Mmc() {
  return <MmcMdcTool slug="mmc" isMmc={true} />;
}
export function Mdc() {
  return <MmcMdcTool slug="mdc" isMmc={false} />;
}
