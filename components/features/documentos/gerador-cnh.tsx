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
    answer: "Gera números de CNH (Carteira Nacional de Habilitação) matematicamente válidos para uso em testes de sistemas, desenvolvimento e homologação. Útil para testar campos de CNH em cadastros de locadoras de veículos, despachantes digitais, sistemas de seguros e plataformas de mobilidade.",
  },
  {
    question: "Como funciona o cálculo dos dígitos verificadores da CNH?",
    answer: "A CNH usa dois dígitos verificadores com algoritmo do DETRAN. O 1º dígito usa pesos decrescentes (9 a 1) sobre os 9 dígitos base — se o resto for ≥10, aplica-se um fator DSC=2. O 2º dígito usa pesos crescentes (1 a 9) com o mesmo fator DSC. Quando o resultado seria ≥10, o dígito é 0.",
  },
  {
    question: "Qual a estrutura do número da CNH?",
    answer: "O número da CNH tem 11 dígitos: os 9 primeiros são sequenciais e identificam o registro no DETRAN, e os 2 últimos são dígitos verificadores calculados pelo algoritmo oficial. Diferentemente do CPF, o número da CNH não tem uma formatação visual padrão com pontos e traços — é exibido como sequência numérica contínua.",
  },
  {
    question: "CNH e CPF podem ter o mesmo número?",
    answer: "Não. São documentos completamente diferentes com numeração independente. O CPF tem 11 dígitos (9 + 2 verificadores) com algoritmo da Receita Federal. A CNH também tem 11 dígitos mas com algoritmo diferente do DETRAN. A coincidência numérica seria apenas casual.",
  },
  {
    question: "Posso usar esses números de CNH em cadastros reais?",
    answer: "Não. Os números gerados são fictícios e destinados apenas a testes e homologação de sistemas. Embora matematicamente válidos segundo o algoritmo do DETRAN, eles não estão vinculados a nenhum condutor real no RENACH (Registro Nacional de Condutores Habilitados). Usar em documentos oficiais configura fraude.",
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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador cria números de CNH com 11 dígitos usando o algoritmo do DETRAN. A estrutura é:
            9 dígitos base + 2 dígitos verificadores. O 10º usa pesos decrescentes (9 a 1) e um fator
            DSC (0 ou 2) quando o resto é ≥10. O 11º usa pesos crescentes (1 a 9) com o mesmo DSC.
          </p>
          <p>
            O número da CNH é registrado no RENACH (Registro Nacional de Condutores Habilitados) e
            aparece na própria carteira. Diferente do CPF, não tem formatação visual com pontos e
            traços — é exibido como sequência de 11 dígitos contínuos.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Estrutura do número de CNH</p>
            <ul className="mt-2 space-y-1 font-mono text-sm text-muted-foreground">
              <li>• Exemplo: 12345678900</li>
              <li>• Dígitos base: 123456789</li>
              <li>• 1º verificador: 0</li>
              <li>• 2º verificador: 0</li>
            </ul>
          </div>
        </div>
      }
    >
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
