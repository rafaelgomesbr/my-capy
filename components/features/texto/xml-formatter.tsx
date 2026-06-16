"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("texto", "xml-formatter")!;
const faqs = [
  { question: "O que é XML?", answer: "XML (eXtensible Markup Language) é uma linguagem de marcação usada para armazenar e transportar dados de forma estruturada. Diferente do HTML (que define como exibir dados), o XML define como os dados são organizados." },
  { question: "Qual a diferença entre XML e JSON?", answer: "XML usa tags de abertura/fechamento (<tag>valor</tag>) e suporta atributos. JSON usa pares chave-valor e é mais compacto. JSON é preferido em APIs modernas pela leveza. XML ainda domina integrações corporativas (SOAP, BPEL) e formatos como SVG, DOCX e RSS." },
  { question: "O que é um XML bem formado?", answer: "Um XML bem formado (well-formed) obedece às regras sintáticas: uma única raiz, todas as tags abertas são fechadas, atributos com aspas, e caracteres especiais escapados. Esta ferramenta verifica e formata apenas XMLs bem formados." },
  { question: "Onde XML ainda é amplamente usado?", answer: "XML é usado em: feeds RSS/Atom de blogs e podcasts, documentos Office (DOCX, XLSX são ZIP de XML), SVG (gráficos vetoriais), configurações Maven/Spring (Java), integrações SOAP/WSDL, NFe fiscal e Sped contábil no Brasil." },
  { question: "O que são namespaces XML?", answer: "Namespaces (xmlns) evitam conflitos de nomes entre elementos de diferentes vocabulários XML combinados em um único documento. São declarados como atributos xmlns:prefixo=\"URI\" e o prefixo é usado antes dos nomes de elementos (ex: soap:Body)." },
];

function formatXml(xml: string): string {
  const PADDING = "  ";
  let formatted = "";
  let indent = 0;
  const nodes = xml.replace(/>\s*</g, ">\n<").split("\n");
  for (const node of nodes) {
    if (node.match(/^<\/\w/)) indent--;
    formatted += PADDING.repeat(Math.max(0, indent)) + node + "\n";
    if (node.match(/^<\w[^>]*[^/]>.*$/) && !node.match(/^<.+<\/.+>/)) indent++;
  }
  return formatted.trim();
}

export function XmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = useCallback(() => {
    if (!input.trim()) return;
    try {
      setOutput(formatXml(input));
      setError("");
    } catch {
      setError("Erro ao formatar XML. Verifique a sintaxe.");
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O formatador XML reorganiza o XML compacto ou mal indentado adicionando quebras de linha entre
            os elementos e aplicando indentação proporcional ao nível de aninhamento de cada tag. O resultado
            é um XML com hierarquia visualmente clara, muito mais fácil de ler e depurar do que a versão
            minificada.
          </p>
          <p>
            É especialmente útil ao trabalhar com respostas de APIs SOAP, arquivos NFe (Nota Fiscal
            Eletrônica), feeds RSS, configurações em XML de projetos Java/Maven, ou qualquer XML recebido
            de um sistema externo que não aplica formatação.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Entrada (compacto)</p>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{"<pedido><item id='1'><nome>Produto A</nome><qtd>2</qtd></item></pedido>"}</p>
            <p className="mt-2 font-medium">Saída (formatado)</p>
            <pre className="mt-1 font-mono text-sm text-primary">{`<pedido>\n  <item id='1'>\n    <nome>Produto A</nome>\n    <qtd>2</qtd>\n  </item>\n</pedido>`}</pre>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="xml-in">XML para formatar</Label>
            <textarea id="xml-in" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="<root><item id='1'><name>Exemplo</name></item></root>"
              className="min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
          </div>
          <Button onClick={format} className="w-full">Formatar XML</Button>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}
          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>XML formatado</Label>
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
