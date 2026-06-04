"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqs = [{ question: "Qual a diferença entre MB e MiB?", answer: "MB (Megabyte) usa base 10: 1 MB = 1.000.000 bytes. MiB (Mebibyte) usa base 2: 1 MiB = 1.048.576 bytes. Sistemas operacionais modernos usam MiB mas exibem como MB." }];

function DigitalConverter({ slug, from, to, factor, unit, toUnit, faqs: f }: {
  slug: string; from: string; to: string; factor: number; unit: string; toUnit: string; faqs: { question: string; answer: string }[];
}) {
  const tool = getToolBySlug("conversores", slug)!;
  const [value, setValue] = useState("");
  const converted = value !== "" && !isNaN(parseFloat(value)) ? (parseFloat(value) * factor).toFixed(6) : "";

  return (
    <ToolLayout tool={tool} faqs={f}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`from-${slug}`}>{from} ({unit})</Label>
            <Input id={`from-${slug}`} type="number" placeholder="Ex: 1024" value={value} onChange={(e) => setValue(e.target.value)} step="any" />
          </div>
          {converted && (
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">{to} ({toUnit})</p>
              <p className="mt-1 text-2xl font-bold text-primary">{parseFloat(converted).toLocaleString("pt-BR", { maximumFractionDigits: 6 })} {toUnit}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function BytesMb() {
  return <DigitalConverter slug="bytes-mb" from="Bytes" to="Megabytes" factor={1 / 1000000} unit="B" toUnit="MB" faqs={faqs} />;
}
export function MbGb() {
  return <DigitalConverter slug="mb-gb" from="Megabytes" to="Gigabytes" factor={1 / 1000} unit="MB" toUnit="GB" faqs={faqs} />;
}
export function GbTb() {
  return <DigitalConverter slug="gb-tb" from="Gigabytes" to="Terabytes" factor={1 / 1000} unit="GB" toUnit="TB" faqs={faqs} />;
}
