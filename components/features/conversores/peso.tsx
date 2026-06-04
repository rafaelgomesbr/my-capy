"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqs = [{ question: "Quantas libras tem 1 kg?", answer: "1 kg = 2,20462 libras (pounds). Para converter kg para libras, multiplique por 2,20462." }];

export function KgLibras() {
  const tool = getToolBySlug("conversores", "kg-libras")!;
  const [kg, setKg] = useState("");
  const lb = kg !== "" ? (parseFloat(kg) * 2.20462).toFixed(4) : "";
  const g = kg !== "" ? (parseFloat(kg) * 1000).toFixed(0) : "";

  return (
    <ToolLayout tool={tool} faqs={faqs}>
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
    <ToolLayout tool={tool} faqs={faqs}>
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
