"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

function TextTransformer({
  toolSlug,
  category,
  transform,
  placeholder,
  buttonLabel,
  faqs,
}: {
  toolSlug: string;
  category: string;
  transform: (text: string) => string;
  placeholder: string;
  buttonLabel: string;
  faqs: { question: string; answer: string }[];
}) {
  const tool = getToolBySlug(category, toolSlug)!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleTransform = useCallback(() => {
    setOutput(transform(input));
  }, [input, transform]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`input-${toolSlug}`}>Texto de entrada</Label>
            <textarea
              id={`input-${toolSlug}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>
          <Button onClick={handleTransform} className="w-full">{buttonLabel}</Button>
          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Resultado</Label>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2 h-8">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
              <div className="min-h-[140px] w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm whitespace-pre-wrap break-words">
                {output}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function RemoverEspacos() {
  return (
    <TextTransformer
      toolSlug="remover-espacos"
      category="texto"
      transform={(t) => t.replace(/[ \t]+/g, " ").trim()}
      placeholder="Cole o texto com espaços extras aqui..."
      buttonLabel="Remover Espaços Extras"
      faqs={[{ question: "Que tipo de espaços são removidos?", answer: "São removidos espaços duplos, espaços antes e depois do texto e tabs. Quebras de linha são mantidas." }]}
    />
  );
}

export function RemoverLinhasVazias() {
  return (
    <TextTransformer
      toolSlug="remover-linhas-vazias"
      category="texto"
      transform={(t) => t.split("\n").filter((l) => l.trim() !== "").join("\n")}
      placeholder="Cole o texto com linhas vazias aqui..."
      buttonLabel="Remover Linhas Vazias"
      faqs={[{ question: "Linhas com espaços são consideradas vazias?", answer: "Sim, linhas que contém apenas espaços ou tabs também são removidas." }]}
    />
  );
}

export function Maiusculas() {
  return (
    <TextTransformer
      toolSlug="maiusculas"
      category="texto"
      transform={(t) => t.toUpperCase()}
      placeholder="Digite o texto para converter..."
      buttonLabel="Converter para MAIÚSCULAS"
      faqs={[{ question: "Funciona com acentos?", answer: "Sim, a conversão funciona corretamente com letras acentuadas do português como ã, é, ç, etc." }]}
    />
  );
}

export function Minusculas() {
  return (
    <TextTransformer
      toolSlug="minusculas"
      category="texto"
      transform={(t) => t.toLowerCase()}
      placeholder="Digite o texto para converter..."
      buttonLabel="Converter para minúsculas"
      faqs={[{ question: "Funciona com acentos?", answer: "Sim, a conversão funciona corretamente com letras acentuadas." }]}
    />
  );
}

export function CapitalizarTexto() {
  return (
    <TextTransformer
      toolSlug="capitalizar-texto"
      category="texto"
      transform={(t) =>
        t.replace(/\b\w/g, (c) => c.toUpperCase())
      }
      placeholder="Digite o texto para capitalizar..."
      buttonLabel="Capitalizar Texto"
      faqs={[{ question: "O que é Title Case?", answer: "Title Case (ou capitalização) é quando a primeira letra de cada palavra é maiúscula." }]}
    />
  );
}

export function InverterTexto() {
  return (
    <TextTransformer
      toolSlug="inverter-texto"
      category="texto"
      transform={(t) => t.split("").reverse().join("")}
      placeholder="Digite o texto para inverter..."
      buttonLabel="Inverter Texto"
      faqs={[{ question: "É possível inverter as palavras ao invés dos caracteres?", answer: "Esta ferramenta inverte os caracteres. Para inverter a ordem das palavras, use a ferramenta de ordenar linhas." }]}
    />
  );
}

export function OrdenarLinhas() {
  return (
    <TextTransformer
      toolSlug="ordenar-linhas"
      category="texto"
      transform={(t) =>
        t
          .split("\n")
          .sort((a, b) => a.localeCompare(b, "pt-BR"))
          .join("\n")
      }
      placeholder="Uma linha por item para ordenar..."
      buttonLabel="Ordenar Linhas Alfabeticamente"
      faqs={[{ question: "A ordenação considera acentos?", answer: "Sim, a ordenação usa o algoritmo de comparação de string brasileiro (pt-BR), que lida corretamente com acentos." }]}
    />
  );
}

export function RemoverDuplicados() {
  return (
    <TextTransformer
      toolSlug="remover-duplicados"
      category="texto"
      transform={(t) => {
        const lines = t.split("\n");
        const seen = new Set<string>();
        return lines.filter((l) => {
          const trimmed = l.trim();
          if (seen.has(trimmed)) return false;
          seen.add(trimmed);
          return true;
        }).join("\n");
      }}
      placeholder="Cole uma lista com linhas duplicadas..."
      buttonLabel="Remover Linhas Duplicadas"
      faqs={[{ question: "A comparação é case-sensitive?", answer: "A remoção de duplicatas é case-insensitive após o trim — 'Item' e 'item' são tratados como iguais." }]}
    />
  );
}
