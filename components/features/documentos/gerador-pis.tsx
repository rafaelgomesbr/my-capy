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
    answer: "O PIS (Programa de Integração Social) é o número de identificação do trabalhador celetista na Caixa Econômica Federal, vinculado ao FGTS, Seguro-Desemprego e Abono Salarial. O PASEP é o equivalente para servidores públicos, gerenciado pelo Banco do Brasil. Ambos possuem 11 dígitos com um dígito verificador.",
  },
  {
    question: "Para que serve este gerador?",
    answer: "Gera números de PIS/PASEP matematicamente válidos para testes de sistemas de RH, folha de pagamento, eSocial, SEFIP/GFIP e desenvolvimento de software. Os números são fictícios e não pertencem a trabalhadores reais — são seguros para uso em ambientes de desenvolvimento e homologação.",
  },
  {
    question: "Como é calculado o dígito verificador do PIS?",
    answer: "O PIS/PASEP tem 11 dígitos. Os 10 primeiros são a sequência identificadora. O 11º é o dígito verificador: multiplica-se cada um dos 10 dígitos pelos pesos [3,2,9,8,7,6,5,4,3,2], soma-se os resultados e divide-se por 11. Se o resto for menor que 2, o dígito é 0; caso contrário, é 11-resto.",
  },
  {
    question: "Qual a diferença entre PIS, CPF e NIT?",
    answer: "São registros diferentes: o CPF é gerenciado pela Receita Federal e identifica o cidadão para fins tributários. O PIS identifica o trabalhador celetista no sistema de benefícios trabalhistas. O NIT (Número de Identificação do Trabalhador) é usado por contribuintes individuais e segurados facultativos — estruturalmente equivalente ao PIS/PASEP.",
  },
  {
    question: "O PIS serve como número de conta no banco?",
    answer: "Não diretamente. O PIS identifica a conta no Fundo de Amparo ao Trabalhador (FAT), mas para sacar o Abono Salarial ou Seguro-Desemprego você precisa ir a uma agência da Caixa ou usar o aplicativo CAIXA Tem. O número do PIS é necessário para abertura de conta social na Caixa Econômica Federal.",
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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador cria números de PIS/PASEP válidos com 11 dígitos: 10 dígitos de sequência + 1
            dígito verificador. O verificador é calculado pela soma dos 10 dígitos multiplicados pelos
            pesos [3,2,9,8,7,6,5,4,3,2]. Se o resto por 11 for menor que 2, o dígito é 0; caso
            contrário, é 11-resto.
          </p>
          <p>
            O PIS é emitido para trabalhadores celetistas no primeiro emprego com carteira assinada;
            o PASEP é o equivalente para servidores públicos. Ambos têm o mesmo formato numérico com
            o padrão xxx.xxxxx.xx-d, e são usados em sistemas de folha de pagamento, eSocial e SEFIP.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Formato PIS/PASEP</p>
            <ul className="mt-2 space-y-1 font-mono text-sm text-muted-foreground">
              <li>• Exemplo: 123.45678.90-1</li>
              <li>• Sequência: 1234567890</li>
              <li>• Dígito verificador: 1</li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              Pesos: [3,2,9,8,7,6,5,4,3,2] — mesmos do CPF mas em ordem diferente
            </p>
          </div>
        </div>
      }
    >
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
