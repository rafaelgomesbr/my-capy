"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("texto", "regex-tester")!;
const faqs = [
  { question: "O que são expressões regulares (regex)?", answer: "Regex (Regular Expressions) são padrões de busca usados para encontrar, validar e manipular strings de texto. São suportados em praticamente todas as linguagens de programação e editores de código modernos." },
  { question: "Quais são as flags de regex mais comuns?", answer: "As principais flags são: 'g' (global — encontra todas as ocorrências, não apenas a primeira), 'i' (case-insensitive — ignora maiúsculas/minúsculas), 'm' (multiline — ^ e $ correspondem ao início/fim de cada linha) e 's' (dotAll — o ponto . também corresponde a quebras de linha)." },
  { question: "Como validar um e-mail com regex?", answer: "Um regex básico para e-mail é: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}. Este não cobre todos os casos válidos do padrão RFC 5322, mas funciona para a grande maioria dos e-mails do dia a dia." },
  { question: "O que significa \\d, \\w e \\s em regex?", answer: "\\d equivale a qualquer dígito (0-9). \\w equivale a qualquer caractere de palavra (letras, dígitos e sublinhado). \\s equivale a qualquer espaço em branco (espaço, tab, quebra de linha). As versões maiúsculas (\\D, \\W, \\S) são o inverso de cada uma." },
  { question: "O regex do testador usa JavaScript?", answer: "Sim. Esta ferramenta usa a engine de regex nativa do JavaScript (implementação ECMAScript). A sintaxe é praticamente idêntica a Python, Java e outras linguagens modernas, mas alguns recursos avançados como lookbehind de tamanho variável podem não estar disponíveis." },
];

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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            Expressões regulares (regex) são uma mini-linguagem para descrever padrões de texto. Com elas é
            possível validar formatos (e-mail, CPF, telefone), extrair informações específicas de strings e
            fazer substituições complexas. Este testador executa o regex no navegador usando a engine
            JavaScript e destaca em amarelo todas as correspondências encontradas no texto.
          </p>
          <p>
            Use os exemplos prontos (Email, CPF, Telefone, URL) como ponto de partida. Combine as flags
            <code className="rounded bg-muted px-1 font-mono text-xs">g</code> (global) e{" "}
            <code className="rounded bg-muted px-1 font-mono text-xs">i</code> (case-insensitive) para a
            maioria dos casos de uso. O testador mostra a lista de todas as correspondências encontradas
            e o número total de ocorrências.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Padrões úteis para o dia a dia</p>
            <ul className="mt-2 space-y-2 font-mono text-sm text-muted-foreground">
              <li>• CPF: <span className="text-foreground">\d&#123;3&#125;\.\d&#123;3&#125;\.\d&#123;3&#125;-\d&#123;2&#125;</span></li>
              <li>• Telefone: <span className="text-foreground">\(\d&#123;2&#125;\)\s?9?\d&#123;4&#125;-\d&#123;4&#125;</span></li>
              <li>• CEP: <span className="text-foreground">\d&#123;5&#125;-\d&#123;3&#125;</span></li>
              <li>• Data BR: <span className="text-foreground">\d&#123;2&#125;\/\d&#123;2&#125;\/\d&#123;4&#125;</span></li>
              <li>• Número inteiro: <span className="text-foreground">-?\d+</span></li>
            </ul>
          </div>
        </div>
      }
    >
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
