"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("conversores", "conversor-fusos")!;
const faqs = [
  { question: "O que é UTC?", answer: "UTC (Coordinated Universal Time) é o padrão de tempo universal usado como referência global. O Brasil usa UTC-3 (BRT — Brasília Time) no horário padrão. O Reino Unido usa UTC+0 no inverno (GMT) e UTC+1 no verão (BST)." },
  { question: "O Brasil tem mais de um fuso horário?", answer: "Sim. O Brasil tem 4 fusos: UTC-2 (Fernando de Noronha), UTC-3 (Brasília/maioria do país), UTC-4 (Mato Grosso, Rondônia, Amazonas central) e UTC-5 (Acre e extremo oeste do Amazonas). O horário de verão foi extinto em 2019." },
  { question: "Como saber se é dia ou noite no destino?", answer: "Calcule a diferença de UTC. São Paulo é UTC-3; Nova York é UTC-5 (EST) ou UTC-4 (EDT no horário de verão). Se são 15h em SP, são 13h ou 14h em NY. Tóquio (UTC+9) estará 12h à frente de SP no horário padrão." },
  { question: "O que é DST (horário de verão)?", answer: "DST (Daylight Saving Time) é o avanço de 1 hora no relógio durante o verão para aproveitar a luz solar. O Brasil não adota mais horário de verão desde 2019. EUA e Europa ainda adotam, então os fusos em relação ao Brasil variam conforme a época do ano." },
  { question: "Como marcar uma reunião com equipes em fusos diferentes?", answer: "Agende sempre com referência a UTC. Por exemplo: 14h UTC = 11h São Paulo (UTC-3) = 9h Nova York (UTC-5) = 15h Londres (UTC+1 no verão). Esta ferramenta facilita encontrar o horário local em múltiplas cidades." },
];

const timezones = [
  { label: "São Paulo (BRT)", offset: -3 },
  { label: "Nova York (EST)", offset: -5 },
  { label: "Londres (GMT)", offset: 0 },
  { label: "Paris (CET)", offset: 1 },
  { label: "Dubai (GST)", offset: 4 },
  { label: "Mumbai (IST)", offset: 5.5 },
  { label: "Tóquio (JST)", offset: 9 },
  { label: "Sydney (AEST)", offset: 10 },
  { label: "Los Angeles (PST)", offset: -8 },
  { label: "Buenos Aires (ART)", offset: -3 },
];

export function ConversorFusos() {
  const [time, setTime] = useState("12:00");
  const [fromTz, setFromTz] = useState("0");

  const fromOffset = timezones[parseInt(fromTz)]?.offset ?? 0;

  function convert(toOffset: number) {
    const [h, m] = time.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return "--:--";
    const utcMinutes = h * 60 + m - fromOffset * 60;
    const localMinutes = ((utcMinutes + toOffset * 60) % 1440 + 1440) % 1440;
    const lh = Math.floor(localMinutes / 60).toString().padStart(2, "0");
    const lm = (localMinutes % 60).toString().padStart(2, "0");
    return `${lh}:${lm}`;
  }

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O conversor de fusos horários usa os offsets UTC de cada cidade para calcular o horário
            equivalente. O horário inserido é primeiro convertido para UTC (removendo o offset de origem)
            e depois convertido para cada fuso destino (adicionando o offset local). O cálculo usa aritmética
            modular para tratar corretamente a virada de meia-noite.
          </p>
          <p>
            A ferramenta exibe simultaneamente os horários em 10 cidades distribuídas pelos principais
            fusos globais, o que é ideal para coordenar reuniões internacionais, entender prazos em
            contratos com empresas estrangeiras, ou saber quando ligar para um contato em outro país.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Reunião às 10h de São Paulo — em que horário está cada cidade?</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• São Paulo 10:00 → Nova York 08:00 (mesmo dia)</li>
              <li>• São Paulo 10:00 → Londres 13:00 (mesmo dia)</li>
              <li>• São Paulo 10:00 → Dubai 17:00 (mesmo dia)</li>
              <li>• São Paulo 10:00 → Tóquio 22:00 (mesmo dia)</li>
              <li>• São Paulo 10:00 → Los Angeles 05:00 (mesmo dia)</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="time-fuso">Horário</Label>
              <Input id="time-fuso" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tz-from">Fuso de origem</Label>
              <select id="tz-from" value={fromTz} onChange={(e) => setFromTz(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {timezones.map((tz, i) => (
                  <option key={tz.label} value={i}>{tz.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {timezones.map((tz) => (
              <div key={tz.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5">
                <span className="text-sm">{tz.label}</span>
                <span className="font-mono font-semibold">{convert(tz.offset)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
