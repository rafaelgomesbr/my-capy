"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("estudos", "calculadora-cientifica")!;
const faqs = [
  { question: "Como usar a calculadora científica?", answer: "Use os botões numéricos e operadores para construir o cálculo. Funções como sin, cos, log são aplicadas ao valor exibido no display. Pressione AC para limpar tudo ou ⌫ para apagar o último dígito." },
  { question: "As funções trigonométricas usam graus ou radianos?", answer: "Esta calculadora usa graus por padrão — sin(30) = 0,5, cos(60) = 0,5, tan(45) = 1. Se precisar calcular em radianos, converta primeiro: 1 radiano = 180/π ≈ 57,296 graus." },
  { question: "O que é log e ln?", answer: "log é o logaritmo na base 10 (log₁₀). ln é o logaritmo natural (base e ≈ 2,71828). log(100) = 2 (porque 10² = 100). ln(e) = 1. ln é mais usado em física e matemática; log é usado em química (pH) e engenharia." },
  { question: "O que faz o botão 1/x?", answer: "Calcula o inverso (recíproco) do número no display: 1/x. Ex: 1/x de 4 = 0,25; 1/x de 0,5 = 2. É útil para calcular resistência elétrica em paralelo e outras fórmulas com recíprocos." },
  { question: "Qual a precisão da calculadora?", answer: "A calculadora usa o ponto flutuante de 64 bits do JavaScript (IEEE 754), com precisão de aproximadamente 15-17 dígitos significativos. Para cálculos científicos de alta precisão, use software especializado como Python ou MATLAB." },
];

const DEG_TO_RAD = Math.PI / 180;

export function CalculadoraCientifica() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [isNewInput, setIsNewInput] = useState(true);

  const handleNumber = useCallback((n: string) => {
    if (isNewInput) { setDisplay(n); setIsNewInput(false); }
    else setDisplay(display === "0" ? n : display + n);
  }, [display, isNewInput]);

  const handleOp = useCallback((op: string) => {
    setExpression(display + " " + op + " ");
    setIsNewInput(true);
  }, [display]);

  const handleScientific = useCallback((fn: string) => {
    const v = parseFloat(display);
    let result: number;
    switch (fn) {
      case "sin": result = Math.sin(v * DEG_TO_RAD); break;
      case "cos": result = Math.cos(v * DEG_TO_RAD); break;
      case "tan": result = Math.tan(v * DEG_TO_RAD); break;
      case "log": result = Math.log10(v); break;
      case "ln": result = Math.log(v); break;
      case "sqrt": result = Math.sqrt(v); break;
      case "x²": result = v * v; break;
      case "1/x": result = 1 / v; break;
      case "±": result = -v; break;
      default: return;
    }
    setDisplay(isFinite(result) ? result.toPrecision(10).replace(/\.?0+$/, "") : "Erro");
    setIsNewInput(true);
  }, [display]);

  const handleEquals = useCallback(() => {
    try {
      const expr = expression + display;
      const result = Function('"use strict"; return (' + expr.replace(/÷/g, "/").replace(/×/g, "*") + ")")();
      setDisplay(isFinite(result) ? result.toPrecision(10).replace(/\.?0+$/, "") : "Erro");
      setExpression("");
      setIsNewInput(true);
    } catch { setDisplay("Erro"); }
  }, [expression, display]);

  const handleDot = () => { if (!display.includes(".")) { setDisplay(display + "."); setIsNewInput(false); } };
  const handleClear = () => { setDisplay("0"); setExpression(""); setIsNewInput(true); };
  const handleBackspace = () => { setDisplay(display.length > 1 ? display.slice(0, -1) : "0"); };

  const btnClass = "h-11 rounded-lg text-sm font-medium transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A calculadora científica realiza operações aritméticas básicas (+, -, ×, ÷) e funções
            científicas: seno, cosseno, tangente (em graus), logaritmo base 10 (log), logaritmo natural
            (ln), raiz quadrada (√), quadrado (x²) e inverso (1/x). O ± inverte o sinal do número no display.
          </p>
          <p>
            O cálculo é realizado no navegador usando a API matemática do JavaScript. As operações são
            encadeadas digitando o primeiro número, o operador e o segundo número antes de pressionar =.
            Funções científicas são aplicadas imediatamente ao valor atual do display.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplos de operações</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• sin(30°) = 0,5</li>
              <li>• cos(60°) = 0,5</li>
              <li>• log(1000) = 3</li>
              <li>• √(144) = 12</li>
              <li>• 7² = 49</li>
              <li>• ln(e) ≈ 1 (use 2,71828)</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card className="mx-auto max-w-sm">
        <CardContent className="p-4 space-y-3">
          <div className="rounded-lg bg-muted/50 p-3 text-right">
            <p className="h-5 text-xs text-muted-foreground">{expression}</p>
            <p className="text-3xl font-mono font-bold truncate">{display}</p>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {/* Scientific row */}
            {[["sin","violet"],["cos","violet"],["tan","violet"],["log","violet"]].map(([fn, color]) => (
              <button key={fn} onClick={() => handleScientific(fn)} className={`${btnClass} bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300`}>{fn}</button>
            ))}
            {[["ln","violet"],["√","violet"],["x²","violet"],["1/x","violet"]].map(([fn]) => (
              <button key={fn} onClick={() => handleScientific(fn === "√" ? "sqrt" : fn === "x²" ? "x²" : "1/x")} className={`${btnClass} bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300`}>{fn}</button>
            ))}
            {/* Control row */}
            <button onClick={handleClear} className={`${btnClass} bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300`}>AC</button>
            <button onClick={() => handleScientific("±")} className={`${btnClass} bg-muted`}>±</button>
            <button onClick={handleBackspace} className={`${btnClass} bg-muted`}>⌫</button>
            <button onClick={() => handleOp("÷")} className={`${btnClass} bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300`}>÷</button>
            {/* Numbers */}
            {["7","8","9"].map((n) => <button key={n} onClick={() => handleNumber(n)} className={`${btnClass} bg-background border`}>{n}</button>)}
            <button onClick={() => handleOp("×")} className={`${btnClass} bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300`}>×</button>
            {["4","5","6"].map((n) => <button key={n} onClick={() => handleNumber(n)} className={`${btnClass} bg-background border`}>{n}</button>)}
            <button onClick={() => handleOp("-")} className={`${btnClass} bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300`}>-</button>
            {["1","2","3"].map((n) => <button key={n} onClick={() => handleNumber(n)} className={`${btnClass} bg-background border`}>{n}</button>)}
            <button onClick={() => handleOp("+")} className={`${btnClass} bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300`}>+</button>
            <button onClick={() => handleNumber("0")} className={`${btnClass} col-span-2 bg-background border`}>0</button>
            <button onClick={handleDot} className={`${btnClass} bg-background border`}>.</button>
            <button onClick={handleEquals} className={`${btnClass} bg-primary text-primary-foreground`}>=</button>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
