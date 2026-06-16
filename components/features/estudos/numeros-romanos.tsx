"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("estudos", "numeros-romanos")!;

const faqs = [
  {
    question: "Qual o intervalo válido para números romanos?",
    answer:
      "O sistema de numeração romano padrão cobre de 1 (I) a 3999 (MMMCMXCIX). O número 0 não existe no sistema romano. Números acima de 3999 requerem notações especiais não cobertas pelo sistema clássico.",
  },
  {
    question: "Quais são as regras básicas dos números romanos?",
    answer:
      "Os símbolos principais são I(1), V(5), X(10), L(50), C(100), D(500), M(1000). A subtração ocorre quando um símbolo menor precede um maior: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.",
  },
  {
    question: "Para que são usados os números romanos atualmente?",
    answer:
      "Números romanos ainda são usados em relógios analógicos, capítulos de livros, séculos (século XXI), eventos como olimpíadas e Super Bowl, e em créditos de filmes para indicar o ano de produção.",
  },
];

const romanNumerals: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(num: number): string {
  if (num < 1 || num > 3999 || !Number.isInteger(num)) return "";
  let result = "";
  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

function fromRoman(str: string): number {
  const upper = str.toUpperCase().trim();
  if (!upper) return NaN;
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < upper.length; i++) {
    const curr = map[upper[i]];
    const next = map[upper[i + 1]];
    if (curr === undefined) return NaN;
    if (next && curr < next) {
      result -= curr;
    } else {
      result += curr;
    }
  }
  return result >= 1 && result <= 3999 ? result : NaN;
}

export function NumerosRomanos() {
  const [arabico, setArabico] = useState("");
  const [romano, setRomano] = useState("");

  const handleArabicoChange = (val: string) => {
    setArabico(val);
    const n = parseInt(val, 10);
    setRomano(Number.isFinite(n) ? toRoman(n) : "");
  };

  const handleRomanoChange = (val: string) => {
    setRomano(val);
    const n = fromRoman(val);
    setArabico(Number.isNaN(n) ? "" : String(n));
  };

  const romano_valido = arabico !== "" && toRoman(parseInt(arabico, 10)) !== "";
  const arabico_valido = romano !== "" && !Number.isNaN(fromRoman(romano));

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A ferramenta converte números arábicos para romanos e vice-versa em tempo real (bidirecional).
            O algoritmo de conversão para romano usa a tabela de valores subtrativa (I, IV, V, IX, X, XL,
            L, XC, C, CD, D, CM, M) para gerar a representação mais curta e correta. O intervalo suportado
            é de 1 a 3999.
          </p>
          <p>
            A conversão de romano para arábico percorre cada símbolo e verifica se o próximo símbolo
            tem valor maior (subtração) ou menor/igual (adição), seguindo as regras do sistema subtrativo.
            Use os botões de referência rápida para ver os valores dos símbolos principais.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Anos em números romanos</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• 2024 = MMXXIV</li>
              <li>• 1999 = MCMXCIX</li>
              <li>• 2000 = MM</li>
              <li>• 1776 = MDCCLXXVI (independência dos EUA)</li>
              <li>• 476 = CDLXXVI (queda do Império Romano)</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="arabico-input">Número arábico (1–3999)</Label>
              <Input
                id="arabico-input"
                type="number"
                min={1}
                max={3999}
                placeholder="Ex: 2024"
                value={arabico}
                onChange={(e) => handleArabicoChange(e.target.value)}
              />
              {arabico && !romano_valido && (
                <p className="text-xs text-destructive">Número inválido (1–3999)</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="romano-input">Número romano</Label>
              <Input
                id="romano-input"
                placeholder="Ex: MMXXIV"
                value={romano}
                onChange={(e) => handleRomanoChange(e.target.value)}
                className="uppercase"
              />
              {romano && !arabico_valido && (
                <p className="text-xs text-destructive">Romano inválido ou fora do intervalo</p>
              )}
            </div>
          </div>

          {arabico && romano && romano_valido && arabico_valido && (
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">Conversão</p>
              <p className="mt-1 text-2xl font-bold text-primary">
                {arabico} = {romano.toUpperCase()}
              </p>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2 text-center">
            {[1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900].map((n) => (
              <button
                key={n}
                onClick={() => handleArabicoChange(String(n))}
                className="rounded border px-2 py-1.5 text-xs hover:bg-muted transition-colors"
              >
                {n} = {toRoman(n)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
