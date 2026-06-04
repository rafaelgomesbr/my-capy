"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getToolBySlug } from "@/lib/tools";
import { Copy, CheckCheck, RefreshCw } from "lucide-react";

const tool = getToolBySlug("documentos", "gerador-cpf")!;

const faqs = [
  {
    question: "Para que serve este gerador de CPF?",
    answer:
      "Este gerador cria números de CPF matematicamente válidos para uso em testes de sistemas, desenvolvimento de software e ambientes de homologação. Os números gerados são fictícios e não pertencem a nenhuma pessoa real.",
  },
  {
    question: "Como funciona a validação do CPF?",
    answer:
      "O CPF possui dois dígitos verificadores calculados por soma ponderada dos nove primeiros dígitos. O validador verifica se os dígitos informados batem com o cálculo esperado, garantindo que o número segue o padrão da Receita Federal.",
  },
  {
    question: "Posso usar esses CPFs em cadastros reais?",
    answer:
      "Não. Os CPFs gerados são fictícios e destinados exclusivamente a testes e desenvolvimento. Usar dados fictícios em cadastros oficiais pode configurar fraude.",
  },
];

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

function gerarCPF(): string {
  let digits: number[];
  do {
    digits = Array.from({ length: 9 }, randomDigit);
  } while (new Set(digits).size === 1);

  const sum1 = digits.reduce((acc, d, i) => acc + d * (10 - i), 0);
  const r1 = sum1 % 11;
  const d1 = r1 < 2 ? 0 : 11 - r1;
  digits.push(d1);

  const sum2 = digits.reduce((acc, d, i) => acc + d * (11 - i), 0);
  const r2 = sum2 % 11;
  const d2 = r2 < 2 ? 0 : 11 - r2;
  digits.push(d2);

  const n = digits.join("");
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}

function validarCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  if (new Set(clean.split("")).size === 1) return false;

  const digits = clean.split("").map(Number);

  const sum1 = digits.slice(0, 9).reduce((acc, d, i) => acc + d * (10 - i), 0);
  const r1 = sum1 % 11;
  const d1 = r1 < 2 ? 0 : 11 - r1;
  if (digits[9] !== d1) return false;

  const sum2 = digits.slice(0, 10).reduce((acc, d, i) => acc + d * (11 - i), 0);
  const r2 = sum2 % 11;
  const d2 = r2 < 2 ? 0 : 11 - r2;
  return digits[10] === d2;
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

export function GeradorCpf() {
  const [cpf, setCpf] = useState<string>("");
  const [lista, setLista] = useState<string[]>([]);
  const [inputCpf, setInputCpf] = useState("");
  const [validacao, setValidacao] = useState<boolean | null>(null);

  const handleGerar = () => {
    setCpf(gerarCPF());
    setLista([]);
  };

  const handleGerar5 = () => {
    setLista(Array.from({ length: 5 }, gerarCPF));
    setCpf("");
  };

  const handleValidar = () => {
    if (inputCpf.replace(/\D/g, "").length > 0) {
      setValidacao(validarCPF(inputCpf));
    }
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Gerar CPF</h2>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={handleGerar}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Gerar CPF
              </Button>
              <Button variant="outline" onClick={handleGerar5}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Gerar 5 CPFs
              </Button>
            </div>

            {cpf && (
              <div className="bg-primary/10 rounded-lg p-4 font-mono text-xl text-center flex items-center justify-center gap-3">
                <span>{cpf}</span>
                <CopyButton text={cpf} />
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

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Validar CPF</h2>
            <div className="space-y-2">
              <Label htmlFor="cpf-input">Digite um CPF para validar</Label>
              <div className="flex gap-2">
                <Input
                  id="cpf-input"
                  placeholder="Ex: 123.456.789-09"
                  value={inputCpf}
                  onChange={(e) => {
                    setInputCpf(e.target.value);
                    setValidacao(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleValidar()}
                  className="font-mono"
                />
                <Button onClick={handleValidar}>Validar</Button>
              </div>
            </div>

            {validacao !== null && (
              <div className="flex items-center gap-3">
                <Badge variant={validacao ? "default" : "destructive"} className="text-sm px-3 py-1">
                  {validacao ? "✓ CPF Válido" : "✗ CPF Inválido"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}

// The validador is embedded inside GeradorCpf (combined tool).
// Re-export so the page router can resolve "documentos/validador-cpf".
export const ValidadorCpf = GeradorCpf;
