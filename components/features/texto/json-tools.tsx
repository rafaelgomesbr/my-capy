"use client";

import { useState, useCallback } from "react";
import { Copy, Check, CheckCircle, XCircle } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const faqsFormatter = [
  { question: "O que é JSON?", answer: "JSON (JavaScript Object Notation) é um formato leve e legível de troca de dados, baseado em um subconjunto da sintaxe JavaScript. É usado amplamente em APIs REST, configurações de aplicações e armazenamento de dados." },
  { question: "Qual a diferença entre JSON minificado e formatado?", answer: "JSON minificado remove todos os espaços, tabulações e quebras de linha desnecessários, reduzindo o tamanho do arquivo para transmissão em rede. JSON formatado (pretty-print) adiciona indentação e quebras de linha para facilitar a leitura humana." },
  { question: "O que é indentação em JSON?", answer: "Indentação é o recuo aplicado a cada nível de aninhamento para tornar a estrutura visualmente clara. 2 espaços é o padrão mais comum em projetos JavaScript/Node.js; 4 espaços é preferido em algumas convenções de estilo." },
  { question: "JSON aceita comentários?", answer: "Não. O formato JSON padrão (RFC 8259) não permite comentários. Se você precisar de comentários, considere formatos alternativos como JSONC (JSON with Comments) ou YAML, que têm suporte a comentários." },
  { question: "Qual o tamanho máximo de JSON suportado?", answer: "Esta ferramenta processa o JSON inteiramente no navegador. O limite prático depende da memória RAM disponível no dispositivo. Em geral, JSONs de até alguns megabytes são processados sem problemas." },
];

const faqsValidator = [
  { question: "Por que meu JSON é inválido?", answer: "Os erros mais comuns são: vírgula após o último elemento de um array ou objeto (trailing comma), chaves de string sem aspas duplas, uso de aspas simples em vez de duplas, e valores undefined ou NaN (não permitidos em JSON)." },
  { question: "JSON aceita aspas simples?", answer: "Não. O padrão JSON exige aspas duplas para strings e nomes de propriedades. Aspas simples são válidas em JavaScript, mas não em JSON. {\"nome\": \"João\"} é correto; {'nome': 'João'} é inválido." },
  { question: "O validador aponta a linha do erro?", answer: "Sim. A mensagem de erro do JavaScript inclui a posição (linha/coluna ou offset de caractere) onde o parser encontrou o problema, facilitando a localização do erro no JSON." },
  { question: "Posso validar JSON com tipos específicos (schema)?", answer: "Esta ferramenta valida apenas a sintaxe JSON (estrutura bem formada). Para validar contra um schema específico (tipos de campos, campos obrigatórios), você precisaria de uma ferramenta de JSON Schema Validation." },
  { question: "Qual a diferença entre JSON válido e JSON correto?", answer: "JSON válido significa que a sintaxe está correta e o arquivo pode ser parseado. JSON correto (semanticamente) significa que os dados seguem o schema esperado pela aplicação. Um JSON pode ser sintaticamente válido mas conter dados errados." },
];

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
    <ToolLayout
      tool={tool}
      faqs={faqsFormatter}
      explanation={
        <div className="space-y-3">
          <p>
            O formatador JSON (JSON pretty-printer) recebe um JSON compacto ou mal indentado e o reorganiza
            com indentação consistente, uma propriedade por linha e estrutura visual clara. Internamente,
            o JSON é primeiro parseado pelo motor JavaScript (o que também valida a sintaxe) e depois
            re-serializado com{" "}
            <code className="rounded bg-muted px-1 font-mono text-xs">JSON.stringify(obj, null, indentação)</code>.
          </p>
          <p>
            É especialmente útil ao debugar respostas de APIs, ao ler arquivos de configuração compactados,
            ou ao comparar dois JSONs manualmente. Se o JSON contiver erros de sintaxe, a ferramenta exibe
            a mensagem de erro do parser com a posição aproximada do problema.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Entrada (minificado)</p>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{'{"nome":"Maria","idade":28,"cidade":"SP"}'}</p>
            <p className="mt-2 font-medium">Saída (formatado com 2 espaços)</p>
            <pre className="mt-1 font-mono text-sm text-primary">{`{\n  "nome": "Maria",\n  "idade": 28,\n  "cidade": "SP"\n}`}</pre>
          </div>
        </div>
      }
    >
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
    <ToolLayout
      tool={tool}
      faqs={faqsValidator}
      explanation={
        <div className="space-y-3">
          <p>
            O validador analisa o texto usando o parser JSON nativo do JavaScript. Se o JSON estiver
            sintaticamente correto, exibe uma confirmação de sucesso. Se houver algum erro, exibe a
            mensagem de erro do motor JavaScript com a posição do problema, permitindo localizar e corrigir
            o erro com precisão.
          </p>
          <p>
            Os erros mais frequentes em JSONs inválidos são: trailing comma (vírgula após o último elemento),
            aspas simples em vez de duplas, chaves sem aspas, valores <code className="rounded bg-muted px-1 font-mono text-xs">undefined</code> ou{" "}
            <code className="rounded bg-muted px-1 font-mono text-xs">NaN</code> (inválidos em JSON), e
            objetos com chaves duplicadas.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium text-red-600 dark:text-red-400">JSON inválido (trailing comma)</p>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{'{"nome": "João", "idade": 30,}'}</p>
            <p className="mt-2 font-medium text-emerald-600 dark:text-emerald-400">JSON válido (corrigido)</p>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{'{"nome": "João", "idade": 30}'}</p>
          </div>
        </div>
      }
    >
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
