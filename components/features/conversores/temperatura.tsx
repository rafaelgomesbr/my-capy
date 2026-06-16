"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqsCF = [
  { question: "Como converter Celsius para Fahrenheit?", answer: "Fórmula: °F = (°C × 9/5) + 32. Exemplo: 100°C = (100 × 1,8) + 32 = 212°F. Para uma estimativa rápida, dobre o valor em Celsius e some 30 (ex: 20°C ≈ 70°F)." },
  { question: "O que é 0°C em Fahrenheit?", answer: "0°C corresponde a 32°F, que é o ponto de congelamento da água. 100°C (ponto de ebulição) = 212°F. Temperatura corporal normal: 37°C = 98,6°F." },
  { question: "Para que serve a escala Kelvin?", answer: "Kelvin (K) é a escala de temperatura absoluta usada em física e química. 0 K (-273,15°C) é o zero absoluto — a temperatura mais baixa possível. É usada em astrofísica, criogenia e termodinâmica." },
  { question: "Qual é a temperatura equivalente em ambas as escalas?", answer: "-40°C = -40°F. Essa é a única temperatura onde as duas escalas têm o mesmo valor numérico. Acima de -40°, o valor em Celsius é sempre menor que em Fahrenheit." },
  { question: "Quando uso Fahrenheit no Brasil?", answer: "No Brasil usamos Celsius. Fahrenheit é o padrão nos EUA, Belize e algumas Ilhas do Caribe. Ao ver temperaturas em receitas, manuais ou notícias americanas, é necessário converter para Celsius." },
];

const faqsFC = [
  { question: "Como converter Fahrenheit para Celsius?", answer: "Fórmula: °C = (°F - 32) × 5/9. Exemplo: 212°F = (212 - 32) × 5/9 = 180 × 5/9 = 100°C." },
  { question: "O que é 72°F em Celsius?", answer: "72°F = (72-32)×5/9 = 40×5/9 ≈ 22,2°C. Temperatura ambiente confortável, muito usada em receitas e configurações de ar-condicionado americanas." },
  { question: "Por que receitas americanas usam Fahrenheit?", answer: "Os EUA nunca adotaram o sistema métrico. Fornos americanos são graduados em °F: 350°F (180°C) é temperatura média de forno para assados. Esta ferramenta ajuda a converter receitas americanas." },
  { question: "Qual é a temperatura mais alta já registrada na Terra?", answer: "56,7°C (134°F) no Vale da Morte, Califórnia, EUA, em 1913. No Brasil, o recorde é 44,7°C em Araçuaí (MG) em 2024." },
  { question: "Qual a diferença entre Fahrenheit e Kelvin?", answer: "Kelvin = (°F - 32) × 5/9 + 273,15. Ambas são escalas de temperatura, mas Kelvin é a escala científica absoluta e Fahrenheit é a escala doméstica americana. Kelvin nunca é negativo." },
];

export function CelsiusFahrenheit() {
  const tool = getToolBySlug("conversores", "celsius-fahrenheit")!;
  const [celsius, setCelsius] = useState("");
  const f = celsius !== "" ? (parseFloat(celsius) * 9 / 5 + 32).toFixed(2) : "";
  const k = celsius !== "" ? (parseFloat(celsius) + 273.15).toFixed(2) : "";

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsCF}
      explanation={
        <div className="space-y-3">
          <p>
            A conversão de Celsius para Fahrenheit usa a fórmula <strong>°F = (°C × 9/5) + 32</strong>.
            O fator 9/5 (ou 1,8) reflete a diferença de escala entre as duas unidades — cada grau Celsius
            corresponde a 1,8 grau Fahrenheit. A soma de 32 ajusta o ponto zero, pois 0°C (congelamento
            da água) equivale a 32°F na escala Fahrenheit.
          </p>
          <p>
            A ferramenta também exibe a temperatura em Kelvin (K), adicionando 273,15 ao valor Celsius.
            Kelvin é a escala de temperatura absoluta usada em ciência — o zero absoluto (0 K) é o menor
            estado energético possível, equivalente a -273,15°C.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Referências práticas</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Ponto de congelamento: 0°C = 32°F = 273,15 K</li>
              <li>• Temperatura corporal: 37°C = 98,6°F = 310,15 K</li>
              <li>• Ponto de ebulição: 100°C = 212°F = 373,15 K</li>
              <li>• Forno médio: 180°C = 356°F</li>
              <li>• Dia quente: 35°C = 95°F</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cel-in">Celsius (°C)</Label>
            <Input id="cel-in" type="number" placeholder="Ex: 100" value={celsius} onChange={(e) => setCelsius(e.target.value)} step="0.1" />
          </div>
          {celsius !== "" && !isNaN(parseFloat(celsius)) && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Fahrenheit (°F)</p>
                <p className="mt-1 text-2xl font-bold text-primary">{f}°F</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Kelvin (K)</p>
                <p className="mt-1 text-2xl font-bold">{k} K</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function FahrenheitCelsius() {
  const tool = getToolBySlug("conversores", "fahrenheit-celsius")!;
  const [fahrenheit, setFahrenheit] = useState("");
  const c = fahrenheit !== "" ? ((parseFloat(fahrenheit) - 32) * 5 / 9).toFixed(2) : "";

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsFC}
      explanation={
        <div className="space-y-3">
          <p>
            A conversão de Fahrenheit para Celsius usa a fórmula <strong>°C = (°F - 32) × 5/9</strong>.
            Primeiro subtrai-se 32 para remover o deslocamento de ponto zero entre as escalas, depois
            multiplica-se por 5/9 para ajustar a diferença de escala (cada 9°F equivale a 5°C).
          </p>
          <p>
            É útil para adaptar receitas americanas (fornos em °F), entender previsões do tempo de
            viagens aos EUA, ou converter especificações técnicas de equipamentos importados dos Estados
            Unidos, onde o sistema Fahrenheit é padrão.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Temperaturas de forno comuns</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• 325°F = 163°C (forno baixo)</li>
              <li>• 350°F = 177°C (forno médio-baixo)</li>
              <li>• 375°F = 191°C (forno médio)</li>
              <li>• 400°F = 204°C (forno médio-alto)</li>
              <li>• 450°F = 232°C (forno alto)</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fah-in">Fahrenheit (°F)</Label>
            <Input id="fah-in" type="number" placeholder="Ex: 212" value={fahrenheit} onChange={(e) => setFahrenheit(e.target.value)} step="0.1" />
          </div>
          {fahrenheit !== "" && !isNaN(parseFloat(fahrenheit)) && (
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">Celsius (°C)</p>
              <p className="mt-1 text-2xl font-bold text-primary">{c}°C</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
