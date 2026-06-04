"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getToolBySlug } from "@/lib/tools";
import { Copy, CheckCheck, RefreshCw } from "lucide-react";

const tool = getToolBySlug("documentos", "gerador-cartao-credito")!;

const faqs = [
  {
    question: "O que é o algoritmo Luhn?",
    answer:
      "O algoritmo de Luhn (ou fórmula de Luhn) é uma fórmula de soma de verificação usada para validar números de identificação, como cartões de crédito. Ele detecta erros simples de digitação e é usado por todas as principais bandeiras de cartão.",
  },
  {
    question: "Esses números de cartão funcionam para compras reais?",
    answer:
      "Não. Embora os números passem na validação matemática do algoritmo Luhn, eles não estão vinculados a nenhuma conta bancária real e serão recusados por qualquer sistema de pagamento real. São úteis apenas para testes de formulários e sistemas.",
  },
  {
    question: "Para que serve este gerador?",
    answer:
      "Este gerador é destinado exclusivamente a desenvolvedores que precisam testar campos de cartão de crédito em formulários, validadores de bandeiras, e sistemas de checkout sem usar dados reais.",
  },
];

function luhnCheckDigit(digits: number[]): number {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[digits.length - 1 - i];
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return (10 - (sum % 10)) % 10;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDigits(count: number): number[] {
  return Array.from({ length: count }, () => rand(0, 9));
}

type Bandeira = "Visa" | "Mastercard" | "Amex" | "Elo" | "Aleatório";

function gerarNumero(bandeira: Bandeira): { numero: string; bandeiraNome: string; cvvLen: number } {
  let prefix: number[];
  let totalLen: number;
  let nome: string;
  let cvvLen = 3;

  const b: Bandeira = bandeira === "Aleatório" ? (["Visa", "Mastercard", "Amex", "Elo"][rand(0, 3)] as Bandeira) : bandeira;

  if (b === "Visa") {
    prefix = [4];
    totalLen = 16;
    nome = "Visa";
  } else if (b === "Mastercard") {
    prefix = [5, rand(1, 5)];
    totalLen = 16;
    nome = "Mastercard";
  } else if (b === "Amex") {
    prefix = [3, rand(0, 1) === 0 ? 4 : 7];
    totalLen = 15;
    cvvLen = 4;
    nome = "Amex";
  } else {
    prefix = [6, 3, 6, 3, 6, 8];
    totalLen = 16;
    nome = "Elo";
  }

  const body = [...prefix, ...randomDigits(totalLen - prefix.length - 1)];
  const check = luhnCheckDigit(body);
  const all = [...body, check];
  const raw = all.join("");

  let formatted: string;
  if (b === "Amex") {
    formatted = `${raw.slice(0, 4)} ${raw.slice(4, 10)} ${raw.slice(10)}`;
  } else {
    formatted = raw.match(/.{1,4}/g)!.join(" ");
  }

  return { numero: formatted, bandeiraNome: nome, cvvLen };
}

function gerarValidade(): string {
  const month = String(rand(1, 12)).padStart(2, "0");
  const year = String(rand(26, 30));
  return `${month}/${year}`;
}

function gerarCVV(len: number): string {
  return Array.from({ length: len }, () => rand(0, 9)).join("");
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

interface CardData {
  numero: string;
  bandeiraNome: string;
  validade: string;
  cvv: string;
}

export function GeradorCartaoCredito() {
  const [bandeira, setBandeira] = useState<Bandeira>("Aleatório");
  const [cartao, setCartao] = useState<CardData | null>(null);

  const handleGerar = () => {
    const { numero, bandeiraNome, cvvLen } = gerarNumero(bandeira);
    setCartao({ numero, bandeiraNome, validade: gerarValidade(), cvv: gerarCVV(cvvLen) });
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 p-4">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                ⚠️ Estes números são gerados matematicamente (algoritmo Luhn) e são inválidos para transações reais. Use APENAS para testes de sistemas de pagamento.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="destructive">Apenas para testes</Badge>
              <Badge variant="outline">Não realiza transações</Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bandeira-select">Bandeira</Label>
              <select
                id="bandeira-select"
                value={bandeira}
                onChange={(e) => setBandeira(e.target.value as Bandeira)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {(["Aleatório", "Visa", "Mastercard", "Amex", "Elo"] as Bandeira[]).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <Button onClick={handleGerar}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar Cartão
            </Button>

            {cartao && (
              <div className="space-y-3 rounded-lg bg-muted/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bandeira</span>
                  <span className="font-semibold">{cartao.bandeiraNome}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">Número</span>
                    <span className="font-mono text-lg font-bold tracking-wider">{cartao.numero}</span>
                  </div>
                  <CopyButton text={cartao.numero.replace(/\s/g, "")} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">Validade</span>
                    <span className="font-mono font-semibold">{cartao.validade}</span>
                  </div>
                  <CopyButton text={cartao.validade} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">CVV</span>
                    <span className="font-mono font-semibold">{cartao.cvv}</span>
                  </div>
                  <CopyButton text={cartao.cvv} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
