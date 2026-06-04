"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqs = [{ question: "Como converter Celsius para Fahrenheit?", answer: "Fórmula: °F = (°C × 9/5) + 32. Exemplo: 100°C = (100 × 1.8) + 32 = 212°F." }];

export function CelsiusFahrenheit() {
  const tool = getToolBySlug("conversores", "celsius-fahrenheit")!;
  const [celsius, setCelsius] = useState("");
  const f = celsius !== "" ? (parseFloat(celsius) * 9 / 5 + 32).toFixed(2) : "";
  const k = celsius !== "" ? (parseFloat(celsius) + 273.15).toFixed(2) : "";

  return (
    <ToolLayout tool={tool} faqs={faqs}>
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
    <ToolLayout tool={tool} faqs={faqs}>
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
