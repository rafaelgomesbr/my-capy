"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getToolBySlug } from "@/lib/tools";

const faqsEscolar = [
  { question: "Qual a média para aprovação?", answer: "A média mínima para aprovação varia por escola: 6,0 é o mais comum no Brasil, mas algumas instituições usam 5,0 ou 7,0. Esta calculadora usa 6,0 como padrão. Verifique o regimento da sua instituição." },
  { question: "Como calcular a média aritmética simples?", answer: "Some todas as notas e divida pela quantidade de notas. Ex: (7 + 8 + 6 + 9) / 4 = 30 / 4 = 7,5. É a média mais simples e comum." },
  { question: "O que acontece se deixar campos em branco?", answer: "A calculadora ignora campos vazios e calcula a média apenas com as notas preenchidas. Útil quando você ainda não tem todas as notas do bimestre." },
  { question: "Qual nota preciso na prova final para ser aprovado?", answer: "Se sua média atual for M e você precisa de média mínima X: a nota necessária na final depende do peso da prova final. Se a final vale 50%, precisa de nota F onde (M + F) / 2 ≥ X → F ≥ 2X - M." },
  { question: "Posso adicionar pesos diferentes para cada nota?", answer: "Para notas com pesos diferentes, use a calculadora de Média Ponderada. A média escolar simples dá peso igual a todas as notas." },
];

const faqsPonderada = [
  { question: "Como calcular a média ponderada?", answer: "Multiplique cada nota pelo seu peso, some todos os resultados e divida pela soma dos pesos. Ex: (7×2 + 8×3 + 9×5) / (2+3+5) = (14+24+45) / 10 = 83/10 = 8,3." },
  { question: "Por que usar média ponderada?", answer: "A média ponderada é usada quando algumas avaliações têm mais importância que outras. Ex: uma prova final com peso 4 e dois trabalhos com peso 2 cada. A nota final da prova influencia mais no resultado." },
  { question: "Qual a diferença entre média simples e ponderada?", answer: "Na média simples, todas as notas têm o mesmo peso. Na ponderada, cada nota tem um peso diferente. Se todos os pesos forem iguais, a média ponderada é igual à média simples." },
  { question: "Como usar pesos fracionários?", answer: "Os pesos podem ser decimais: peso 0,5 significa que aquela nota vale metade de uma com peso 1. Esta calculadora aceita qualquer valor numérico positivo como peso." },
  { question: "Qual é o peso que devo colocar?", answer: "Use o mesmo valor de peso que consta no plano de avaliação da disciplina. Se a prova vale 60% e trabalhos 40%, use pesos 3 e 2 (ou 0,6 e 0,4 — o resultado é o mesmo)." },
];

