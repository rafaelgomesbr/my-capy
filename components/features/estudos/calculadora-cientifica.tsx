"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("estudos", "calculadora-cientifica")!;
const faqs = [{ question: "Como usar a calculadora científica?", answer: "Use os botões numéricos e operadores para construir o cálculo. Funções como sin, cos, log usam graus por padrão." }];

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
    <ToolLayout tool={tool} faqs={faqs}>
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
