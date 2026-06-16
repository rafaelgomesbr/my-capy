"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

function gcd(a: number, b: number): number { return b === 0 ? Math.abs(a) : gcd(b, a % b); }
function simplify(n: number, d: number) { const g = gcd(Math.abs(n), Math.abs(d)); return [n / g, d / g]; }

const faqsFracoes = [
  { question: "Como somar frações com denominadores diferentes?", answer: "Encontre o MMC dos denominadores, converta cada fração para ter o novo denominador e some os numeradores. Ex: 1/4 + 1/6 → MMC(4,6)=12 → 3/12 + 2/12 = 5/12." },
  { question: "Como multiplicar frações?", answer: "Multiplique numerador com numerador e denominador com denominador, depois simplifique. Ex: 2/3 × 3/4 = 6/12 = 1/2." },
  { question: "Como dividir frações?", answer: "Inverta a segunda fração (numerador↔denominador) e multiplique. Ex: 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6." },
  { question: "O que significa simplificar uma fração?", answer: "Simplificar é dividir o numerador e o denominador pelo MDC deles até que não haja mais divisores comuns. Ex: 18/24 → MDC=6 → 3/4 (irredutível — não pode ser mais simplificada)." },
  { question: "O que é fração imprópria?", answer: "Uma fração imprópria tem o numerador maior que o denominador (ex: 7/4). Ela pode ser convertida em número misto: 7/4 = 1 e 3/4. Esta calculadora trabalha com frações impróprias e retorna o resultado simplificado." },
];

const faqsConversor = [
  { question: "Como converter decimal para fração?", answer: "Conte as casas decimais e coloque o número sobre a potência de 10 correspondente. Ex: 0,75 → 75/100. Simplifique pelo MDC(75,100)=25 → 3/4." },
  { question: "Como converter fração para decimal?", answer: "Divida o numerador pelo denominador. Ex: 3/4 = 3 ÷ 4 = 0,75. Frações com denominador potência de 2 ou 5 resultam em decimais exatos. As demais geram dízimas periódicas." },
  { question: "O que é dízima periódica?", answer: "É um decimal com repetição infinita de algarismos. Ex: 1/3 = 0,333... (períoio 3). Estas frações não podem ser representadas exatamente em ponto flutuante binário — a ferramenta exibe a aproximação do computador." },
  { question: "Como converter porcentagem para fração?", answer: "Divida a porcentagem por 100 e simplifique. Ex: 35% = 35/100 = 7/20. Para usar nesta ferramenta, coloque 35 no numerador e 100 no denominador." },
  { question: "Como representar um número misto como fração imprópria?", answer: "Multiplique a parte inteira pelo denominador e some ao numerador. Ex: 2 e 3/4 = (2×4+3)/4 = 11/4." },
];

