"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("estudos", "regra-de-tres")!;
const faqs = [
  { question: "O que é regra de três simples?", answer: "A regra de três simples relaciona duas grandezas diretamente proporcionais: se A está para B, assim como C está para X, então X = (B × C) / A. É um dos métodos matemáticos mais usados no cotidiano." },
  { question: "Quando uso regra de três simples vs. composta?", answer: "Use simples quando há apenas duas grandezas relacionadas. Use composta quando três ou mais grandezas estão envolvidas (ex: calcular quanto ganha uma equipe de N pessoas em D dias ao custo de R$ por hora)." },
  { question: "O que é proporcionalidade direta?", answer: "Duas grandezas são diretamente proporcionais quando, ao dobrar uma, a outra também dobra. Exemplo: velocidade constante × tempo = distância. Quanto mais tempo, mais distância percorrida." },
  { question: "O que é proporcionalidade inversa?", answer: "Duas grandezas são inversamente proporcionais quando, ao dobrar uma, a outra é reduzida à metade. Exemplo: velocidade e tempo para percorrer a mesma distância. Quanto mais rápido, menos tempo." },
  { question: "Qual a fórmula da regra de três simples?", answer: "X = (B × C) / A, onde A está para B assim como C está para X. Substitua os valores conhecidos e resolva para X." },
];

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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A regra de três simples resolve proporções entre duas grandezas. Dado que A está para B
            assim como C está para X, a fórmula é <strong>X = (B × C) / A</strong>. O nome {"\"regra de três\""}
            refere-se aos três valores conhecidos necessários para encontrar o quarto.
          </p>
          <p>
            Aplica-se quando as grandezas são diretamente proporcionais (mais de um implica mais do outro).
            Para grandezas inversamente proporcionais (mais velocidade = menos tempo), o raciocínio é
            invertido: X = (A × B) / C.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Proporção de ingredientes</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Receita para 4 pessoas usa 300g de farinha. Quanto usar para 6 pessoas?
            </p>
            <p className="mt-2 text-sm"><strong>A=4, B=300, C=6 → X = (300×6)/4 = 450g</strong></p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Câmbio</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Se R$ 5,00 = USD 1,00, quanto são USD 350?
            </p>
            <p className="mt-2 text-sm"><strong>A=5, B=1, C=350 → X = (1×350)/5 = USD 70</strong></p>
          </div>
        </div>
      }
    >
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
