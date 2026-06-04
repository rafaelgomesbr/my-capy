"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqs = [{ question: "Quantos litros tem 1 galão americano?", answer: "1 galão americano (US gallon) = 3,78541 litros. O galão imperial britânico = 4,54609 litros." }];

export function LitrosGaloes() {
  const tool = getToolBySlug("conversores", "litros-galoes")!;
  const [litros, setLitros] = useState("");
  const galUS = litros !== "" && !isNaN(parseFloat(litros)) ? (parseFloat(litros) / 3.78541).toFixed(4) : "";
  const galUK = litros !== "" && !isNaN(parseFloat(litros)) ? (parseFloat(litros) / 4.54609).toFixed(4) : "";

  return (
    <ToolLayout tool={tool} faqs={faqs}>
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
    <ToolLayout tool={tool} faqs={faqs}>
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
