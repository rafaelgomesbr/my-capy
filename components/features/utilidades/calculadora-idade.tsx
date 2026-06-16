"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("utilidades", "calculadora-idade")!;
const faqs = [
  { question: "Como é calculada a idade exata?", answer: "A idade é calculada em anos, meses e dias completos desde a data de nascimento até a data atual. O cálculo considera os diferentes números de dias em cada mês e os anos bissextos (29 de fevereiro)." },
  { question: "O que são anos bissextos e como afetam a idade?", answer: "Anos bissextos têm 366 dias (fevereiro com 29 dias) e ocorrem a cada 4 anos, exceto anos centenários (como 1900) que não são divisíveis por 400. Quem nasce em 29/02 tecnicamente faz aniversário apenas em anos bissextos; em outros anos, costuma-se comemorar em 28/02 ou 01/03." },
  { question: "Para que serve saber quantos dias de vida tenho?", answer: "Além de curiosidade, o total de dias vividos é útil para cálculos de benefícios previdenciários (o INSS considera 'tempo de contribuição' em dias), para contratos de seguros de vida, e em aplicações médicas onde a idade precisa em dias é relevante (especialmente para recém-nascidos e crianças pequenas)." },
  { question: "Como calcular a idade para fins previdenciários no Brasil?", answer: "O INSS considera o tempo de contribuição completo, incluindo meses e dias. A aposentadoria por tempo de contribuição exige 35 anos para homens e 30 para mulheres (ou as novas regras da Reforma da Previdência de 2019). Esta calculadora mostra anos, meses e dias para facilitar esse controle." },
  { question: "A calculadora funciona para datas futuras?", answer: "Não — ela calcula a idade a partir da data de nascimento até hoje. Para calcular a idade em uma data futura específica, subtraia a data de nascimento da data desejada manualmente. A calculadora de datas do MyCapy pode ajudar com essa diferença." },
];

export function CalculadoraIdade() {
  const [nascimento, setNascimento] = useState("");

  const calcularIdade = (nasc: string) => {
    if (!nasc) return null;
    const nascDate = new Date(nasc);
    const hoje = new Date();
    if (nascDate > hoje) return null;

    let anos = hoje.getFullYear() - nascDate.getFullYear();
    let meses = hoje.getMonth() - nascDate.getMonth();
    let dias = hoje.getDate() - nascDate.getDate();

    if (dias < 0) { meses--; dias += new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate(); }
    if (meses < 0) { anos--; meses += 12; }

    const totalDias = Math.floor((hoje.getTime() - nascDate.getTime()) / (1000 * 60 * 60 * 24));
    const proximoAniversario = new Date(nascDate);
    proximoAniversario.setFullYear(hoje.getFullYear());
    if (proximoAniversario < hoje) proximoAniversario.setFullYear(hoje.getFullYear() + 1);
    const diasParaAniversario = Math.floor((proximoAniversario.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    return { anos, meses, dias, totalDias, diasParaAniversario };
  };

  const result = calcularIdade(nascimento);

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            A calculadora determina sua idade exata em anos, meses e dias contados até o dia de hoje.
            O algoritmo subtrai a data de nascimento da data atual, ajustando corretamente quando o
            dia atual é menor que o dia do nascimento (emprestando dias do mês anterior) e quando o
            mês atual é menor que o mês do nascimento (emprestando meses do ano anterior).
          </p>
          <p>
            Além da idade exata, a ferramenta mostra o total de dias vividos (útil para cálculos
            previdenciários) e a contagem regressiva para o próximo aniversário. Todas as contas
            são feitas localmente no seu navegador, sem envio de dados para servidores.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo: Nascido em 10/03/1990</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Idade: 36 anos, 3 meses e 5 dias</li>
              <li>• Total de dias vividos: aproximadamente 13.244</li>
              <li>• Próximo aniversário: 10/03/2027 (falta ~269 dias)</li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">(valores aproximados para 15/06/2026)</p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nasc-date">Data de nascimento</Label>
            <Input id="nasc-date" type="date" value={nascimento} onChange={(e) => setNascimento(e.target.value)} max={new Date().toISOString().split("T")[0]} />
          </div>
          {result && (
            <div className="space-y-3">
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Sua idade</p>
                <p className="mt-1 text-4xl font-bold text-primary">{result.anos} <span className="text-lg">anos</span></p>
                <p className="mt-1 text-sm text-muted-foreground">{result.meses} meses e {result.dias} dias</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total de dias vividos</p>
                  <p className="mt-1 text-xl font-bold">{result.totalDias.toLocaleString("pt-BR")}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Dias para o aniversário</p>
                  <p className="mt-1 text-xl font-bold">{result.diasParaAniversario === 0 ? "🎂 Hoje!" : result.diasParaAniversario}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
