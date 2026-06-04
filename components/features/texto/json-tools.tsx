"use client";

import { useState, useCallback } from "react";
import { Copy, Check, CheckCircle, XCircle } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const faqs = [{ question: "O que é JSON?", answer: "JSON (JavaScript Object Notation) é um formato leve de troca de dados, fácil de ler e escrever por humanos e de interpretar por máquinas. É amplamente usado em APIs web." }];

export function JsonFormatter() {
  const tool = getToolBySlug("texto", "json-formatter")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState("2");

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, parseInt(indent)));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, indent]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="json-in">JSON para formatar</Label>
            <textarea id="json-in" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder='{"nome":"João","idade":30,"ativo":true}'
              className="min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="indent-json" className="shrink-0 text-sm">Indentação</Label>
              <select id="indent-json" value={indent} onChange={(e) => setIndent(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="2">2 espaços</option>
                <option value="4">4 espaços</option>
                <option value="1">Tab</option>
              </select>
            </div>
            <Button onClick={format} className="flex-1">Formatar JSON</Button>
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <XCircle className="h-4 w-4 shrink-0" />
              <p className="text-sm font-mono">{error}</p>
            </div>
          )}
          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>JSON formatado</Label>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2 h-8">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
              <pre className="min-h-[160px] overflow-auto rounded-md border bg-muted/30 p-3 font-mono text-sm">{output}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function JsonValidator() {
  const tool = getToolBySlug("texto", "json-validator")!;
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);

  const validate = useCallback(() => {
    try {
      JSON.parse(input);
      setResult({ valid: true, message: "JSON válido! Nenhum erro encontrado." });
    } catch (e) {
      setResult({ valid: false, message: (e as Error).message });
    }
  }, [input]);

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="json-val">JSON para validar</Label>
            <textarea id="json-val" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Cole o JSON aqui..."
              className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
          </div>
          <Button onClick={validate} className="w-full">Validar JSON</Button>
          {result && (
            <div className={`flex items-start gap-3 rounded-lg p-4 ${result.valid ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-red-50 dark:bg-red-950/40"}`}>
              {result.valid
                ? <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                : <XCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />}
              <div>
                <p className={`font-medium ${result.valid ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                  {result.valid ? "JSON Válido" : "JSON Inválido"}
                </p>
                <p className="mt-0.5 font-mono text-sm text-muted-foreground">{result.message}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
