"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("estudos", "notacao-cientifica")!;
const faqs = [
  { question: "O que é notação científica?", answer: "Notação científica é uma forma compacta de escrever números muito grandes ou muito pequenos. Ex: 3.000.000 = 3 × 10⁶ e 0,000005 = 5 × 10⁻⁶. O número é expresso como M × 10^n, onde 1 ≤ M < 10." },
  { question: "Como converter número para notação científica?", answer: "Mova a vírgula decimal até que reste apenas um dígito antes dela. O número de casas movidas é o expoente. Se moveu para a esquerda, o expoente é positivo; para a direita, negativo. Ex: 0,00045 → 4,5 × 10⁻⁴." },
  { question: "Como converter de notação científica para número normal?", answer: "Mova a vírgula decimal pelo número de casas indicado pelo expoente (para a direita se positivo, para a esquerda se negativo). Ex: 6,02 × 10²³ → 602.000.000.000.000.000.000.000." },
  { question: "Quando usar notação científica?", answer: "É usada em ciência, engenharia e matemática quando os números têm muitos zeros (como distâncias astronômicas, massa de elétrons, número de Avogadro). Facilita cálculos e evita erros de contagem de zeros." },
  { question: "O que é o número de Avogadro?", answer: "6,022 × 10²³ (aproximadamente 602 sextilhões). É o número de partículas em 1 mol de qualquer substância. Sem notação científica, seria impossível trabalhar com esse número no cotidiano da química." },
];

export function NotacaoCientifica() {
  const [num, setNum] = useState("");
  const [mantissa, setMantissa] = useState("");
  const [expoente, setExpoente] = useState("");

  const toSci = num !== "" && !isNaN(parseFloat(num)) ? parseFloat(num).toExponential(4) : "";
  const fromSci = mantissa !== "" && expoente !== "" && !isNaN(parseFloat(mantissa)) && !isNaN(parseInt(expoente))
    ? (parseFloat(mantissa) * Math.pow(10, parseInt(expoente))).toLocaleString("pt-BR", { maximumFractionDigits: 20 }) : "";

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A ferramenta converte números para notação científica (M × 10^n onde 1 ≤ M &lt; 10) e
            vice-versa. A conversão usa o método nativo do JavaScript (
            <code className="rounded bg-muted px-1 font-mono text-xs">toExponential(4)</code>), que
            garante precisão de 4 casas decimais na mantissa.
          </p>
          <p>
            A notação científica é essencial em física, química, astronomia e engenharia para representar
            grandezas que variam em muitas ordens de magnitude — desde o tamanho de um próton
            (1,7 × 10⁻¹⁵ m) até a distância à galáxia de Andrômeda (2,537 × 10²² m).
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Constantes físicas em notação científica</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Velocidade da luz: 3 × 10⁸ m/s</li>
              <li>• Carga do elétron: 1,6 × 10⁻¹⁹ C</li>
              <li>• Número de Avogadro: 6,022 × 10²³</li>
              <li>• Massa do próton: 1,67 × 10⁻²⁷ kg</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="to">
            <TabsList className="w-full">
              <TabsTrigger value="to" className="flex-1">Número → Notação</TabsTrigger>
              <TabsTrigger value="from" className="flex-1">Notação → Número</TabsTrigger>
            </TabsList>
            <TabsContent value="to" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="num-nc">Número</Label>
                <Input id="num-nc" type="number" placeholder="Ex: 3000000" value={num} onChange={(e) => setNum(e.target.value)} step="any" />
              </div>
              {toSci && (
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Notação científica</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-primary">{toSci}</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="from" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="man-nc">Mantissa</Label>
                  <Input id="man-nc" type="number" placeholder="Ex: 3.5" value={mantissa} onChange={(e) => setMantissa(e.target.value)} step="any" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-nc">Expoente (×10^)</Label>
                  <Input id="exp-nc" type="number" placeholder="Ex: 6" value={expoente} onChange={(e) => setExpoente(e.target.value)} />
                </div>
              </div>
              {fromSci && (
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Número</p>
                  <p className="mt-1 text-xl font-bold text-primary">{fromSci}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
