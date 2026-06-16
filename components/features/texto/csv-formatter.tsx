"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("texto", "csv-formatter")!;
const faqs = [
  { question: "O que é CSV?", answer: "CSV (Comma-Separated Values) é um formato de arquivo de texto simples que usa um caractere delimitador (geralmente vírgula ou ponto e vírgula) para separar os valores de cada coluna, com cada linha representando um registro de dados." },
  { question: "Por que meu CSV usa ponto e vírgula em vez de vírgula?", answer: "Em países que usam vírgula como separador decimal (como o Brasil), o Excel e outros programas optam pelo ponto e vírgula (;) como delimitador CSV para evitar ambiguidade. Se seu CSV veio do Excel em português, selecione o separador ';'." },
  { question: "Como abrir CSV no Excel sem problemas de encoding?", answer: "Ao abrir um CSV no Excel: use a guia 'Dados > De texto/CSV', selecione a codificação UTF-8 e o delimitador correto. Abrir diretamente pelo duplo clique frequentemente causa problemas com acentos e separadores." },
  { question: "O que é um CSV com aspas (quoted CSV)?", answer: "Alguns campos CSV são envolvidos em aspas duplas, especialmente quando o valor contém o próprio delimitador ou quebras de linha. Por exemplo: '\"São Paulo, SP\"' é tratado como um único campo. Esta ferramenta remove as aspas ao visualizar." },
  { question: "Qual o tamanho máximo de CSV suportado?", answer: "Esta ferramenta processa o CSV no navegador. Para arquivos muito grandes (mais de 1.000 linhas), a renderização da tabela pode ficar lenta. Nesse caso, use um editor especializado como o Excel ou o LibreOffice Calc." },
];

export function CsvFormatter() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState(",");
  const [table, setTable] = useState<string[][]>([]);

  const parse = useCallback(() => {
    if (!input.trim()) return;
    const rows = input.trim().split("\n").map((row) =>
      row.split(separator).map((cell) => cell.trim().replace(/^"|"$/g, ""))
    );
    setTable(rows);
  }, [input, separator]);

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O visualizador CSV converte texto no formato CSV em uma tabela visual HTML, facilitando a
            leitura e verificação dos dados. A primeira linha é interpretada como o cabeçalho da tabela.
            Você pode escolher o separador correto (vírgula, ponto e vírgula ou tab) antes de visualizar.
          </p>
          <p>
            É útil para verificar rapidamente o conteúdo de exportações de planilhas, respostas de APIs,
            relatórios de sistemas e qualquer dado tabular no formato CSV sem precisar abrir o Excel ou
            outro software. Também ajuda a identificar problemas de encoding ou separadores incorretos.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo de CSV válido (vírgula)</p>
            <pre className="mt-2 rounded bg-muted/50 p-2 font-mono text-sm text-muted-foreground">
              {`nome,email,cidade\nJoão,joao@email.com,São Paulo\nMaria,maria@email.com,Rio de Janeiro`}
            </pre>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo de CSV brasileiro (ponto e vírgula)</p>
            <pre className="mt-2 rounded bg-muted/50 p-2 font-mono text-sm text-muted-foreground">
              {`produto;preco;estoque\nCamiseta;49,90;150\nCalça;89,90;80`}
            </pre>
            <p className="mt-2 text-sm text-muted-foreground">Selecione "Ponto e vírgula (;)" como separador ao visualizar este formato.</p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-in">CSV</Label>
            <textarea id="csv-in" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={"nome,email,cidade\nJoão,joao@email.com,São Paulo\nMaria,maria@email.com,Rio"}
              className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="sep-csv" className="shrink-0 text-sm">Separador</Label>
              <select id="sep-csv" value={separator} onChange={(e) => setSeparator(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value=",">Vírgula (,)</option>
                <option value=";">Ponto e vírgula (;)</option>
                <option value="\t">Tab</option>
              </select>
            </div>
            <Button onClick={parse} className="flex-1">Visualizar Tabela</Button>
          </div>
          {table.length > 0 && (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {table[0].map((header, i) => (
                      <th key={i} className="border-b px-4 py-2 text-left font-semibold">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.slice(1).map((row, ri) => (
                    <tr key={ri} className="border-b last:border-0 hover:bg-muted/30">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-2">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
