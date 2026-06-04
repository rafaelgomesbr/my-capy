"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { Copy, CheckCheck, RefreshCw } from "lucide-react";

const tool = getToolBySlug("documentos", "gerador-cnh")!;

const faqs = [
  {
    question: "Para que serve o gerador de CNH?",
    answer:
      "Gera números de CNH (Carteira Nacional de Habilitação) matematicamente válidos para uso em testes de sistemas, desenvolvimento e homologação. O número tem 11 dígitos e os dois últimos são verificadores calculados pelo DETRAN.",
  },
  {
    question: "Como funciona o cálculo dos dígitos verificadores da CNH?",
    answer:
      "A CNH usa dois dígitos verificadores com algoritmo específico do DETRAN. O primeiro usa pesos decrescentes (9 a 1) sobre os 9 dígitos base, e o segundo usa pesos crescentes (1 a 9). Um fator DSC de 0 ou 2 é aplicado conforme o resultado da primeira soma.",
  },
];

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

function gerarCNH(): string {
  const digits = Array.from({ length: 9 }, randomDigit);

  // 1º dígito verificador
  const sum1 = digits.reduce((acc, d, i) => acc + d * (9 - i), 0);
  const rest1 = sum1 % 11;
  const dsc = rest1 >= 10 ? 2 : 0;
  const d1 = rest1 + dsc >= 10 ? 0 : rest1 + dsc;

  // 2º dígito verificador
  const sum2 = digits.reduce((acc, d, i) => acc + d * (1 + i), 0);
  const rest2 = sum2 % 11;
  const d2 = rest2 + dsc >= 10 ? 0 : rest2 + dsc;

  return [...digits, d1, d2].join("");
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} title="Copiar">
      {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export function GeradorCnh() {
  const [cnh, setCnh] = useState<string>("");
  const [lista, setLista] = useState<string[]>([]);

  const handleGerar = () => {
    setCnh(gerarCNH());
    setLista([]);
  };

  const handleGerar5 = () => {
    setLista(Array.from({ length: 5 }, gerarCNH));
    setCnh("");
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Gerar CNH</h2>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleGerar}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar CNH
            </Button>
            <Button variant="outline" onClick={handleGerar5}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar 5 CNHs
            </Button>
          </div>

          {cnh && (
            <div className="bg-primary/10 rounded-lg p-4 font-mono text-xl text-center flex items-center justify-center gap-3">
              <span>{cnh}</span>
              <CopyButton text={cnh} />
            </div>
          )}

          {lista.length > 0 && (
            <div className="space-y-2">
              {lista.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border px-4 py-2 font-mono"
                >
                  <span>{c}</span>
                  <CopyButton text={c} />
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            ⚠️ Estes dados são fictícios e destinados apenas para testes e desenvolvimento de sistemas.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
