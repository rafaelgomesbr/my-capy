"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { Shuffle } from "lucide-react";

const tool = getToolBySlug("utilidades", "sorteador-numeros")!;

const faqs = [
  {
    question: "O sorteio é realmente aleatório?",
    answer:
      "O sorteio usa Math.random() do JavaScript, que é um gerador pseudoaleatório criptograficamente adequado para usos cotidianos como rifas, sorteios e jogos. Para sorteios com validade legal, recomenda-se plataformas certificadas.",
  },
  {
    question: "O que significa 'sem repetição'?",
    answer:
      "Com a opção ativada, cada número pode aparecer apenas uma vez no resultado, como em uma loteria. Por exemplo, sortear 5 números entre 1 e 10 sem repetição garante 5 números distintos.",
  },
];

interface Sorteio {
  numeros: number[];
  min: number;
  max: number;
  semRepeticao: boolean;
}

export function SorteadorNumeros() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [qtd, setQtd] = useState("1");
  const [semRepeticao, setSemRepeticao] = useState(false);
  const [resultado, setResultado] = useState<number[]>([]);
  const [historico, setHistorico] = useState<Sorteio[]>([]);
  const [erro, setErro] = useState("");

  const handleSortear = () => {
    const minN = parseInt(min, 10);
    const maxN = parseInt(max, 10);
    const qtdN = Math.min(parseInt(qtd, 10), 100);

    if (isNaN(minN) || isNaN(maxN) || minN >= maxN) {
      setErro("O valor mínimo deve ser menor que o máximo.");
      return;
    }
    if (isNaN(qtdN) || qtdN < 1) {
      setErro("Informe uma quantidade válida.");
      return;
    }
    const range = maxN - minN + 1;
    if (semRepeticao && qtdN > range) {
      setErro(`Não é possível sortear ${qtdN} números sem repetição em um intervalo de ${range}.`);
      return;
    }

    setErro("");
    let numeros: number[];

    if (semRepeticao) {
      const pool = Array.from({ length: range }, (_, i) => i + minN);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      numeros = pool.slice(0, qtdN).sort((a, b) => a - b);
    } else {
      numeros = Array.from({ length: qtdN }, () => Math.floor(Math.random() * range) + minN);
    }

    setResultado(numeros);
    setHistorico((prev) => [{ numeros, min: minN, max: maxN, semRepeticao }, ...prev].slice(0, 5));
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="min-input">Mínimo</Label>
                <Input id="min-input" type="number" value={min} onChange={(e) => setMin(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-input">Máximo</Label>
                <Input id="max-input" type="number" value={max} onChange={(e) => setMax(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qtd-input">Quantidade (máx. 100)</Label>
                <Input id="qtd-input" type="number" min={1} max={100} value={qtd} onChange={(e) => setQtd(e.target.value)} />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={semRepeticao}
                onChange={(e) => setSemRepeticao(e.target.checked)}
                className="rounded border-input"
              />
              <span className="text-sm">Sem repetição</span>
            </label>

            {erro && <p className="text-sm text-destructive">{erro}</p>}

            <Button onClick={handleSortear}>
              <Shuffle className="mr-2 h-4 w-4" />
              Sortear
            </Button>

            {resultado.length > 0 && (
              <div>
                {resultado.length === 1 ? (
                  <div className="rounded-lg bg-primary/10 p-8 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Número sorteado</p>
                    <p className="text-7xl font-bold text-primary">{resultado[0]}</p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-primary/10 p-4">
                    <p className="text-xs text-muted-foreground mb-3">Números sorteados</p>
                    <div className="flex flex-wrap gap-2">
                      {resultado.map((n, i) => (
                        <span key={i} className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg w-12 h-12">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {historico.length > 1 && (
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold text-sm">Histórico recente</h3>
              <div className="space-y-2">
                {historico.slice(1).map((h, i) => (
                  <div key={i} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                    <span className="text-muted-foreground">
                      [{h.min}–{h.max}]{h.semRepeticao ? " s/rep" : ""}
                    </span>
                    <span className="font-mono font-medium">{h.numeros.join(", ")}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
