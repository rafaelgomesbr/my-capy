"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("estudos", "regra-de-tres")!;
const faqs = [{ question: "O que é regra de três simples?", answer: "A regra de três simples relaciona duas grandezas proporcionais. Se A está para B, assim como C está para X, então X = (B × C) / A." }];

export function RegraDesTres() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calcular = useCallback(() => {
    const A = parseFloat(a.replace(",", "."));
    const B = parseFloat(b.replace(",", "."));
    const C = parseFloat(c.replace(",", "."));
    if (isNaN(A) || isNaN(B) || isNaN(C) || A === 0) return;
    setResult((B * C) / A);
  }, [a, b, c]);

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4 font-mono text-sm">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{a || "A"}</div>
                <div className="text-muted-foreground">———</div>
                <div className="text-lg font-bold text-primary">{c || "C"}</div>
              </div>
              <div className="text-muted-foreground">=</div>
              <div className="text-center">
                <div className="text-lg font-bold">{b || "B"}</div>
                <div className="text-muted-foreground">———</div>
                <div className="text-lg font-bold text-emerald-600">X</div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="a-r3">A</Label>
              <Input id="a-r3" type="number" placeholder="Ex: 5" value={a} onChange={(e) => setA(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="b-r3">B</Label>
              <Input id="b-r3" type="number" placeholder="Ex: 10" value={b} onChange={(e) => setB(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-r3">C</Label>
              <Input id="c-r3" type="number" placeholder="Ex: 3" value={c} onChange={(e) => setC(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular X</Button>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">X =</p>
              <p className="mt-2 text-3xl font-bold text-primary">{result.toLocaleString("pt-BR", { maximumFractionDigits: 6 })}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
