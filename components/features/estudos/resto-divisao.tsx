"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("estudos", "resto-divisao")!;

const faqs = [
  {
    question: "O que é o resto da divisão (módulo)?",
    answer:
      "O resto da divisão é o valor que sobra após dividir um número por outro sem fração. Na expressão 17 ÷ 5, o quociente é 3 e o resto é 2, pois 5 × 3 = 15 e 17 - 15 = 2. A operação módulo (%) retorna esse valor.",
  },
  {
    question: "Para que serve o módulo em programação?",
    answer:
      "O módulo é amplamente usado para verificar divisibilidade (resto = 0), gerar sequências cíclicas, implementar criptografia (RSA, hashing), verificar paridade (par/ímpar) e calcular o dígito verificador de CPF, CNPJ e cartões.",
  },
  {
    question: "O que acontece com dividendo negativo?",
    answer:
      "Em matemática, o resto é sempre não-negativo. Em algumas linguagens de programação, o resultado do módulo com negativos pode variar. Esta ferramenta segue a convenção matemática padrão.",
  },
];

export function RestoDivisao() {
  const [dividendo, setDividendo] = useState("");
  const [divisor, setDivisor] = useState("");

  const a = parseFloat(dividendo);
  const b = parseFloat(divisor);
  const valido = !isNaN(a) && !isNaN(b) && b !== 0 && Number.isInteger(a) && Number.isInteger(b);
  const quociente = valido ? Math.trunc(a / b) : null;
  const resto = valido ? a - b * Math.trunc(a / b) : null;

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A operação de resto da divisão (módulo, operador <code className="rounded bg-muted px-1 font-mono text-xs">%</code>)
            retorna o que sobra após a divisão inteira. Para a ÷ b: quociente = Math.trunc(a/b) e
            resto = a - b × quociente. A ferramenta exibe os três resultados juntos (quociente, resto
            e indicação de divisibilidade) para máxima utilidade.
          </p>
          <p>
            O módulo é um dos operadores mais úteis na programação: verifica paridade (n % 2 === 0 → par),
            implementa ciclos (index % length → acesso circular), verifica divisibilidade por qualquer número,
            e é fundamental em criptografia, geração de hashes e dígitos verificadores.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Aplicações práticas</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• 17 ÷ 5 = quociente 3, resto 2 (17 = 5×3 + 2)</li>
              <li>• Verificar par: 24 % 2 = 0 → par</li>
              <li>• Verificar ímpar: 37 % 2 = 1 → ímpar</li>
              <li>• Dígito verificador CPF usa módulo 11</li>
              <li>• 100 ÷ 7 = quociente 14, resto 2</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dividendo-input">Dividendo</Label>
              <Input
                id="dividendo-input"
                type="number"
                placeholder="Ex: 17"
                value={dividendo}
                onChange={(e) => setDividendo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="divisor-input">Divisor</Label>
              <Input
                id="divisor-input"
                type="number"
                placeholder="Ex: 5"
                value={divisor}
                onChange={(e) => setDivisor(e.target.value)}
              />
            </div>
          </div>

          {dividendo && divisor && b === 0 && (
            <p className="text-sm text-destructive">Divisão por zero não é permitida.</p>
          )}

          {dividendo && divisor && !isNaN(a) && !isNaN(b) && b !== 0 && (!Number.isInteger(a) || !Number.isInteger(b)) && (
            <p className="text-sm text-destructive">Digite apenas números inteiros.</p>
          )}

          {valido && quociente !== null && resto !== null && (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Quociente inteiro</p>
                  <p className="mt-1 text-3xl font-bold text-primary">{quociente}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Resto</p>
                  <p className="mt-1 text-3xl font-bold">{resto}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground">É divisível?</p>
                  <p className={`mt-1 text-2xl font-bold ${resto === 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {resto === 0 ? "Sim" : "Não"}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border px-4 py-3 font-mono text-center text-sm">
                {a} = {b} × {quociente} + {resto}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
