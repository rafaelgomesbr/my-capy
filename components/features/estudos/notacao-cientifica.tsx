"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("estudos", "notacao-cientifica")!;
const faqs = [{ question: "O que é notação científica?", answer: "É uma forma de escrever números muito grandes ou pequenos. Ex: 3.000.000 = 3 × 10⁶ e 0,000005 = 5 × 10⁻⁶." }];

export function NotacaoCientifica() {
  const [num, setNum] = useState("");
  const [mantissa, setMantissa] = useState("");
  const [expoente, setExpoente] = useState("");

  const toSci = num !== "" && !isNaN(parseFloat(num)) ? parseFloat(num).toExponential(4) : "";
  const fromSci = mantissa !== "" && expoente !== "" && !isNaN(parseFloat(mantissa)) && !isNaN(parseInt(expoente))
    ? (parseFloat(mantissa) * Math.pow(10, parseInt(expoente))).toLocaleString("pt-BR", { maximumFractionDigits: 20 }) : "";

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="to">
            <TabsList className="w-full">
              <TabsTrigger value="to" className="flex-1">Número → Notação</TabsTrigger>
              <TabsTrigger value="from" className="flex-1">Notação → Número</TabsTrigger>
            </TabsList>
            <TabsContent value="to" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="num-nc">Número</Label>
                <Input id="num-nc" type="number" placeholder="Ex: 3000000" value={num} onChange={(e) => setNum(e.target.value)} step="any" />
              </div>
              {toSci && (
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Notação científica</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-primary">{toSci}</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="from" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="man-nc">Mantissa</Label>
                  <Input id="man-nc" type="number" placeholder="Ex: 3.5" value={mantissa} onChange={(e) => setMantissa(e.target.value)} step="any" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-nc">Expoente (×10^)</Label>
                  <Input id="exp-nc" type="number" placeholder="Ex: 6" value={expoente} onChange={(e) => setExpoente(e.target.value)} />
                </div>
              </div>
              {fromSci && (
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Número</p>
                  <p className="mt-1 text-xl font-bold text-primary">{fromSci}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