export function MediaEscolar() {
  const tool = getToolBySlug("estudos", "media-escolar")!;
  const [notas, setNotas] = useState(["", "", "", ""]);
  const [media, setMedia] = useState<number | null>(null);
  const mediaMinima = 6;

  const calcular = useCallback(() => {
    const ns = notas.map((n) => parseFloat(n.replace(",", "."))).filter((n) => !isNaN(n) && n >= 0 && n <= 10);
    if (ns.length === 0) return;
    setMedia(ns.reduce((a, b) => a + b, 0) / ns.length);
  }, [notas]);

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsEscolar}
      explanation={
        <div className="space-y-3">
          <p>
            A calculadora de média escolar soma as notas fornecidas e divide pelo número de notas válidas
            (ignorando campos em branco). O resultado é exibido com indicação visual de aprovação ou
            reprovação com base no limite configurado de 6,0.
          </p>
          <p>
            É útil para acompanhar o desempenho ao longo do período letivo, estimar a situação antes das
            provas finais, ou verificar se um aluno precisa de recuperação. Para sistemas com pesos
            diferentes por prova, use a calculadora de Média Ponderada.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: 4 bimestres</p>
            <p className="mt-1 text-sm text-muted-foreground">Notas: 7,0 | 6,5 | 8,0 | 5,5</p>
            <p className="mt-2 text-sm text-primary font-semibold">Média = (7+6,5+8+5,5)/4 = 27/4 = 6,75 ✓ Aprovado</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Qual nota preciso na 4ª prova para passar?</p>
            <p className="mt-1 text-sm text-muted-foreground">Notas: 5,0 | 6,0 | 5,5 | ? → preciso de média 6,0</p>
            <p className="mt-2 text-sm text-primary font-semibold">Nota mínima na 4ª = 6×4 - (5+6+5,5) = 24 - 16,5 = 7,5</p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {notas.map((n, i) => (
              <div key={i} className="space-y-2">
                <Label htmlFor={`nota-${i}`}>{i + 1}ª Nota</Label>
                <Input id={`nota-${i}`} type="number" placeholder="0-10" value={n} min="0" max="10" step="0.1"
                  onChange={(e) => { const ns = [...notas]; ns[i] = e.target.value; setNotas(ns); }} />
              </div>
            ))}
          </div>
          <Button onClick={calcular} className="w-full">Calcular Média</Button>
          {media !== null && (
            <div className={`rounded-lg p-6 text-center ${media >= mediaMinima ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-red-50 dark:bg-red-950/40"}`}>
              <p className="text-sm text-muted-foreground">Média</p>
              <p className={`mt-2 text-4xl font-bold ${media >= mediaMinima ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{media.toFixed(1)}</p>
              <Badge className="mt-3" variant={media >= mediaMinima ? "default" : "destructive"}>
                {media >= mediaMinima ? "✓ Aprovado" : "✗ Reprovado"}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function MediaPonderada() {
  const tool = getToolBySlug("estudos", "media-ponderada")!;
  const [itens, setItens] = useState([{ nota: "", peso: "" }, { nota: "", peso: "" }]);
  const [result, setResult] = useState<number | null>(null);

  const addItem = () => setItens([...itens, { nota: "", peso: "" }]);
  const calcular = useCallback(() => {
    const valid = itens.filter((i) => i.nota && i.peso && !isNaN(parseFloat(i.nota)) && !isNaN(parseFloat(i.peso)));
    if (valid.length === 0) return;
    const totalPeso = valid.reduce((s, i) => s + parseFloat(i.peso), 0);
    const totalPonderado = valid.reduce((s, i) => s + parseFloat(i.nota) * parseFloat(i.peso), 0);
    setResult(totalPonderado / totalPeso);
  }, [itens]);

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsPonderada}
      explanation={
        <div className="space-y-3">
          <p>
            A média ponderada multiplica cada nota pelo seu respectivo peso, soma os produtos e divide
            pela soma total dos pesos: <strong>M = Σ(nota × peso) / Σ(pesos)</strong>. É o tipo de
            média mais usado em faculdades, concursos e sistemas de avaliação onde provas têm
            importâncias diferentes.
          </p>
          <p>
            Ao contrário da média aritmética simples, a ponderada considera que uma prova final com
            peso 4 tem mais impacto no resultado do que um trabalho com peso 1. Adicione quantas
            notas precisar usando o botão {"\"+ Adicionar nota\""}.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Sistema de pesos típico de faculdade</p>
            <p className="mt-1 text-sm text-muted-foreground">Prova 1 (peso 3): 7,0 | Prova 2 (peso 3): 8,0 | Trabalho (peso 2): 9,0 | Prova Final (peso 4): 6,0</p>
            <p className="mt-2 text-sm text-primary font-semibold">M = (21+24+18+24) / (3+3+2+4) = 87/12 = 7,25</p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            {itens.map((item, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor={`n-mp-${i}`} className="text-xs">Nota {i + 1}</Label>
                  <Input id={`n-mp-${i}`} type="number" placeholder="0-10" min="0" max="10" step="0.1" value={item.nota}
                    onChange={(e) => { const ns = [...itens]; ns[i].nota = e.target.value; setItens(ns); }} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`p-mp-${i}`} className="text-xs">Peso {i + 1}</Label>
                  <Input id={`p-mp-${i}`} type="number" placeholder="Ex: 2" min="0" step="0.5" value={item.peso}
                    onChange={(e) => { const ns = [...itens]; ns[i].peso = e.target.value; setItens(ns); }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={addItem} className="flex-1">+ Adicionar nota</Button>
            <Button onClick={calcular} className="flex-1">Calcular</Button>
          </div>
          {result !== null && (
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">Média Ponderada</p>
              <p className="mt-2 text-4xl font-bold text-primary">{result.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
