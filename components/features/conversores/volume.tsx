"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqsLG = [
  { question: "Quantos litros tem 1 galão americano?", answer: "1 galão americano (US gallon) = 3,78541 litros. Já o galão imperial britânico é maior: 1 galão UK = 4,54609 litros. Esta ferramenta usa o galão americano como padrão." },
  { question: "Para que converto litros para galões?", answer: "Para entender capacidade de tanques de combustível de carros americanos, receitas de bebidas americanas, especificações de aquários em galões, ou comprar produtos cujo volume é indicado em galões nos EUA." },
  { question: "Litros por km vs. milhas por galão (MPG) — como comparar?", answer: "Para converter L/100km para MPG: MPG = 235,214 ÷ (L/100km). Exemplo: 8 L/100km = 29,4 MPG. Carros americanos eficientes têm ~30-40 MPG ≈ 5,9-7,8 L/100km." },
  { question: "Qual o tamanho de uma garrafa de água americana comum?", answer: "Garrafas americanas geralmente são de 16,9 fl oz (fluid ounces) = 500 mL ≈ 0,5 L. 1 galão = 128 fl oz = 3,785 L. Jugs de galão são comuns em supermercados americanos para água e leite." },
  { question: "Piscinas: quantos galões tem uma piscina padrão?", answer: "Uma piscina residencial padrão de 8m × 4m × 1,5m tem 48.000 litros = 12.680 galões. Piscinas olímpicas têm 2.500.000 L = 660.430 galões." },
];

const faqsGL = [
  { question: "Como converter galões para litros?", answer: "Multiplique o número de galões por 3,78541. Exemplo: 5 galões americanos = 5 × 3,78541 = 18,93 litros." },
  { question: "Por que existem galão americano e galão britânico?", answer: "O galão americano e o britânico divergiram historicamente. O galão US equivale a 231 pol³ (3,785 L) e o galão UK equivale a 10 libras de água (4,546 L). São unidades legalmente diferentes." },
  { question: "Receitas americanas usam galões?", answer: "Galões são usados em receitas de grandes volumes (cervejas artesanais, geleias, etc.). Receitas menores usam copos (cups, 1 cup = 237 mL), onças fluídas (fl oz, 1 fl oz = 29,57 mL) ou quarts (1 qt = 0,946 L)." },
  { question: "Combustível: tanque de pickup americana em galões?", answer: "Pickups americanas como F-150 têm tanques de 26-36 galões (98-136 litros). O tanque de um carro brasileiro típico é de 50-60 litros (13-16 galões)." },
  { question: "Qual a diferença entre galão e quart?", answer: "1 galão americano = 4 quarts = 8 pints = 16 cups = 128 fluid ounces. São subdivisões do galão usadas em culinária americana." },
];

export function LitrosGaloes() {
  const tool = getToolBySlug("conversores", "litros-galoes")!;
  const [litros, setLitros] = useState("");
  const galUS = litros !== "" && !isNaN(parseFloat(litros)) ? (parseFloat(litros) / 3.78541).toFixed(4) : "";
  const galUK = litros !== "" && !isNaN(parseFloat(litros)) ? (parseFloat(litros) / 4.54609).toFixed(4) : "";

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsLG}
      explanation={
        <div className="space-y-3">
          <p>
            A ferramenta converte litros para as duas versões do galão: o <strong>galão americano</strong>
            (1 US gal = 3,78541 L), padrão nos EUA para combustível, laticínios e bebidas, e o
            <strong> galão imperial britânico</strong> (1 UK gal = 4,54609 L), ainda usado no Reino Unido
            para certos fins.
          </p>
          <p>
            O galão americano é o mais relevante para brasileiros que viajam aos EUA, compram produtos
            americanos online, ou trabalham com equipamentos industriais americanos. A conversão é
            fundamental para entender eficiência de combustível (mpg) e capacidade de tanques.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Volumes comuns</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Tanque típico (BR): 55 L = 14,53 US gal</li>
              <li>• Jug de leite americano: 3,785 L = 1 US gal</li>
              <li>• Barril de petróleo: 158,99 L = 42 US gal</li>
              <li>• Piscina 50.000 L = 13.209 US gal</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lit-in">Litros (L)</Label>
            <Input id="lit-in" type="number" placeholder="Ex: 10" value={litros} onChange={(e) => setLitros(e.target.value)} step="0.01" />
          </div>
          {galUS && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Galão americano (US gal)</p>
                <p className="mt-1 text-2xl font-bold text-primary">{galUS} gal</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Galão imperial (UK gal)</p>
                <p className="mt-1 text-2xl font-bold">{galUK} gal</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function GaloesLitros() {
  const tool = getToolBySlug("conversores", "galoes-litros")!;
  const [galoes, setGaloes] = useState("");
  const litros = galoes !== "" && !isNaN(parseFloat(galoes)) ? (parseFloat(galoes) * 3.78541).toFixed(4) : "";

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsGL}
      explanation={
        <div className="space-y-3">
          <p>
            A conversão de galões americanos para litros multiplica pelo fator exato
            <strong> 3,78541 L/gal</strong>. Um galão americano é definido como 231 polegadas cúbicas,
            que equivalem a exatamente 3,785411784 litros.
          </p>
          <p>
            Essa conversão é especialmente útil para quem faz cerveja artesanal (receitas americanas em
            galões), para entender capacidade de filtros de aquário americanos, para calcular consumo de
            combustível em viagens aos EUA, ou para receitas industriais e homebrewing.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Galões para litros — referências</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• 1 US gal = 3,785 L</li>
              <li>• 5 US gal = 18,93 L (balde industrial)</li>
              <li>• 42 US gal (barril petróleo) = 158,99 L</li>
              <li>• 55 US gal (tambor) = 208,2 L</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gal-in">Galões americanos (US gal)</Label>
            <Input id="gal-in" type="number" placeholder="Ex: 5" value={galoes} onChange={(e) => setGaloes(e.target.value)} step="0.01" />
          </div>
          {litros && (
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">Litros (L)</p>
              <p className="mt-1 text-2xl font-bold text-primary">{litros} L</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
