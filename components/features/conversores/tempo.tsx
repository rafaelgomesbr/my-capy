"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqs = [{ question: "Quantos segundos tem 1 hora?", answer: "1 hora = 60 minutos = 3.600 segundos = 3.600.000 milissegundos." }];

function TimeConverter({ slug, from, to, factor, unit, toUnit }: {
  slug: string; from: string; to: string; factor: number; unit: string; toUnit: string;
}) {
  const tool = getToolBySlug("conversores", slug)!;
  const [value, setValue] = useState("");
  const converted = value !== "" && !isNaN(parseFloat(value)) ? (parseFloat(value) * factor).toFixed(4) : "";

  return (
    <ToolLayout tool={tool} faqs={faqs}>
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
    <ToolLayout tool={tool} faqs={faqs}>
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
