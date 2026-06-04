"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqs = [{ question: "Quantas milhas tem 1 km?", answer: "1 km = 0,621371 milhas. 1 milha = 1,60934 km." }];

function SimpleConverter({ toolSlug, fromLabel, factor, toLabel, fromUnit, toUnit, faqs: f }: {
  toolSlug: string; fromLabel: string; factor: number; toLabel: string; fromUnit: string; toUnit: string; faqs: { question: string; answer: string }[];
}) {
  const tool = getToolBySlug("conversores", toolSlug)!;
  const [value, setValue] = useState("");
  const converted = value !== "" && !isNaN(parseFloat(value)) ? (parseFloat(value) * factor).toFixed(4) : "";

  return (
    <ToolLayout tool={tool} faqs={f}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`from-${toolSlug}`}>{fromLabel} ({fromUnit})</Label>
            <Input id={`from-${toolSlug}`} type="number" placeholder={`Ex: 10`} value={value} onChange={(e) => setValue(e.target.value)} step="0.01" />
          </div>
          {converted && (
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">{toLabel} ({toUnit})</p>
              <p className="mt-1 text-2xl font-bold text-primary">{converted} {toUnit}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function KmMilhas() {
  return <SimpleConverter toolSlug="km-milhas" fromLabel="Quilômetros" factor={0.621371} toLabel="Milhas" fromUnit="km" toUnit="mi" faqs={faqs} />;
}
export function MilhasKm() {
  return <SimpleConverter toolSlug="milhas-km" fromLabel="Milhas" factor={1.60934} toLabel="Quilômetros" fromUnit="mi" toUnit="km" faqs={faqs} />;
}
export function MetrosPes() {
  return <SimpleConverter toolSlug="metros-pes" fromLabel="Metros" factor={3.28084} toLabel="Pés" fromUnit="m" toUnit="ft" faqs={[{ question: "Quantos pés tem 1 metro?", answer: "1 metro = 3,28084 pés (feet)." }]} />;
}
export function PolegadasCm() {
  return <SimpleConverter toolSlug="polegadas-cm" fromLabel="Polegadas" factor={2.54} toLabel="Centímetros" fromUnit="in" toUnit="cm" faqs={[{ question: "Quantos cm tem 1 polegada?", answer: "1 polegada = 2,54 centímetros." }]} />;
}
