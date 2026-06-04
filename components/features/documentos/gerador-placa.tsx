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
    answer:
      "A placa antiga segue o formato ABC-1234 (3 letras + 4 números). A placa Mercosul, adotada no Brasil a partir de 2018, segue o formato ABC1D23 (3 letras + 1 número + 1 letra + 2 números), permitindo maior quantidade de combinações.",
  },
  {
    question: "Por que algumas letras são excluídas das placas?",
    answer:
      "As letras I, O e Q são proibidas nas placas brasileiras para evitar confusão visual com os números 1, 0 e o numeral em si. Isso garante melhor legibilidade nas leituras automáticas e humanas.",
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
    <ToolLayout tool={tool} faqs={faqs}>
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
