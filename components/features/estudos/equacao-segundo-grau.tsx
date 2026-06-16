"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("estudos", "equacao-segundo-grau")!;
const faqs = [
  { question: "O que é discriminante (delta)?", answer: "O discriminante Δ = b² - 4ac determina o número de raízes reais. Δ > 0: duas raízes reais e distintas. Δ = 0: uma raiz dupla (x₁ = x₂). Δ < 0: sem raízes reais (raízes complexas)." },
  { question: "O que é a Fórmula de Bhaskara?", answer: "Bhaskara é o método para encontrar as raízes de qualquer equação do 2° grau: x = (-b ± √Δ) / (2a), onde Δ = b² - 4ac. O ± indica duas raízes — uma com + e outra com -." },
  { question: "Por que o coeficiente 'a' não pode ser zero?", answer: "Se a = 0, a equação ax² + bx + c = 0 se torna bx + c = 0, que é uma equação de 1° grau, não mais do 2° grau. O coeficiente 'a' define o grau da equação e não pode ser zero." },
  { question: "Como saber se a parábola abre para cima ou para baixo?", answer: "O sinal de 'a' determina: a > 0 → parábola abre para cima (concavidade para cima, valor mínimo). a < 0 → parábola abre para baixo (concavidade para baixo, valor máximo)." },
  { question: "Qual é o vértice da parábola?", answer: "O vértice (ponto de máximo ou mínimo) está em x_v = -b/(2a) e y_v = -Δ/(4a). Em Δ = 0, o vértice toca o eixo x. Em Δ < 0, a parábola não cruza o eixo x." },
];

export function EquacaoSegundoGrau() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [result, setResult] = useState<{ delta: number; x1: number | null; x2: number | null } | null>(null);

  const calcular = useCallback(() => {
    const A = parseFloat(a.replace(",", "."));
    const B = parseFloat(b.replace(",", "."));
    const C = parseFloat(c.replace(",", "."));
    if (isNaN(A) || isNaN(B) || isNaN(C) || A === 0) return;
    const delta = B * B - 4 * A * C;
    if (delta < 0) {
      setResult({ delta, x1: null, x2: null });
    } else if (delta === 0) {
      setResult({ delta, x1: -B / (2 * A), x2: null });
    } else {
      setResult({ delta, x1: (-B + Math.sqrt(delta)) / (2 * A), x2: (-B - Math.sqrt(delta)) / (2 * A) });
    }
  }, [a, b, c]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 6 });

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A equação do 2° grau tem a forma <strong>ax² + bx + c = 0</strong>. O algoritmo de Bhaskara
            resolve qualquer equação dessa forma usando o discriminante <strong>Δ = b² - 4ac</strong> e a
            fórmula <strong>x = (-b ± √Δ) / (2a)</strong>. O sinal ± gera até duas raízes distintas.
          </p>
          <p>
            A ferramenta calcula o delta e, dependendo do seu valor, determina automaticamente se a equação
            tem duas raízes reais distintas (Δ &gt; 0), uma raiz dupla (Δ = 0) ou nenhuma raiz real
            (Δ &lt; 0 — raízes complexas, fora do escopo desta calculadora).
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo 1: x² - 5x + 6 = 0</p>
            <p className="mt-1 text-sm text-muted-foreground">a=1, b=-5, c=6 → Δ = 25 - 24 = 1</p>
            <p className="mt-1 text-sm text-primary font-semibold">x₁ = 3 | x₂ = 2</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo 2: x² - 4x + 4 = 0</p>
            <p className="mt-1 text-sm text-muted-foreground">a=1, b=-4, c=4 → Δ = 16 - 16 = 0</p>
            <p className="mt-1 text-sm text-primary font-semibold">Raiz dupla: x₁ = x₂ = 2</p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4 text-center font-mono">
            <span className="text-primary">{a || "a"}</span>x² + <span className="text-primary">{b || "b"}</span>x + <span className="text-primary">{c || "c"}</span> = 0
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="a-eq">Coeficiente a</Label>
              <Input id="a-eq" type="number" placeholder="Ex: 1" value={a} onChange={(e) => setA(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="b-eq">Coeficiente b</Label>
              <Input id="b-eq" type="number" placeholder="Ex: -5" value={b} onChange={(e) => setB(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-eq">Coeficiente c</Label>
              <Input id="c-eq" type="number" placeholder="Ex: 6" value={c} onChange={(e) => setC(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Resolver Equação (Bhaskara)</Button>
          {result && (
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm">Δ = b² - 4ac = {a}² - 4 × {a} × {c}</p>
                <p className="text-lg font-bold">Δ = {result.delta.toLocaleString("pt-BR")}</p>
              </div>
              {result.delta < 0 ? (
                <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-950/40">
                  <p className="text-red-600 dark:text-red-400">Sem raízes reais (Δ &lt; 0)</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-primary/10 p-4 text-center">
                    <p className="text-xs text-muted-foreground">x₁</p>
                    <p className="mt-1 text-2xl font-bold text-primary">{result.x1 !== null ? fmt(result.x1) : "-"}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground">x₂</p>
                    <p className="mt-1 text-2xl font-bold">{result.x2 !== null ? fmt(result.x2) : "= x₁ (raiz dupla)"}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
