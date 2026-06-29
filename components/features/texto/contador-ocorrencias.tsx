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
      "Com a opção 'Palavra inteira' ativada, o termo só é contado quando aparece como palavra completa, delimitada por espaços ou pontuação (usando \\b de boundary no regex). Por exemplo, buscar 'casa' não contaria 'casamento' nem 'descasa'. Sem a opção, qualquer ocorrência da sequência de caracteres é contada.",
  },
  {
    question: "Como funciona o ranking de palavras?",
    answer:
      "Quando nenhum termo é informado, a ferramenta tokeniza o texto (divide em palavras), remove pontuação, converte para minúsculas e conta a frequência de cada token. Exibe as 20 palavras mais frequentes com contagem absoluta e percentual em relação ao total de palavras do texto — útil para análise de densidade de palavras-chave.",
  },
  {
    question: "O que significa 'sensível a maiúsculas'?",
    answer:
      "Quando ativado, 'Casa', 'casa' e 'CASA' são contados como termos diferentes. Desativado (padrão), a busca ignora diferença entre maiúsculas e minúsculas: 'Casa' e 'casa' somam ao mesmo contador. Para análise de redação e texto em português, manter desativado geralmente dá resultados mais úteis.",
  },
  {
    question: "Qual a diferença entre contar ocorrências e contar palavras?",
    answer:
      "Contar palavras (como o Contador de Palavras desta plataforma) informa quantas palavras únicas o texto tem. Contar ocorrências de um termo específico diz quantas vezes aquela palavra ou frase aparece — útil para verificar densidade de palavras-chave em textos SEO, encontrar repetições excessivas ou verificar compliance com guias de estilo.",
  },
  {
    question: "Posso buscar frases inteiras, não só palavras?",
    answer:
      "Sim. O campo de busca aceita qualquer sequência de caracteres, incluindo frases com espaços. Por exemplo, buscar 'política de privacidade' contará quantas vezes essa sequência exata aparece no texto. A opção 'Palavra inteira' se aplica apenas à borda das extremidades da frase, não às palavras internas.",
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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A ferramenta tem dois modos: <strong>busca por termo</strong> e <strong>ranking automático</strong>.
            No modo de busca, usa expressão regular com flags configuráveis (case-insensitive, word boundary)
            para contar e destacar todas as ocorrências do termo no texto. No modo de ranking (sem termo),
            tokeniza o texto, remove pontuação e exibe as 20 palavras mais frequentes com barra visual proporcional.
          </p>
          <p>
            O destaque visual mostra exatamente onde cada ocorrência foi encontrada, facilitando a revisão
            do texto e a identificação de repetições indesejadas ou de palavras-chave sub-utilizadas.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium mb-2">Casos de uso</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• <strong>SEO:</strong> Verificar quantas vezes a palavra-chave principal aparece em um artigo</li>
              <li>• <strong>Redação:</strong> Encontrar repetições excessivas de um termo</li>
              <li>• <strong>Jurídico:</strong> Contar quantas vezes um nome ou cláusula aparece em um contrato</li>
              <li>• <strong>Programação:</strong> Contar ocorrências de uma variável ou função em código-fonte</li>
            </ul>
          </div>
        </div>
      }
    >
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
