"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

function gcd(a: number, b: number): number { return b === 0 ? Math.abs(a) : gcd(b, a % b); }
function simplify(n: number, d: number) { const g = gcd(Math.abs(n), Math.abs(d)); return [n / g, d / g]; }

export function Fracoes() {
  const tool = getToolBySlug("estudos", "fracoes")!;
  const [n1, setN1] = useState(""); const [d1, setD1] = useState("");
  const [n2, setN2] = useState(""); const [d2, setD2] = useState("");
  const [op, setOp] = useState("+");
  const [result, setResult] = useState<[number, number] | null>(null);

  const calcular = useCallback(() => {
    const a = parseInt(n1), b = parseInt(d1), c = parseInt(n2), d = parseInt(d2);
    if ([a, b, c, d].some(isNaN) || b === 0 || d === 0) return;
    let rn: number, rd: number;
    switch (op) {
      case "+": rn = a * d + c * b; rd = b * d; break;
      case "-": rn = a * d - c * b; rd = b * d; break;
      case "×": rn = a * c; rd = b * d; break;
      case "÷": rn = a * d; rd = b * c; break;
      default: return;
    }
    setResult(simplify(rn, rd) as [number, number]);
  }, [n1, d1, n2, d2, op]);

  const faqs = [{ question: "Como somar frações com denominadores diferentes?", answer: "Encontre o MMC dos denominadores, converta as frações e some os numeradores." }];

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 justify-center">
            <div className="text-center">
              <Input className="w-16 text-center" placeholder="0" value={n1} onChange={(e) => setN1(e.target.value)} />
              <div className="my-1 h-0.5 w-full bg-foreground" />
              <Input className="w-16 text-center" placeholder="1" value={d1} onChange={(e) => setD1(e.target.value)} />
            </div>
            <select value={op} onChange={(e) => setOp(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-2 text-lg focus:outline-none focus:ring-2 focus:ring-ring">
              {["+", "-", "×", "÷"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <div className="text-center">
              <Input className="w-16 text-center" placeholder="0" value={n2} onChange={(e) => setN2(e.target.value)} />
              <div className="my-1 h-0.5 w-full bg-foreground" />
              <Input className="w-16 text-center" placeholder="1" value={d2} onChange={(e) => setD2(e.target.value)} />
            </div>
          </div>
          <Button onClick={calcular} className="w-full">Calcular</Button>
          {result && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-xs text-muted-foreground mb-2">Resultado (simplificado)</p>
              <div className="inline-block text-center">
                <p className="text-2xl font-bold text-primary">{result[0]}</p>
                <div className="my-1 h-0.5 w-full bg-primary" />
                <p className="text-2xl font-bold text-primary">{result[1]}</p>
              </div>
              {result[1] !== 0 && <p className="mt-2 text-sm text-muted-foreground">= {(result[0] / result[1]).toFixed(6)}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function ConversorFracoes() {
  const tool = getToolBySlug("estudos", "conversor-fracoes")!;
  const [n, setN] = useState(""); const [d, setD] = useState("");
  const [decimal, setDecimal] = useState("");
  const faqs = [{ question: "Como converter decimal para fração?", answer: "Multiplique o decimal por uma potência de 10 para obter o numerador. Ex: 0,75 = 75/100 = 3/4 (após simplificar)." }];

  const decToFrac = () => {
    const dec = parseFloat(decimal.replace(",", "."));
    if (isNaN(dec)) return;
    const decimals = (decimal.split(".")[1] || "").length;
    const denom = Math.pow(10, decimals);
    const num = Math.round(dec * denom);
    const [sn, sd] = simplify(num, denom);
    setN(String(sn)); setD(String(sd));
  };

  const fracToDec = () => {
    const num = parseInt(n), den = parseInt(d);
    if (!isNaN(num) && !isNaN(den) && den !== 0) setDecimal((num / den).toString());
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <Label>Fração</Label>
              <div className="flex items-center gap-2">
                <Input placeholder="Numerador" value={n} onChange={(e) => setN(e.target.value)} className="w-24" />
                <span>/</span>
                <Input placeholder="Denominador" value={d} onChange={(e) => setD(e.target.value)} className="w-24" />
              </div>
              <Button variant="outline" onClick={fracToDec} className="w-full text-sm">Fração → Decimal</Button>
            </div>
            <div className="space-y-3">
              <Label htmlFor="dec-cf">Decimal</Label>
              <Input id="dec-cf" type="text" placeholder="Ex: 0.75" value={decimal} onChange={(e) => setDecimal(e.target.value)} />
              <Button variant="outline" onClick={decToFrac} className="w-full text-sm">Decimal → Fração</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
