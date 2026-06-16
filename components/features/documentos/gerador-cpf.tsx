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
    answer: "Este gerador cria números de CPF matematicamente válidos para uso em testes de sistemas, desenvolvimento de software e ambientes de homologação. Desenvolvedores usam CPFs fictícios para testar validação de formulários, integração com APIs e fluxos de cadastro sem expor dados reais.",
  },
  {
    question: "Como funciona o cálculo dos dígitos verificadores do CPF?",
    answer: "O CPF tem 11 dígitos. Os 9 primeiros são a base. O 10º dígito (d1) é calculado pela soma ponderada dos 9 primeiros dígitos com pesos de 10 a 2, dividida por 11 — se o resto for menor que 2, d1=0; caso contrário, d1=11-resto. O 11º dígito (d2) segue o mesmo processo incluindo d1, com pesos de 11 a 2.",
  },
  {
    question: "Posso usar esses CPFs em cadastros reais?",
    answer: "Não. Os CPFs gerados são fictícios e destinados exclusivamente a testes e desenvolvimento. Embora sejam matematicamente válidos, eles não pertencem a nenhuma pessoa real. Usar dados fictícios em cadastros oficiais pode configurar fraude ou falsidade ideológica.",
  },
  {
    question: "O que são CPFs com todos os dígitos iguais?",
    answer: "CPFs como 111.111.111-11, 222.222.222-22 etc. são inválidos pelas regras da Receita Federal, mesmo que matematicamente o dígito verificador bata. O gerador exclui automaticamente essas combinações. O validador também rejeita esses números como inválidos.",
  },
  {
    question: "Como o validador de CPF funciona?",
    answer: "O validador extrai os 11 dígitos (ignorando pontos e traços), verifica se não são todos iguais, e recalcula os dois dígitos verificadores usando o mesmo algoritmo da Receita Federal. Se os dígitos calculados batem com os informados, o CPF é válido. Funciona tanto com CPF formatado (xxx.xxx.xxx-xx) quanto apenas com os números.",
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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador cria CPFs válidos usando o algoritmo oficial da Receita Federal: gera 9 dígitos
            aleatórios (excluindo sequências iguais como 111.111.111), calcula o 10º dígito pela soma
            ponderada com pesos de 10 a 2, e o 11º dígito incluindo o 10º com pesos de 11 a 2.
          </p>
          <p>
            O validador funciona no sentido inverso: recalcula os dígitos verificadores a partir dos 9
            primeiros dígitos informados e compara com os fornecidos. Aceita CPFs com ou sem formatação
            (pontos e traços são ignorados na validação).
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo de cálculo do 1º dígito verificador</p>
            <p className="mt-2 text-sm text-muted-foreground">
              CPF base: 529.982.247
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Soma: 5×10 + 2×9 + 9×8 + 9×7 + 8×6 + 2×5 + 2×4 + 4×3 + 7×2 = 295
            </p>
            <p className="mt-1 text-sm text-primary font-semibold">
              295 % 11 = 9 → d1 = 11 - 9 = 2 ✓
            </p>
          </div>
        </div>
      }
    >
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
