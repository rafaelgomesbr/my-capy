"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("texto", "contador-caracteres")!;
const faqs = [{ question: "Qual o limite de caracteres do Instagram?", answer: "O Instagram permite até 2.200 caracteres na legenda, 150 na bio e 100 por comentário." }];

const limites = [
  { rede: "Twitter/X", limite: 280 },
  { rede: "Instagram Bio", limite: 150 },
  { rede: "Meta Description", limite: 160 },
  { rede: "Title SEO", limite: 60 },
  { rede: "WhatsApp Status", limite: 700 },
];

export function ContadorCaracteres() {
  const [text, setText] = useState("");
  const chars = text.length;

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-cc">Digite seu texto</Label>
              <textarea
                id="text-cc"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite ou cole o texto aqui..."
                className="min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Total de caracteres</p>
                <p className="mt-1 text-3xl font-bold text-primary">{chars}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Sem espaços</p>
                <p className="mt-1 text-3xl font-bold">{text.replace(/\s/g, "").length}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Limites por plataforma</p>
              {limites.map((l) => (
                <div key={l.rede} className="flex items-center gap-3">
                  <span className="w-36 text-sm text-muted-foreground">{l.rede}</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full transition-all ${chars > l.limite ? "bg-red-500" : "bg-primary"}`}
                      style={{ width: `${Math.min((chars / l.limite) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${chars > l.limite ? "text-red-500" : "text-muted-foreground"}`}>
                    {chars}/{l.limite}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
