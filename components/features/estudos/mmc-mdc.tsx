"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}
function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}
function gcdMultiple(nums: number[]): number {
  return nums.reduce((acc, n) => gcd(acc, n));
}
function lcmMultiple(nums: number[]): number {
  return nums.reduce((acc, n) => lcm(acc, n));
}

function MmcMdcTool({ slug, isMmc }: { slug: "mmc" | "mdc"; isMmc: boolean }) {
  const tool = getToolBySlug("estudos", slug)!;
  const [input, setInput] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calcular = useCallback(() => {
    const nums = input.split(/[,;\s]+/).map(Number).filter((n) => n > 0 && !isNaN(n));
    if (nums.length < 2) return;
    setResult(isMmc ? lcmMultiple(nums) : gcdMultiple(nums));
  }, [input, isMmc]);

  const faqs = isMmc
    ? [{ question: "Para que serve o MMC?", answer: "O MMC é usado para encontrar o mínimo denominador comum ao somar frações, e em problemas de periodicidade." }]
    : [{ question: "Para que serve o MDC?", answer: "O MDC é usado para simplificar frações ao máximo, e em problemas envolvendo divisão igualitária." }];

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`nums-${slug}`}>Números (separados por vírgula ou espaço)</Label>
            <Input id={`nums-${slug}`} type="text" placeholder="Ex: 12, 18, 24" value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <Button onClick={calcular} className="w-full">Calcular {isMmc ? "MMC" : "MDC"}</Button>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">{isMmc ? "Mínimo Múltiplo Comum" : "Máximo Divisor Comum"}</p>
              <p className="mt-2 text-3xl font-bold text-primary">{result}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function Mmc() {
  return <MmcMdcTool slug="mmc" isMmc={true} />;
}
export function Mdc() {
  return <MmcMdcTool slug="mdc" isMmc={false} />;
}
