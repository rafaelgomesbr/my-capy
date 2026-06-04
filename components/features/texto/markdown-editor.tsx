"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const faqs = [{ question: "O que é Markdown?", answer: "Markdown é uma linguagem de marcação leve criada por John Gruber. Usa símbolos simples como # para títulos, ** para negrito, * para itálico, e permite criar documentos formatados de forma legível." }];

function simpleMarkdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h1-6|li|blockquote])(.+)$/gm, (match) => (match.trim() ? match : ""));
}

const DEFAULT_MARKDOWN = `# Título Principal

## Subtítulo

Este é um parágrafo com **negrito** e *itálico*.

- Item um
- Item dois
- Item três

> Citação importante aqui

[Link de exemplo](https://mycapy.app)`;

export function MarkdownEditor() {
  const tool = getToolBySlug("texto", "markdown-generator")!;
  const [md, setMd] = useState(DEFAULT_MARKDOWN);

  const html = simpleMarkdownToHtml(md);

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="md-editor">Markdown</Label>
              <textarea
                id="md-editor"
                value={md}
                onChange={(e) => setMd(e.target.value)}
                className="min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>
            <div className="space-y-2">
              <Label>Preview</Label>
              <div
                className="min-h-[400px] rounded-md border bg-muted/30 p-3 text-sm prose prose-sm dark:prose-invert max-w-none overflow-auto"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function MarkdownToHtml() {
  const tool = getToolBySlug("texto", "markdown-to-html")!;
  const [md, setMd] = useState("");
  const [copied, setCopied] = useState(false);
  const html = simpleMarkdownToHtml(md);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [html]);

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="md-input">Markdown</Label>
            <textarea
              id="md-input"
              value={md}
              onChange={(e) => setMd(e.target.value)}
              placeholder="Cole o seu Markdown aqui..."
              className="min-h-[180px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>
          {html && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>HTML gerado</Label>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2 h-8">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado!" : "Copiar HTML"}
                </Button>
              </div>
              <div className="min-h-[180px] rounded-md border bg-muted/30 p-3 font-mono text-sm whitespace-pre-wrap">{html}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
