"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { Copy, CheckCheck, RefreshCw } from "lucide-react";

const tool = getToolBySlug("documentos", "gerador-pis")!;

const faqs = [
  {
    question: "O que é o PIS/PASEP?",
    answer:
      "O PIS (Programa de Integração Social) é o número de identificação do trabalhador no FGTS e Seguro-Desemprego. O PASEP é o equivalente para servidores públicos. Ambos possuem 11 dígitos com um dígito verificador.",
  },
  {
    question: "Para que serve este gerador?",
    answer:
      "Gera números de PIS/PASEP matematicamente válidos para testes de sistemas de RH, folha de pagamento e desenvolvimento de software. Os números são fictícios e não pertencem a trabalhadores reais.",
  },
];

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

function gerarPIS(): string {
  const digits = Array.from({ length: 10 }, randomDigit);

  const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const soma = digits.reduce((acc, d, i) => acc + d * pesos[i], 0);
  const resto = soma % 11;
  const check = resto < 2 ? 0 : 11 - resto;
  digits.push(check);

  const n = digits.join("");
  return `${n.slice(0, 3)}.${n.slice(3, 8)}.${n.slice(8, 10)}-${n.slice(10)}`;
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

export function GeradorPis() {
  const [pis, setPis] = useState<string>("");
  const [lista, setLista] = useState<string[]>([]);

  const handleGerar = () => {
    setPis(gerarPIS());
    setLista([]);
  };

  const handleGerar5 = () => {
    setLista(Array.from({ length: 5 }, gerarPIS));
    setPis("");
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Gerar PIS/PASEP</h2>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleGerar}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar PIS/PASEP
            </Button>
            <Button variant="outline" onClick={handleGerar5}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar 5 PIS/PASEP
            </Button>
          </div>

          {pis && (
            <div className="bg-primary/10 rounded-lg p-4 font-mono text-xl text-center flex items-center justify-center gap-3">
              <span>{pis}</span>
              <CopyButton text={pis} />
            </div>
          )}

          {lista.length > 0 && (
            <div className="space-y-2">
              {lista.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border px-4 py-2 font-mono"
                >
                  <span>{p}</span>
                  <CopyButton text={p} />
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
