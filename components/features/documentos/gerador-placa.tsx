"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { Copy, CheckCheck, RefreshCw } from "lucide-react";

const tool = getToolBySlug("documentos", "gerador-placa")!;

const faqs = [
  {
    question: "Qual a diferença entre a placa antiga e a placa Mercosul?",
    answer: "A placa antiga segue o formato ABC-1234 (3 letras + 4 números). A placa Mercosul, adotada no Brasil a partir de 2018, segue o formato ABC1D23 (3 letras + 1 número + 1 letra + 2 números). O novo formato amplia o universo de combinações e é obrigatório para veículos novos e em casos de transferência de estado.",
  },
  {
    question: "Por que algumas letras são excluídas das placas?",
    answer: "As letras I, O e Q são proibidas nas placas brasileiras para evitar confusão visual com os números 1, 0 e o próprio Q (que pode ser confundido com O+cauda). Isso garante melhor legibilidade nas câmeras de leitura automática de placas (OCR) e na leitura humana à distância.",
  },
  {
    question: "Posso saber o estado de origem pela placa?",
    answer: "Com o formato antigo, sim — as letras indicam o estado de emplacamento (ex: AAA a GWZ = São Paulo; GAA a HZZ = Rio de Janeiro). Com o formato Mercosul, a correspondência tornou-se mais complexa. De qualquer forma, veículos transferidos para outros estados mantêm a placa original e podem não refletir o estado atual.",
  },
  {
    question: "Para que serve o gerador de placas?",
    answer: "É usado por desenvolvedores para testar campos de placa em formulários de cadastro de veículos, sistemas de estacionamento, aplicativos de locadoras, portais de despachantes e software de gestão de frotas. Gerar placas fictícias evita o uso de dados reais de terceiros.",
  },
  {
    question: "O Brasil tem quantas combinações possíveis de placas Mercosul?",
    answer: "O formato Mercosul (ABC1D23) permite: 23³ × 10 × 23 × 10² = ~277 milhões de combinações, contra os ~17 milhões do formato antigo. Isso foi necessário pois o Brasil registra mais de 100 milhões de veículos e o formato antigo estaria se esgotando em alguns estados.",
  },
];

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

const LETRAS_PERMITIDAS = "ABCDEFGHJKLMNPRSTUVWXYZ".split("");

function randomLetter(): string {
  return LETRAS_PERMITIDAS[Math.floor(Math.random() * LETRAS_PERMITIDAS.length)];
}

function gerarPlacaAntiga(): string {
  const letras = `${randomLetter()}${randomLetter()}${randomLetter()}`;
  const numeros = `${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}`;
  return `${letras}-${numeros}`;
}

function gerarPlacaMercosul(): string {
  const letras = `${randomLetter()}${randomLetter()}${randomLetter()}`;
  const n1 = randomDigit();
  const letraMeio = randomLetter();
  const n2 = randomDigit();
  const n3 = randomDigit();
  return `${letras}${n1}${letraMeio}${n2}${n3}`;
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

type Formato = "antigo" | "mercosul";

export function GeradorPlaca() {
  const [formato, setFormato] = useState<Formato>("antigo");
  const [placa, setPlaca] = useState<string>("");
  const [lista, setLista] = useState<string[]>([]);

  const gerarFn = () => (formato === "antigo" ? gerarPlacaAntiga() : gerarPlacaMercosul());

  const handleGerar = () => {
    setPlaca(gerarFn());
    setLista([]);
  };

  const handleGerar5 = () => {
    setLista(Array.from({ length: 5 }, gerarFn));
    setPlaca("");
  };

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador cria placas nos dois formatos brasileiros: o antigo (ABC-1234: 3 letras + hífen +
            4 dígitos) e o Mercosul (ABC1D23: 3 letras + 1 dígito + 1 letra + 2 dígitos). As letras
            I, O e Q são automaticamente excluídas para seguir a norma do DENATRAN, evitando confusão
            com os números 1, 0 e outras letras.
          </p>
          <p>
            Diferente do CPF e CNPJ, placas de veículos não têm dígito verificador matemático —
            elas são registradas em sequência pelo órgão de trânsito. O gerador cria combinações
            aleatórias dentro das regras de caracteres permitidos para cada formato.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplos por formato</p>
            <ul className="mt-2 space-y-1 font-mono text-sm text-muted-foreground">
              <li>• <strong>Antigo:</strong> ABC-1234, MNT-7890</li>
              <li>• <strong>Mercosul:</strong> ABC1D23, XYZ4E56</li>
              <li>• Letras I, O, Q são sempre excluídas</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Gerar Placa de Veículo</h2>

          <div className="space-y-2">
            <Label>Formato da placa</Label>
            <div className="flex gap-3">
              <Button
                variant={formato === "antigo" ? "default" : "outline"}
                onClick={() => setFormato("antigo")}
              >
                Antigo (ABC-1234)
              </Button>
              <Button
                variant={formato === "mercosul" ? "default" : "outline"}
                onClick={() => setFormato("mercosul")}
              >
                Mercosul (ABC1D23)
              </Button>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleGerar}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar Placa
            </Button>
            <Button variant="outline" onClick={handleGerar5}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar 5 Placas
            </Button>
          </div>

          {placa && (
            <div className="bg-primary/10 rounded-lg p-4 font-mono text-xl text-center flex items-center justify-center gap-3">
              <span className="tracking-widest">{placa}</span>
              <CopyButton text={placa} />
            </div>
          )}

          {lista.length > 0 && (
            <div className="space-y-2">
              {lista.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border px-4 py-2 font-mono"
                >
                  <span className="tracking-widest">{p}</span>
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
