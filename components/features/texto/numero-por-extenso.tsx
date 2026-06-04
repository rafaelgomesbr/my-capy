"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { Copy, CheckCheck } from "lucide-react";

const tool = getToolBySlug("texto", "numero-por-extenso")!;

const faqs = [
  {
    question: "Até que valor o conversor funciona?",
    answer:
      "O conversor suporta números de até 999 bilhões (999.999.999.999), cobrindo a maioria dos casos de uso práticos como contratos, cheques e documentos financeiros.",
  },
  {
    question: "O conversor suporta valores com centavos?",
    answer:
      "Sim. Ao digitar um número decimal como 1234,56, o conversor retorna 'mil duzentos e trinta e quatro reais e cinquenta e seis centavos'.",
  },
  {
    question: "Para que serve converter número por extenso?",
    answer:
      "A escrita por extenso é obrigatória em cheques, contratos e documentos legais no Brasil para evitar fraudes e garantir clareza no valor expresso.",
  },
];

const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const centenas = ["", "cem", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

function centenasToExtenso(n: number): string {
  if (n === 0) return "";
  const c = Math.floor(n / 100);
  const resto = n % 100;

  let result = "";
  if (c > 0) {
    result = c === 1 && resto > 0 ? "cento" : centenas[c];
  }

  if (resto > 0) {
    const ext = resto < 20 ? unidades[resto] : `${dezenas[Math.floor(resto / 10)]}${resto % 10 > 0 ? " e " + unidades[resto % 10] : ""}`;
    result = result ? `${result} e ${ext}` : ext;
  }

  return result;
}

function inteiroToExtenso(n: number): string {
  if (n === 0) return "zero";

  const grupos: string[] = [];
  const bilhoes = Math.floor(n / 1_000_000_000);
  const milhoes = Math.floor((n % 1_000_000_000) / 1_000_000);
  const milhares = Math.floor((n % 1_000_000) / 1_000);
  const resto = n % 1_000;

  if (bilhoes > 0) {
    grupos.push(`${centenasToExtenso(bilhoes)} ${bilhoes === 1 ? "bilhão" : "bilhões"}`);
  }
  if (milhoes > 0) {
    grupos.push(`${centenasToExtenso(milhoes)} ${milhoes === 1 ? "milhão" : "milhões"}`);
  }
  if (milhares > 0) {
    grupos.push(milhares === 1 ? "mil" : `${centenasToExtenso(milhares)} mil`);
  }
  if (resto > 0) {
    grupos.push(centenasToExtenso(resto));
  }

  return grupos.join(" e ");
}

function numeroToExtenso(input: string): string {
  const cleaned = input.replace(",", ".").replace(/[^0-9.-]/g, "");
  if (!cleaned || isNaN(Number(cleaned))) return "";

  const negativo = cleaned.startsWith("-");
  const abs = Math.abs(Number(cleaned));

  if (abs > 999_999_999_999) return "Número muito grande (máx. 999 bilhões)";

  const partes = cleaned.replace("-", "").split(".");
  const inteiro = parseInt(partes[0] || "0", 10);
  const centavosStr = partes[1] ? partes[1].substring(0, 2).padEnd(2, "0") : "00";
  const centavos = parseInt(centavosStr, 10);

  const temInteiro = inteiro > 0;
  const temCentavos = centavos > 0;

  let resultado = "";

  if (!temInteiro && !temCentavos) return "zero reais";

  if (temInteiro) {
    const ext = inteiroToExtenso(inteiro);
    resultado += `${ext} ${inteiro === 1 ? "real" : "reais"}`;
  }

  if (temCentavos) {
    const extCentavos = inteiroToExtenso(centavos);
    if (temInteiro) resultado += " e ";
    resultado += `${extCentavos} ${centavos === 1 ? "centavo" : "centavos"}`;
  }

  if (negativo) resultado = "menos " + resultado;

  return resultado.charAt(0).toUpperCase() + resultado.slice(1);
}

export function NumeroPorExtenso() {
  const [valor, setValor] = useState("");
  const [copied, setCopied] = useState(false);
  const extenso = numeroToExtenso(valor);

  const handleCopy = () => {
    if (!extenso) return;
    navigator.clipboard.writeText(extenso);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numero-input">Número (use vírgula ou ponto para decimais)</Label>
            <Input
              id="numero-input"
              type="text"
              placeholder="Ex: 1234,56 ou -500 ou 1000000"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>

          {extenso && (
            <div className="rounded-lg bg-primary/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-lg font-semibold leading-relaxed text-primary">{extenso}</p>
                <Button variant="ghost" size="icon" onClick={handleCopy} title="Copiar" className="shrink-0">
                  {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
