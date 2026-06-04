"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getToolBySlug } from "@/lib/tools";

export function MediaEscolar() {
  const tool = getToolBySlug("estudos", "media-escolar")!;
  const [notas, setNotas] = useState(["", "", "", ""]);
  const [media, setMedia] = useState<number | null>(null);
  const mediaMinima = 6;

  const calcular = useCallback(() => {
    const ns = notas.map((n) => parseFloat(n.replace(",", "."))).filter((n) => !isNaN(n) && n >= 0 && n <= 10);
    if (ns.length === 0) return;
    setMedia(ns.reduce((a, b) => a + b, 0) / ns.length);
  }, [notas]);

  const faq = [{ question: "Qual a média para aprovação?", answer: "A média mínima para aprovação varia por escola, mas geralmente é 6,0 ou 7,0. Esta calculadora usa 6,0 como padrão." }];

  return (
    <ToolLayout tool={tool} faqs={faq}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {notas.map((n, i) => (
              <div key={i} className="space-y-2">
                <Label htmlFor={`nota-${i}`}>{i + 1}ª Nota</Label>
                <Input id={`nota-${i}`} type="number" placeholder="0-10" value={n} min="0" max="10" step="0.1"
                  onChange={(e) => { const ns = [...notas]; ns[i] = e.target.value; setNotas(ns); }} />
              </div>
            ))}
          </div>
          <Button onClick={calcular} className="w-full">Calcular Média</Button>
          {media !== null && (
            <div className={`rounded-lg p-6 text-center ${media >= mediaMinima ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-red-50 dark:bg-red-950/40"}`}>
              <p className="text-sm text-muted-foreground">Média</p>
              <p className={`mt-2 text-4xl font-bold ${media >= mediaMinima ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{media.toFixed(1)}</p>
              <Badge className="mt-3" variant={media >= mediaMinima ? "default" : "destructive"}>
                {media >= mediaMinima ? "✓ Aprovado" : "✗ Reprovado"}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function MediaPonderada() {
  const tool = getToolBySlug("estudos", "media-ponderada")!;
  const [itens, setItens] = useState([{ nota: "", peso: "" }, { nota: "", peso: "" }]);
  const [result, setResult] = useState<number | null>(null);

  const addItem = () => setItens([...itens, { nota: "", peso: "" }]);
  const calcular = useCallback(() => {
    const valid = itens.filter((i) => i.nota && i.peso && !isNaN(parseFloat(i.nota)) && !isNaN(parseFloat(i.peso)));
    if (valid.length === 0) return;
    const totalPeso = valid.reduce((s, i) => s + parseFloat(i.peso), 0);
    const totalPonderado = valid.reduce((s, i) => s + parseFloat(i.nota) * parseFloat(i.peso), 0);
    setResult(totalPonderado / totalPeso);
  }, [itens]);

  const faq = [{ question: "Como calcular a média ponderada?", answer: "Multiplique cada nota pelo seu peso, some todos os resultados e divida pela soma dos pesos. Ex: (7×2 + 8×3 + 9×5) / (2+3+5) = 83/10 = 8,3." }];

  return (
    <ToolLayout tool={tool} faqs={faq}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            {itens.map((item, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor={`n-mp-${i}`} className="text-xs">Nota {i + 1}</Label>
                  <Input id={`n-mp-${i}`} type="number" placeholder="0-10" min="0" max="10" step="0.1" value={item.nota}
                    onChange={(e) => { const ns = [...itens]; ns[i].nota = e.target.value; setItens(ns); }} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`p-mp-${i}`} className="text-xs">Peso {i + 1}</Label>
                  <Input id={`p-mp-${i}`} type="number" placeholder="Ex: 2" min="0" step="0.5" value={item.peso}
                    onChange={(e) => { const ns = [...itens]; ns[i].peso = e.target.value; setItens(ns); }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={addItem} className="flex-1">+ Adicionar nota</Button>
            <Button onClick={calcular} className="flex-1">Calcular</Button>
          </div>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">Média Ponderada</p>
              <p className="mt-2 text-4xl font-bold text-primary">{result.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
