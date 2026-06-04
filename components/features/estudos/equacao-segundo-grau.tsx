"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("estudos", "equacao-segundo-grau")!;
const faqs = [{ question: "O que é discriminante (delta)?", answer: "O discriminante Δ = b² - 4ac determina o número de raízes reais. Se Δ > 0: duas raízes distintas. Se Δ = 0: uma raiz dupla. Se Δ < 0: sem raízes reais." }];

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
    <ToolLayout tool={tool} faqs={faqs}>
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
