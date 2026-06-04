"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { Copy, CheckCheck, RefreshCw } from "lucide-react";

const tool = getToolBySlug("documentos", "gerador-renavam")!;

const faqs = [
  {
    question: "O que é o RENAVAM?",
    answer:
      "RENAVAM (Registro Nacional de Veículos Automotores) é um número único de 11 dígitos que identifica cada veículo registrado no Brasil. É usado em documentos como CRLV, licenciamento e transferência de propriedade.",
  },
  {
    question: "Para que serve este gerador de RENAVAM?",
    answer:
      "Gera números de RENAVAM matematicamente válidos para testes de sistemas veiculares, despachantes digitais e desenvolvimento de software de gestão de frotas. Os números gerados são fictícios.",
  },
];

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gerarRENAVAM(): string {
  // 9 dígitos aleatórios (garante que o primeiro não seja zero)
  const digits: number[] = [randomInt(1, 9), ...Array.from({ length: 8 }, randomDigit)];

  // Pesos aplicados da direita para a esquerda nos 9 dígitos
  const pesos = [2, 3, 4, 5, 6, 7, 8, 9, 2];
  const soma = digits.reduce((acc, d, i) => acc + d * pesos[8 - i], 0);
  const resto = soma % 11;
  const check = resto <= 1 ? 0 : 11 - resto;

  // RENAVAM tem 11 dígitos: 2 zeros à esquerda + 9 base + 1 verificador
  const n = `00${digits.join("")}${check}`;
  return n;
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

export function GeradorRenavam() {
  const [renavam, setRenavam] = useState<string>("");
  const [lista, setLista] = useState<string[]>([]);

  const handleGerar = () => {
    setRenavam(gerarRENAVAM());
    setLista([]);
  };

  const handleGerar5 = () => {
    setLista(Array.from({ length: 5 }, gerarRENAVAM));
    setRenavam("");
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Gerar RENAVAM</h2>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleGerar}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar RENAVAM
            </Button>
            <Button variant="outline" onClick={handleGerar5}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar 5 RERANAMs
            </Button>
          </div>

          {renavam && (
            <div className="bg-primary/10 rounded-lg p-4 font-mono text-xl text-center flex items-center justify-center gap-3">
              <span>{renavam}</span>
              <CopyButton text={renavam} />
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
