"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { Copy, CheckCheck, RefreshCw } from "lucide-react";

const tool = getToolBySlug("documentos", "gerador-titulo-eleitor")!;

const faqs = [
  {
    question: "O que é o Título de Eleitor?",
    answer:
      "O Título de Eleitor é o documento que comprova o alistamento eleitoral do cidadão brasileiro. Seu número tem 12 dígitos: 8 sequenciais, 2 de código de estado e 2 verificadores calculados pelo TSE.",
  },
  {
    question: "Para que serve este gerador?",
    answer:
      "Gera números de Título de Eleitor matematicamente válidos para testes de sistemas eleitorais, cadastros de RH e desenvolvimento de software. Os títulos gerados são fictícios e não pertencem a eleitores reais.",
  },
];

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Códigos de estado do TSE (01=SP, 02=MG, ..., 28=DF)
const ESTADOS_TSE = [
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
  "21", "22", "23", "24", "25", "26", "27", "28",
];

function gerarTituloEleitor(): string {
  // 8 dígitos sequenciais
  const seq = Array.from({ length: 8 }, randomDigit);

  // Código do estado (2 dígitos)
  const estadoCod = ESTADOS_TSE[randomInt(0, ESTADOS_TSE.length - 1)];
  const dEstado = estadoCod.split("").map(Number);
  const estadoNum = parseInt(estadoCod, 10);
  const isSPouMG = estadoNum === 1 || estadoNum === 2;

  // 1º dígito verificador
  const pesos1 = [2, 3, 4, 5, 6, 7, 8, 9];
  const soma1 = seq.reduce((acc, d, i) => acc + d * pesos1[i], 0);
  const resto1 = soma1 % 11;
  let d1: number;
  if (isSPouMG) {
    if (resto1 === 0) d1 = 0;
    else if (resto1 === 1) d1 = 1;
    else d1 = 11 - resto1;
  } else {
    if (resto1 === 0) d1 = 1;
    else if (resto1 === 1) d1 = 1;
    else d1 = 11 - resto1;
  }
  // Segurança: se d1 >= 10, usar 0
  if (d1 >= 10) d1 = 0;

  // 2º dígito verificador
  const soma2 = dEstado[0] * 7 + dEstado[1] * 8 + d1 * 9;
  const resto2 = soma2 % 11;
  let d2: number;
  if (isSPouMG && resto2 === 0) d2 = 0;
  else if (resto2 >= 10) d2 = 0;
  else d2 = resto2;

  const numero = `${seq.join("")}${estadoCod}${d1}${d2}`;
  return `${numero.slice(0, 4)} ${numero.slice(4, 8)} ${numero.slice(8)}`;
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

export function GeradorTituloEleitor() {
  const [titulo, setTitulo] = useState<string>("");
  const [lista, setLista] = useState<string[]>([]);

  const handleGerar = () => {
    setTitulo(gerarTituloEleitor());
    setLista([]);
  };

  const handleGerar5 = () => {
    setLista(Array.from({ length: 5 }, gerarTituloEleitor));
    setTitulo("");
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Gerar Título de Eleitor</h2>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleGerar}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar Título de Eleitor
            </Button>
            <Button variant="outline" onClick={handleGerar5}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar 5 Títulos
            </Button>
          </div>

          {titulo && (
            <div className="bg-primary/10 rounded-lg p-4 font-mono text-xl text-center flex items-center justify-center gap-3">
              <span>{titulo}</span>
              <CopyButton text={titulo} />
            </div>
          )}

          {lista.length > 0 && (
            <div className="space-y-2">
              {lista.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border px-4 py-2 font-mono"
                >
                  <span>{t}</span>
                  <CopyButton text={t} />
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
