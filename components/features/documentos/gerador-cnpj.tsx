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

const tool = getToolBySlug("documentos", "gerador-cnpj")!;

const faqs = [
  {
    question: "Para que serve este gerador de CNPJ?",
    answer: "Gera números de CNPJ matematicamente válidos para uso em testes de sistemas, desenvolvimento de software e homologação. Útil para testar validação de formulários em e-commerces, sistemas de NF-e, ERPs e integrações com a Receita Federal sem usar CNPJs reais de empresas.",
  },
  {
    question: "Como funciona o cálculo dos dígitos verificadores do CNPJ?",
    answer: "O CNPJ tem 14 dígitos: os 8 primeiros identificam a empresa, os 4 seguintes identificam a filial (geralmente 0001), e os 2 últimos são dígitos verificadores. O 13º usa pesos [5,4,3,2,9,8,7,6,5,4,3,2]; o 14º usa pesos [6,5,4,3,2,9,8,7,6,5,4,3,2]. Se o resto da divisão por 11 for menor que 2, o dígito é 0; caso contrário, é 11-resto.",
  },
  {
    question: "Posso usar esses CNPJs em cadastros reais?",
    answer: "Não. Os CNPJs gerados são fictícios e destinados exclusivamente a testes e desenvolvimento. Embora matematicamente válidos, eles não pertencem a nenhuma empresa real registrada na Receita Federal. Usar dados fictícios em documentos fiscais ou cadastros oficiais configura fraude.",
  },
  {
    question: "O que significa o sufixo /0001 no CNPJ?",
    answer: "O sufixo /0001 indica a matriz (sede principal) da empresa. Filiais recebem /0002, /0003 etc. Este gerador cria CNPJs com filial 0001 (matriz). Cada filial tem os mesmos 8 dígitos da empresa mas dígitos verificadores diferentes, calculados sobre o CNPJ completo incluindo o código de filial.",
  },
  {
    question: "Qual a diferença entre CNPJ Alfa e CNPJ numérico?",
    answer: "O CNPJ Alfa é um novo formato implementado em 2026 pela Receita Federal que inclui letras maiúsculas (A-Z) nos 8 primeiros dígitos, além de números, ampliando drasticamente o universo de combinações possíveis. O formato numérico (o gerado aqui) ainda é o mais comum e aceito em todos os sistemas legados.",
  },
];

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

function gerarCNPJ(): string {
  const base = Array.from({ length: 8 }, randomDigit);
  const filial = [0, 0, 0, 1];
  const digits = [...base, ...filial];

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum1 = digits.reduce((acc, d, i) => acc + d * pesos1[i], 0);
  const r1 = sum1 % 11;
  const d1 = r1 < 2 ? 0 : 11 - r1;
  digits.push(d1);

  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum2 = digits.reduce((acc, d, i) => acc + d * pesos2[i], 0);
  const r2 = sum2 % 11;
  const d2 = r2 < 2 ? 0 : 11 - r2;
  digits.push(d2);

  const n = digits.join("");
  return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8, 12)}-${n.slice(12)}`;
}

function validarCNPJ(cnpj: string): boolean {
  const clean = cnpj.replace(/\D/g, "");
  if (clean.length !== 14) return false;
  if (new Set(clean.split("")).size === 1) return false;

  const digits = clean.split("").map(Number);

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum1 = digits.slice(0, 12).reduce((acc, d, i) => acc + d * pesos1[i], 0);
  const r1 = sum1 % 11;
  const d1 = r1 < 2 ? 0 : 11 - r1;
  if (digits[12] !== d1) return false;

  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum2 = digits.slice(0, 13).reduce((acc, d, i) => acc + d * pesos2[i], 0);
  const r2 = sum2 % 11;
  const d2 = r2 < 2 ? 0 : 11 - r2;
  return digits[13] === d2;
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

export function GeradorCnpj() {
  const [cnpj, setCnpj] = useState<string>("");
  const [lista, setLista] = useState<string[]>([]);
  const [inputCnpj, setInputCnpj] = useState("");
  const [validacao, setValidacao] = useState<boolean | null>(null);

  const handleGerar = () => {
    setCnpj(gerarCNPJ());
    setLista([]);
  };

  const handleGerar5 = () => {
    setLista(Array.from({ length: 5 }, gerarCNPJ));
    setCnpj("");
  };

  const handleValidar = () => {
    if (inputCnpj.replace(/\D/g, "").length > 0) {
      setValidacao(validarCNPJ(inputCnpj));
    }
  };

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador cria CNPJs válidos usando o algoritmo oficial da Receita Federal. A estrutura é:
            8 dígitos da empresa + 0001 (matriz) + 2 dígitos verificadores. O 13º dígito usa pesos
            [5,4,3,2,9,8,7,6,5,4,3,2] sobre os 12 primeiros; o 14º usa pesos [6,5,4,3,2,9,8,7,6,5,4,3,2]
            sobre os 13 primeiros.
          </p>
          <p>
            O validador extrai os 14 dígitos (ignorando pontos, barras e traços), verifica se não são
            todos iguais, e recalcula ambos os dígitos verificadores. Aceita tanto o formato com
            máscara (xx.xxx.xxx/xxxx-xx) quanto apenas os 14 números.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Estrutura do CNPJ</p>
            <ul className="mt-2 space-y-1 font-mono text-sm text-muted-foreground">
              <li>• 11.222.333/<strong>0001</strong>-81</li>
              <li>• Empresa: 11.222.333</li>
              <li>• Filial: 0001 (sempre = matriz)</li>
              <li>• Dígitos verificadores: 81</li>
            </ul>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Gerar CNPJ</h2>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={handleGerar}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Gerar CNPJ
              </Button>
              <Button variant="outline" onClick={handleGerar5}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Gerar 5 CNPJs
              </Button>
            </div>

            {cnpj && (
              <div className="bg-primary/10 rounded-lg p-4 font-mono text-xl text-center flex items-center justify-center gap-3">
                <span>{cnpj}</span>
                <CopyButton text={cnpj} />
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
            <h2 className="text-lg font-semibold">Validar CNPJ</h2>
            <div className="space-y-2">
              <Label htmlFor="cnpj-input">Digite um CNPJ para validar</Label>
              <div className="flex gap-2">
                <Input
                  id="cnpj-input"
                  placeholder="Ex: 11.222.333/0001-81"
                  value={inputCnpj}
                  onChange={(e) => {
                    setInputCnpj(e.target.value);
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
                  {validacao ? "✓ CNPJ Válido" : "✗ CNPJ Inválido"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}

// The validador is embedded inside GeradorCnpj (combined tool).
// Re-export so the page router can resolve "documentos/validador-cnpj".
export const ValidadorCnpj = GeradorCnpj;
