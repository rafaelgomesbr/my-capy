"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqsTempo = [
  { question: "Quantos segundos tem 1 hora?", answer: "1 hora = 60 minutos = 3.600 segundos = 3.600.000 milissegundos. Uma hora em microssegundos = 3,6 bilhões." },
  { question: "Como converter horas em dias?", answer: "Divida o número de horas por 24. Exemplo: 72 horas = 72 ÷ 24 = 3 dias. No sentido inverso, multiplique os dias por 24 para obter horas." },
  { question: "Quantos segundos tem um ano?", answer: "1 ano ≈ 365,25 dias × 24 horas × 3.600 segundos = 31.557.600 segundos (≈ 31,5 milhões). Este valor usa o ano trópico médio. Um ano bissexto exato tem 31.622.400 segundos." },
  { question: "Para que converter unidades de tempo?", answer: "É útil em programação (timeouts em milissegundos, SLAs em horas), em finanças (prazos de investimento em dias), em produção (ciclos de processo em segundos), e para entender dados de telemetria e logs de sistema." },
  { question: "O que é um mês em dias para cálculos?", answer: "Para cálculos simples, usa-se 30 dias por mês. Esta ferramenta usa 30 dias = 1 mês e 365 dias = 1 ano para as conversões. Para cálculos jurídicos e financeiros precisos, conte os dias do calendário." },
];

function TimeConverter({ slug, from, to, factor, unit, toUnit }: {
  slug: string; from: string; to: string; factor: number; unit: string; toUnit: string;
}) {
  const tool = getToolBySlug("conversores", slug)!;
  const [value, setValue] = useState("");
  const converted = value !== "" && !isNaN(parseFloat(value)) ? (parseFloat(value) * factor).toFixed(4) : "";

  const explanation = (
    <div className="space-y-3">
      <p>
        A conversão de tempo usa os fatores da escala padrão: 1 minuto = 60 segundos, 1 hora = 60
        minutos = 3.600 segundos, 1 dia = 24 horas = 86.400 segundos. Esses são valores exatos e
        universais.
      </p>
      <p>
        Em programação, tempos são frequentemente trabalhos em milissegundos (ms) ou microssegundos (μs)
        para precisão. Esta ferramenta cobre as unidades do dia a dia: horas, minutos, segundos, dias
        e semanas.
      </p>
    </div>
  );

  const examples = (
    <div className="space-y-3">
      <div className="rounded-lg border p-4">
        <p className="font-medium">Referência de conversões</p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>• 1 hora = 60 min = 3.600 s</li>
          <li>• 1 dia = 24 h = 1.440 min = 86.400 s</li>
          <li>• 1 semana = 7 dias = 168 h</li>
          <li>• 1 mês (30 dias) = 720 h = 43.200 min</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout tool={tool} faqs={faqsTempo} explanation={explanation} examples={examples}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`from-t-${slug}`}>{from} ({unit})</Label>
            <Input id={`from-t-${slug}`} type="number" placeholder="Ex: 2" value={value} onChange={(e) => setValue(e.target.value)} step="0.01" />
          </div>
          {converted && (
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">{to} ({toUnit})</p>
              <p className="mt-1 text-2xl font-bold text-primary">{parseFloat(converted).toLocaleString("pt-BR")} {toUnit}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function HorasMinutos() {
  return <TimeConverter slug="horas-minutos" from="Horas" to="Minutos" factor={60} unit="h" toUnit="min" />;
}
export function MinutosSegundos() {
  return <TimeConverter slug="minutos-segundos" from="Minutos" to="Segundos" factor={60} unit="min" toUnit="s" />;
}
export function DiasHoras() {
  return <TimeConverter slug="dias-horas" from="Dias" to="Horas" factor={24} unit="dias" toUnit="h" />;
}

export function ConversorTempo() {
  const tool = getToolBySlug("conversores", "conversor-tempo")!;
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("horas");

  const toSeconds: Record<string, number> = {
    segundos: 1, minutos: 60, horas: 3600, dias: 86400, semanas: 604800, meses: 2592000,
  };

  const base = parseFloat(value) * (toSeconds[unit] || 1);

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsTempo}
      explanation={
        <div className="space-y-3">
          <p>
            O conversor de tempo completo permite inserir um valor em qualquer unidade (segundos, minutos,
            horas, dias, semanas ou meses) e ver instantaneamente o equivalente em todas as outras unidades
            simultaneamente. O cálculo usa o segundo como unidade base interna.
          </p>
          <p>
            É útil para planejar projetos (convertendo semanas em dias úteis e horas), para programação
            (convertendo SLAs de horas para segundos), ou para cálculos de produção e logística que
            envolvem diferentes escalas de tempo.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: 2 semanas equivale a</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• 14 dias</li>
              <li>• 336 horas</li>
              <li>• 20.160 minutos</li>
              <li>• 1.209.600 segundos</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="val-ct">Valor</Label>
              <Input id="val-ct" type="number" placeholder="Ex: 2" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit-ct">Unidade de origem</Label>
              <select id="unit-ct" value={unit} onChange={(e) => setUnit(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {Object.keys(toSeconds).map((u) => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
              </select>
            </div>
          </div>
          {value && !isNaN(parseFloat(value)) && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Object.entries(toSeconds).map(([u, s]) => (
                <div key={u} className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground capitalize">{u}</p>
                  <p className="mt-1 font-bold">{(base / s).toLocaleString("pt-BR", { maximumFractionDigits: 4 })}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
