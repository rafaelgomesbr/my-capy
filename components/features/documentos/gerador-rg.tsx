"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { Copy, CheckCheck, RefreshCw } from "lucide-react";

const tool = getToolBySlug("documentos", "gerador-rg")!;

const faqs = [
  {
    question: "Qual formato de RG é gerado?",
    answer:
      "O gerador cria RGs no formato do estado de São Paulo (SP), com 8 dígitos mais um dígito verificador, formatado como XX.XXX.XXX-D. O dígito verificador pode ser um número de 0 a 9 ou a letra X.",
  },
  {
    question: "Por que o dígito verificador do RG pode ser X?",
    answer:
      "Quando o cálculo do dígito verificador resulta em 10, usa-se a letra X como representação, seguindo a convenção adotada pela SSP-SP. O valor 11 representa zero.",
  },
];

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

function gerarRG(): string {
  const digits = Array.from({ length: 8 }, randomDigit);

  const pesos = [2, 3, 4, 5, 6, 7, 8, 9];
  const soma = digits.reduce((acc, d, i) => acc + d * pesos[i], 0);
  const resto = soma % 11;
  const raw = 11 - resto;
  let check: string;
  if (raw === 10) check = "X";
  else if (raw === 11) check = "0";
  else check = String(raw);

  const n = digits.join("");
  return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}-${check}`;
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

export function GeradorRg() {
  const [rg, setRg] = useState<string>("");
  const [lista, setLista] = useState<string[]>([]);

  const handleGerar = () => {
    setRg(gerarRG());
    setLista([]);
  };

  const handleGerar5 = () => {
    setLista(Array.from({ length: 5 }, gerarRG));
    setRg("");
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Gerar RG (formato SP)</h2>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleGerar}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar RG
            </Button>
            <Button variant="outline" onClick={handleGerar5}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar 5 RGs
            </Button>
          </div>

          {rg && (
            <div className="bg-primary/10 rounded-lg p-4 font-mono text-xl text-center flex items-center justify-center gap-3">
              <span>{rg}</span>
              <CopyButton text={rg} />
            </div>
          )}

          {lista.length > 0 && (
            <div className="space-y-2">
              {lista.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border px-4 py-2 font-mono"
                >
                  <span>{r}</span>
                  <CopyButton text={r} />
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
