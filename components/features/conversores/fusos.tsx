"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("conversores", "conversor-fusos")!;
const faqs = [{ question: "O que é UTC?", answer: "UTC (Coordinated Universal Time) é o padrão de tempo universal. O Brasil usa UTC-3 (BRT) no horário normal e UTC-2 (BRST) no horário de verão em algumas regiões." }];

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
    <ToolLayout tool={tool} faqs={faqs}>
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
