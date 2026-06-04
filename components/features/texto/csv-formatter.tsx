"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("texto", "csv-formatter")!;
const faqs = [{ question: "O que é CSV?", answer: "CSV (Comma-Separated Values) é um formato de arquivo de texto que usa vírgulas para separar valores em tabelas. É suportado por Excel, Google Sheets e muitos outros sistemas." }];

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
    <ToolLayout tool={tool} faqs={faqs}>
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
