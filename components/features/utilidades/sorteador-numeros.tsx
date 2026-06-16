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
    answer: "O sorteio usa Math.random() do JavaScript, que é um gerador pseudoaleatório criptograficamente adequado para usos cotidianos como rifas, sorteios e jogos. Cada sorteio é independente dos anteriores — o histórico não influencia os próximos resultados. Para sorteios com validade legal ou fiscal, recomenda-se plataformas certificadas.",
  },
  {
    question: "O que significa 'sem repetição'?",
    answer: "Com a opção ativada, cada número pode aparecer apenas uma vez no resultado, como em uma loteria. Por exemplo, sortear 5 números entre 1 e 60 sem repetição garante 5 números distintos. O algoritmo usa o embaralhamento Fisher-Yates para garantir distribuição uniforme.",
  },
  {
    question: "Como usar o sorteador para uma rifa?",
    answer: "Configure o mínimo como 1 e o máximo como o número total de bilhetes (ex: 100). Defina a quantidade de números para o número de prêmios, ative 'sem repetição' para garantir que cada bilhete só seja sorteado uma vez. Salve os resultados antes de fechar a página, pois o histórico não é persistente.",
  },
  {
    question: "Posso sortear números para a Mega-Sena?",
    answer: "Sim! Configure mínimo: 1, máximo: 60, quantidade: 6, com 'sem repetição' ativado. Isso simula exatamente a geração de uma sequência para a Mega-Sena. Lembre-se que as chances de ganhar são de 1 em 50.063.860 — independente de como os números são escolhidos.",
  },
  {
    question: "Quantos números posso sortear de uma vez?",
    answer: "O limite é de 100 números por sorteio. Para sortear mais, faça múltiplas rodadas. Lembre-se que com 'sem repetição' o número de valores sorteados não pode ser maior que o intervalo disponível (máximo - mínimo + 1).",
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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O sorteador gera números aleatórios dentro de um intervalo definido. Com a opção "sem
            repetição" ativada, usa o algoritmo Fisher-Yates para embaralhar todos os números do
            intervalo e selecionar os primeiros N — garantindo distribuição uniforme e sem duplicatas,
            exatamente como uma loteria física.
          </p>
          <p>
            O histórico salva os últimos 5 sorteios da sessão para comparação. Configure mínimo,
            máximo e quantidade de números desejados. O limite de 100 números por sorteio garante
            desempenho rápido mesmo em intervalos grandes.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Configurações por finalidade</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Mega-Sena:</strong> mín 1, máx 60, qtd 6, sem repetição</li>
              <li>• <strong>Rifa de 100 bilhetes:</strong> mín 1, máx 100, qtd 1</li>
              <li>• <strong>Sorteio de equipes (20 pessoas):</strong> mín 1, máx 20, qtd 10</li>
              <li>• <strong>Dado de 6 lados:</strong> mín 1, máx 6, qtd 1</li>
            </ul>
          </div>
        </div>
      }
    >
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