export function Fracoes() {
  const tool = getToolBySlug("estudos", "fracoes")!;
  const [n1, setN1] = useState(""); const [d1, setD1] = useState("");
  const [n2, setN2] = useState(""); const [d2, setD2] = useState("");
  const [op, setOp] = useState("+");
  const [result, setResult] = useState<[number, number] | null>(null);

  const calcular = useCallback(() => {
    const a = parseInt(n1), b = parseInt(d1), c = parseInt(n2), d = parseInt(d2);
    if ([a, b, c, d].some(isNaN) || b === 0 || d === 0) return;
    let rn: number, rd: number;
    switch (op) {
      case "+": rn = a * d + c * b; rd = b * d; break;
      case "-": rn = a * d - c * b; rd = b * d; break;
      case "×": rn = a * c; rd = b * d; break;
      case "÷": rn = a * d; rd = b * c; break;
      default: return;
    }
    setResult(simplify(rn, rd) as [number, number]);
  }, [n1, d1, n2, d2, op]);

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsFracoes}
      explanation={
        <div className="space-y-3">
          <p>
            A calculadora de frações realiza as quatro operações básicas (+, -, ×, ÷) e simplifica
            automaticamente o resultado pelo MDC (Máximo Divisor Comum) dos termos. A fração resultante
            é sempre exibida na forma irredutível (mais simplificada possível).
          </p>
          <p>
            Para somar e subtrair, a ferramenta calcula o denominador comum correto multiplicando os
            denominadores. Para multiplicar, multiplica numeradores e denominadores diretamente. Para
            dividir, inverte a segunda fração e multiplica.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Soma: 1/3 + 1/4</p>
            <p className="mt-1 text-sm text-muted-foreground">MMC(3,4) = 12 → 4/12 + 3/12 = 7/12</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Divisão: 5/6 ÷ 2/3</p>
            <p className="mt-1 text-sm text-muted-foreground">5/6 × 3/2 = 15/12 = 5/4 (simplificado)</p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 justify-center">
            <div className="text-center">
              <Input className="w-16 text-center" placeholder="0" value={n1} onChange={(e) => setN1(e.target.value)} />
              <div className="my-1 h-0.5 w-full bg-foreground" />
              <Input className="w-16 text-center" placeholder="1" value={d1} onChange={(e) => setD1(e.target.value)} />
            </div>
            <select value={op} onChange={(e) => setOp(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-2 text-lg focus:outline-none focus:ring-2 focus:ring-ring">
              {["+", "-", "×", "÷"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <div className="text-center">
              <Input className="w-16 text-center" placeholder="0" value={n2} onChange={(e) => setN2(e.target.value)} />
              <div className="my-1 h-0.5 w-full bg-foreground" />
              <Input className="w-16 text-center" placeholder="1" value={d2} onChange={(e) => setD2(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular</Button>
          {result && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-xs text-muted-foreground mb-2">Resultado (simplificado)</p>
              <div className="inline-block text-center">
                <p className="text-2xl font-bold text-primary">{result[0]}</p>
                <div className="my-1 h-0.5 w-full bg-primary" />
                <p className="text-2xl font-bold text-primary">{result[1]}</p>
              </div>
              {result[1] !== 0 && <p className="mt-2 text-sm text-muted-foreground">= {(result[0] / result[1]).toFixed(6)}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function ConversorFracoes() {
  const tool = getToolBySlug("estudos", "conversor-fracoes")!;
  const [n, setN] = useState(""); const [d, setD] = useState("");
  const [decimal, setDecimal] = useState("");

  const decToFrac = () => {
    const dec = parseFloat(decimal.replace(",", "."));
    if (isNaN(dec)) return;
    const decimals = (decimal.split(".")[1] || "").length;
    const denom = Math.pow(10, decimals);
    const num = Math.round(dec * denom);
    const [sn, sd] = simplify(num, denom);
    setN(String(sn)); setD(String(sd));
  };

  const fracToDec = () => {
    const num = parseInt(n), den = parseInt(d);
    if (!isNaN(num) && !isNaN(den) && den !== 0) setDecimal((num / den).toString());
  };

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsConversor}
      explanation={
        <div className="space-y-3">
          <p>
            O conversor permite transformar frações em decimais (divisão simples) e decimais em frações
            (multiplicação pelo fator de 10 adequado ao número de casas decimais, seguido de simplificação).
            A conversão é bidirecional — você pode converter em qualquer direção.
          </p>
          <p>
            Frações com denominador que é múltiplo apenas de 2 e 5 produzem decimais exatos (ex: 3/4 = 0,75).
            Frações com outros denominadores produzem dízimas periódicas (ex: 1/3 = 0,333...), que são
            truncadas pela precisão do ponto flutuante.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Conversões comuns</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• 1/4 = 0,25 | 3/4 = 0,75</li>
              <li>• 1/3 = 0,333... | 2/3 = 0,666...</li>
              <li>• 1/8 = 0,125 | 5/8 = 0,625</li>
              <li>• 0,5 = 1/2 | 0,6 = 3/5</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <Label>Fração</Label>
              <div className="flex items-center gap-2">
                <Input placeholder="Numerador" value={n} onChange={(e) => setN(e.target.value)} className="w-24" />
                <span>/</span>
                <Input placeholder="Denominador" value={d} onChange={(e) => setD(e.target.value)} className="w-24" />
              </div>
              <Button variant="outline" onClick={fracToDec} className="w-full text-sm">Fração → Decimal</Button>
            </div>
            <div className="space-y-3">
              <Label htmlFor="dec-cf">Decimal</Label>
              <Input id="dec-cf" type="text" placeholder="Ex: 0.75" value={decimal} onChange={(e) => setDecimal(e.target.value)} />
              <Button variant="outline" onClick={decToFrac} className="w-full text-sm">Decimal → Fração</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
