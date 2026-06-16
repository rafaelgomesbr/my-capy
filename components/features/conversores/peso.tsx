"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqsKgLb = [
  { question: "Quantas libras tem 1 kg?", answer: "1 kg = 2,20462 libras (pounds). Para converter kg para libras, multiplique por 2,20462. Para uma estimativa rápida, multiplique por 2,2." },
  { question: "O que é uma libra?", answer: "A libra (lb, de 'libra pondo' em latim) é a unidade de massa no sistema imperial britânico e americano. 1 libra = 453,592 gramas = 0,453592 kg. É usada para peso corporal nos EUA, Reino Unido e outros países anglo-saxões." },
  { question: "Para que converto kg para libras?", answer: "É necessário ao ler sobre musculação (cargas em academias americanas), receitas (ingredientes em libras), especificações de equipamentos importados, ou ao viajar para países que usam o sistema imperial." },
  { question: "O que é 70 kg em libras?", answer: "70 kg = 70 × 2,20462 = 154,32 libras. Peso corporal comum expressado em libras nos EUA." },
  { question: "Qual a diferença entre libra e onça?", answer: "1 libra = 16 onças (oz). 1 onça = 28,35 gramas. Para converter gramas para onças, divida por 28,35. Onças são comuns em receitas de culinária americana e especificações de alimentos." },
];

const faqsLbKg = [
  { question: "Como converter libras para kg?", answer: "Divida o valor em libras por 2,20462. Exemplo: 154 libras ÷ 2,20462 ≈ 69,85 kg. Para estimativa rápida, divida por 2,2." },
  { question: "Qual é 155 libras em kg?", answer: "155 libras = 155 ÷ 2,20462 ≈ 70,31 kg. Peso corporal médio masculino adulto em muitos países ocidentais." },
  { question: "Halteres americanos: 45 lb = quanto kg?", answer: "45 libras = 45 ÷ 2,20462 ≈ 20,41 kg. O disco de 45 lb é o mais pesado padrão em academias americanas, equivalente a aproximadamente 20 kg." },
  { question: "Malas de avião: quanto é 50 lb em kg?", answer: "50 libras = 22,68 kg. Muitas companhias aéreas americanas usam 50 lb como limite de bagagem despachada. Em companhias europeias, o limite geralmente é 23 kg, que equivale a 50,71 lb." },
  { question: "Receitas americanas: o que é 1 lb de farinha?", answer: "1 libra de farinha = 453,59 gramas ≈ 450 g (arredondado para receitas). Ingredientes sólidos em receitas americanas frequentemente são medidos em libras ou onças." },
];

export function KgLibras() {
  const tool = getToolBySlug("conversores", "kg-libras")!;
  const [kg, setKg] = useState("");
  const lb = kg !== "" ? (parseFloat(kg) * 2.20462).toFixed(4) : "";
  const g = kg !== "" ? (parseFloat(kg) * 1000).toFixed(0) : "";

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsKgLb}
      explanation={
        <div className="space-y-3">
          <p>
            A conversão de quilogramas para libras usa o fator exato <strong>1 kg = 2,20462 lb</strong>.
            A ferramenta também converte para gramas (×1000), exibindo os três valores de uma vez para
            facilitar comparações com sistemas de medida diferentes.
          </p>
          <p>
            As libras são usadas principalmente nos EUA, Reino Unido (para peso corporal) e em alguns
            países do Caribe. No Brasil, o sistema métrico (kg) é o padrão legal. Ao importar equipamentos
            de musculação, alimentos ou seguir receitas americanas, a conversão é frequentemente necessária.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Pesos de referência</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Peso médio adulto: 70 kg = 154,32 lb</li>
              <li>• Disco de barra: 20 kg = 44,09 lb</li>
              <li>• Limite bagagem EUA: 22,68 kg = 50 lb</li>
              <li>• Saco de arroz: 5 kg = 11,02 lb</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kg-in">Quilogramas (kg)</Label>
            <Input id="kg-in" type="number" placeholder="Ex: 70" value={kg} onChange={(e) => setKg(e.target.value)} step="0.01" />
          </div>
          {kg !== "" && !isNaN(parseFloat(kg)) && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Libras (lb)</p>
                <p className="mt-1 text-2xl font-bold text-primary">{lb} lb</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Gramas (g)</p>
                <p className="mt-1 text-2xl font-bold">{g} g</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function LibrasKg() {
  const tool = getToolBySlug("conversores", "libras-kg")!;
  const [lb, setLb] = useState("");
  const kg = lb !== "" ? (parseFloat(lb) / 2.20462).toFixed(4) : "";

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsLbKg}
      explanation={
        <div className="space-y-3">
          <p>
            A conversão de libras para quilogramas divide o valor pelo fator <strong>2,20462</strong>
            (equivalente a multiplicar por 0,453592). O resultado é exibido com 4 casas decimais para
            precisão em aplicações técnicas como pesagem de equipamentos ou cálculos de frete.
          </p>
          <p>
            É especialmente útil para atletas que acompanham planilhas de treinamento americanas (onde
            cargas são em lb), para quem compra em lojas online dos EUA (onde produtos são descritos em
            libras e onças), ou para converter limites de bagagem de voos internacionais.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Conversões frequentes</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• 100 lb = 45,36 kg</li>
              <li>• 150 lb = 68,04 kg</li>
              <li>• 200 lb = 90,72 kg</li>
              <li>• 50 lb (limite bagagem) = 22,68 kg</li>
              <li>• 1 lb (receita) = 453,59 g</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lb-in">Libras (lb)</Label>
            <Input id="lb-in" type="number" placeholder="Ex: 154" value={lb} onChange={(e) => setLb(e.target.value)} step="0.01" />
          </div>
          {lb !== "" && !isNaN(parseFloat(lb)) && (
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">Quilogramas (kg)</p>
              <p className="mt-1 text-2xl font-bold text-primary">{kg} kg</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
