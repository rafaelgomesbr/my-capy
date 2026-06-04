"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("estudos", "fatorar-numero")!;

const faqs = [
  {
    question: "O que é fatoração em números primos?",
    answer:
      "Fatoração prima é a decomposição de um número inteiro em um produto de números primos. Por exemplo, 12 = 2 × 2 × 3. Todo número inteiro maior que 1 possui uma fatoração prima única (Teorema Fundamental da Aritmética).",
  },
  {
    question: "Para que serve fatorar um número?",
    answer:
      "A fatoração é usada para calcular MMC (mínimo múltiplo comum) e MDC (máximo divisor comum), simplificar frações, resolver problemas de divisibilidade, e em criptografia (chaves RSA usam a dificuldade de fatorar números grandes).",
  },
  {
    question: "O que é número primo?",
    answer:
      "Número primo é aquele que possui exatamente dois divisores: 1 e ele mesmo. Exemplos: 2, 3, 5, 7, 11, 13... O número 2 é o único primo par.",
  },
];

function fatorar(n: number): number[] {
  const fatores: number[] = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      fatores.push(d);
      n /= d;
    }
    d++;
  }
  if (n > 1) fatores.push(n);
  return fatores;
}

function toPoderNotation(fatores: number[]): string {
  const freq: Record<number, number> = {};
  for (const f of fatores) freq[f] = (freq[f] || 0) + 1;
  return Object.entries(freq)
    .map(([base, exp]) => (exp > 1 ? `${base}^${exp}` : base))
    .join(" × ");
}

function superscript(exp: number): string {
  const map: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  return String(exp).split("").map((c) => map[c] || c).join("");
}

function toPotencias(fatores: number[]): string {
  const freq: Record<number, number> = {};
  for (const f of fatores) freq[f] = (freq[f] || 0) + 1;
  return Object.entries(freq)
    .map(([base, exp]) => (exp > 1 ? `${base}${superscript(exp)}` : base))
    .join(" × ");
}

export function FatorarNumero() {
  const [input, setInput] = useState("");

  const n = parseInt(input, 10);
  const valido = Number.isFinite(n) && n >= 2 && n <= 10_000_000;
  const fatores = valido ? fatorar(n) : [];
  const primo = fatores.length === 1;

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fator-input">Número inteiro (2 a 10.000.000)</Label>
            <Input
              id="fator-input"
              type="number"
              min={2}
              max={10000000}
              placeholder="Ex: 84"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {input && !valido && (
            <p className="text-sm text-destructive">Digite um número entre 2 e 10.000.000.</p>
          )}

          {valido && fatores.length > 0 && (
            <div className="space-y-3">
              {primo ? (
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Resultado</p>
                  <p className="mt-1 text-2xl font-bold text-primary">{n} é primo!</p>
                </div>
              ) : (
                <>
                  <div className="rounded-lg bg-primary/10 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Decomposição em fatores</p>
                    <p className="text-xl font-bold font-mono text-primary">
                      {fatores.join(" × ")} = {n}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Notação em potências</p>
                    <p className="text-xl font-bold font-mono">{toPotencias(fatores)}</p>
                  </div>
                  <div className="rounded-lg border px-4 py-3 text-sm text-muted-foreground">
                    Fatores primos únicos: {[...new Set(fatores)].join(", ")}
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
