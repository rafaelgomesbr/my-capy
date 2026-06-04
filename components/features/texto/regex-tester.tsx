"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("texto", "regex-tester")!;
const faqs = [{ question: "O que são expressões regulares?", answer: "Regex (Regular Expressions) são padrões de busca usados para encontrar, validar e manipular strings. São amplamente usados em programação, editores de código e scripts." }];

const EXAMPLES = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { label: "CPF", pattern: "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" },
  { label: "Telefone BR", pattern: "\\(\\d{2}\\)\\s?9?\\d{4}-\\d{4}" },
  { label: "URL", pattern: "https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[\\/\\w\\-?=#&]*" },
];

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");

  const result = useMemo(() => {
    if (!pattern || !text) return null;
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...text.matchAll(new RegExp(pattern, flags.includes("g") ? flags : flags + "g"))];
      const highlighted = text.replace(regex, (m) => `<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">${m}</mark>`);
      return { matches: matches.map((m) => m[0]), highlighted, error: null };
    } catch (e) {
      return { matches: [], highlighted: text, error: (e as Error).message };
    }
  }, [pattern, flags, text]);

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="regex-pat">Expressão Regular</Label>
              <Input id="regex-pat" value={pattern} onChange={(e) => setPattern(e.target.value)}
                placeholder="Ex: \d+" className="font-mono" />
            </div>
            <div className="w-28 space-y-2">
              <Label htmlFor="regex-flags">Flags</Label>
              <Input id="regex-flags" value={flags} onChange={(e) => setFlags(e.target.value)}
                placeholder="g, i, m" className="font-mono" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex.label} onClick={() => setPattern(ex.pattern)}
                className="rounded-full border px-3 py-1 text-xs transition-colors hover:bg-accent">
                {ex.label}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="regex-text">Texto de teste</Label>
            <textarea id="regex-text" value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Cole o texto para testar a expressão regular..."
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
          </div>
          {result && (
            <div className="space-y-3">
              {result.error ? (
                <p className="rounded-lg bg-red-50 p-3 font-mono text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{result.error}</p>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Correspondências encontradas:</span>
                    <Badge variant={result.matches.length > 0 ? "default" : "secondary"}>
                      {result.matches.length}
                    </Badge>
                  </div>
                  {result.matches.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.matches.slice(0, 20).map((m, i) => (
                        <Badge key={i} variant="secondary" className="font-mono text-xs">{m}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="space-y-1">
                    <Label>Texto com highlighting</Label>
                    <div
                      className="min-h-[80px] rounded-md border bg-muted/30 p-3 text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: result.highlighted }}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
