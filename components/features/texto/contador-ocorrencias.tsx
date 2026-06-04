"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("texto", "contador-ocorrencias")!;

const faqs = [
  {
    question: "O que é correspondência exata de palavra?",
    answer:
      "Com a opção ativada, o termo só é contado quando aparece como palavra completa, separada por espaços ou pontuação. Por exemplo, buscar 'casa' não contaria 'casamento'. Sem a opção, qualquer ocorrência da sequência é contada.",
  },
  {
    question: "Como funciona o ranking de palavras?",
    answer:
      "Quando nenhum termo é informado, a ferramenta tokeniza o texto, remove pontuação e exibe as 20 palavras mais frequentes com sua contagem e percentual em relação ao total de palavras.",
  },
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface WordFreq {
  word: string;
  count: number;
  pct: number;
}

export function ContadorOcorrencias() {
  const [texto, setTexto] = useState("");
  const [termo, setTermo] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [palavraInteira, setPalavraInteira] = useState(false);

  const resultado = useMemo(() => {
    if (!texto.trim()) return null;

    if (termo.trim()) {
      const flags = caseSensitive ? "g" : "gi";
      const boundary = palavraInteira ? "\\b" : "";
      let count = 0;
      try {
        const re = new RegExp(`${boundary}${escapeRegex(termo.trim())}${boundary}`, flags);
        count = (texto.match(re) || []).length;
      } catch {
        count = 0;
      }
      return { tipo: "termo" as const, count };
    }

    const words = texto
      .toLowerCase()
      .replace(/[^a-záéíóúãẽõâêôàüçñ\s]/gi, " ")
      .split(/\s+/)
      .filter(Boolean);

    const total = words.length;
    const freq: Record<string, number> = {};
    for (const w of words) freq[w] = (freq[w] || 0) + 1;

    const sorted: WordFreq[] = Object.entries(freq)
      .map(([word, count]) => ({ word, count, pct: (count / total) * 100 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return { tipo: "ranking" as const, sorted, total };
  }, [texto, termo, caseSensitive, palavraInteira]);

  const highlightedText = useMemo(() => {
    if (!texto || !termo.trim()) return null;
    const flags = caseSensitive ? "g" : "gi";
    const boundary = palavraInteira ? "\\b" : "";
    try {
      const re = new RegExp(`(${boundary}${escapeRegex(termo.trim())}${boundary})`, flags);
      return texto.replace(re, "<mark class=\"bg-yellow-200 dark:bg-yellow-800 rounded px-0.5\">$1</mark>");
    } catch {
      return null;
    }
  }, [texto, termo, caseSensitive, palavraInteira]);

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="texto-ocorr">Texto</Label>
              <textarea
                id="texto-ocorr"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Cole ou digite o texto aqui..."
                className="min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="termo-input">Termo a buscar (opcional)</Label>
              <Input
                id="termo-input"
                placeholder="Deixe vazio para ver ranking de palavras"
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="rounded border-input"
                />
                <span className="text-sm">Sensível a maiúsculas</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={palavraInteira}
                  onChange={(e) => setPalavraInteira(e.target.checked)}
                  className="rounded border-input"
                />
                <span className="text-sm">Palavra inteira</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {resultado && (
          <Card>
            <CardContent className="p-6 space-y-4">
              {resultado.tipo === "termo" ? (
                <>
                  <div className="rounded-lg bg-primary/10 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Ocorrências de &ldquo;{termo}&rdquo;</p>
                    <p className="mt-1 text-3xl font-bold text-primary">{resultado.count}</p>
                  </div>
                  {highlightedText && (
                    <div className="space-y-2">
                      <Label>Texto com destaques</Label>
                      <div
                        className="rounded-md border bg-muted/30 px-3 py-2 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: highlightedText }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Top 20 palavras mais frequentes</h3>
                    <span className="text-sm text-muted-foreground">Total: {resultado.total} palavras</span>
                  </div>
                  <div className="space-y-1.5">
                    {resultado.sorted.map((item, i) => (
                      <div key={item.word} className="flex items-center gap-3">
                        <span className="w-6 text-xs text-muted-foreground text-right shrink-0">{i + 1}.</span>
                        <span className="font-mono text-sm font-medium w-32 truncate">{item.word}</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${(item.count / resultado.sorted[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right shrink-0">{item.count}</span>
                        <span className="text-xs text-muted-foreground w-12 text-right shrink-0">{item.pct.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
