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
    answer: "O gerador cria RGs no formato do estado de São Paulo (SP), com 8 dígitos mais um dígito verificador, formatado como XX.XXX.XXX-D. O dígito verificador pode ser um número de 0 a 9 ou a letra X. Útil para testes de sistemas que validam RG no padrão SP.",
  },
  {
    question: "Por que o dígito verificador do RG pode ser X?",
    answer: "Quando o cálculo do dígito verificador resulta em 10, usa-se a letra X como representação, seguindo a convenção adotada pela SSP-SP. O valor 11 representa zero. Isso é semelhante ao sistema hexadecimal onde 10=A, mas no RG usa-se X por clareza na leitura humana.",
  },
  {
    question: "O RG tem padrão nacional no Brasil?",
    answer: "Não. Ao contrário do CPF (que é federal e único), o RG é emitido por cada estado e não possui um padrão nacional unificado. São Paulo usa 8 dígitos + verificador; Minas Gerais usa formato diferente; outros estados têm suas próprias convenções. O gerador cria RGs no padrão SSP-SP.",
  },
  {
    question: "Para que serve o gerador de RG?",
    answer: "É útil para desenvolvedores que precisam testar campos de RG em formulários, cadastros de sistemas de RH, plataformas de saúde e sistemas que exigem documentação. Permite validar a interface sem usar RGs de pessoas reais, respeitando a LGPD.",
  },
  {
    question: "O RG gerado pode ser conferido?",
    answer: "Os RGs gerados seguem o algoritmo oficial da SSP-SP (soma ponderada com pesos 2 a 9). Porém, verificar se um RG efetivamente existe requer consulta direta à SSP do estado emissor — não há API pública disponível. A ferramenta garante apenas que o formato e dígito verificador são matematicamente corretos.",
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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador cria RGs no formato SSP-SP: 8 dígitos aleatórios + 1 dígito verificador,
            no padrão XX.XXX.XXX-D. O dígito verificador é calculado pela soma ponderada dos
            8 dígitos com pesos de 2 a 9 (da esquerda para a direita). Quando o resultado é 10,
            usa-se X; quando é 11, usa-se 0.
          </p>
          <p>
            O RG não tem um padrão nacional no Brasil — cada estado tem seu próprio sistema.
            Este gerador implementa especificamente o formato da Secretaria de Segurança Pública
            de São Paulo (SSP-SP), o mais utilizado em sistemas de cadastro no país.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Formato RG (padrão SSP-SP)</p>
            <ul className="mt-2 space-y-1 font-mono text-sm text-muted-foreground">
              <li>• 12.345.678-9</li>
              <li>• 98.765.432-X (dígito 10 → X)</li>
              <li>• 45.678.901-0 (dígito 11 → 0)</li>
            </ul>
          </div>
        </div>
      }
    >
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
