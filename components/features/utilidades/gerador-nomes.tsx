"use client";

import { useState } from "react";
import { Copy, CheckCheck, RefreshCw } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getToolBySlug } from "@/lib/tools";

const nomesMasc = ["João","Pedro","Lucas","Gabriel","Matheus","Rafael","Bruno","Gustavo","Felipe","André","Carlos","Marcos","Paulo","Roberto","Diego","Eduardo","Thiago","Vinícius","Rodrigo","Alexandre","Henrique","Leonardo","Renato","Fábio","Celso","Davi","Samuel","Isaac","Cauã","Enzo"];
const nomesFem = ["Ana","Maria","Juliana","Amanda","Fernanda","Camila","Larissa","Bruna","Mariana","Beatriz","Letícia","Patrícia","Renata","Sandra","Carla","Vanessa","Aline","Priscila","Débora","Cristiane","Sofia","Isabella","Valentina","Helena","Alice","Lívia","Clara","Laura","Natália","Bianca"];
const sobrenomes = ["Silva","Santos","Oliveira","Souza","Rodrigues","Ferreira","Alves","Pereira","Lima","Carvalho","Gomes","Costa","Martins","Araújo","Melo","Barbosa","Ribeiro","Rocha","Cardoso","Correia","Nascimento","Cavalcante","Monteiro","Moura","Teixeira","Nunes","Pinto","Vieira","Ramos","Cunha"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function gerarNome(genero: string, comSobrenome: boolean): string {
  const usarMasc = genero === "masculino" || (genero === "aleatorio" && Math.random() < 0.5);
  const primeiroNome = usarMasc ? pick(nomesMasc) : pick(nomesFem);
  return comSobrenome ? `${primeiroNome} ${pick(sobrenomes)}` : primeiroNome;
}

const faqs = [
  {
    question: "Para que serve o gerador de nomes aleatórios?",
    answer: "É útil para criar personagens fictícios em histórias, RPGs e jogos; popular bancos de dados de teste com dados realistas; gerar usuários em ambientes de desenvolvimento; criar nomes para projetos criativos; e fazer protótipos de interfaces sem usar dados reais de pessoas.",
  },
  {
    question: "Os nomes gerados são de pessoas reais?",
    answer: "Não. Os nomes são combinações aleatórias de primeiros nomes e sobrenomes comuns no Brasil, retirados de listas anônimas de nomes populares. Qualquer semelhança com pessoas reais é coincidência — os pares são formados aleatoriamente a cada geração.",
  },
  {
    question: "Posso usar os nomes gerados em dados de teste (mock data)?",
    answer: "Sim, esse é um dos principais usos. Desenvolvedores usam nomes fictícios realistas para preencher campos de nome em bancos de dados de desenvolvimento e testes, evitando expor dados reais de usuários em ambientes de staging ou demonstrações de sistema.",
  },
  {
    question: "Por que usar nomes realistas em vez de 'Usuário 1', 'Usuário 2'?",
    answer: "Nomes realistas tornam testes e demonstrações mais naturais e identificáveis. É mais fácil debugar problemas com 'Ana Oliveira' e 'João Silva' do que com 'user_001' e 'user_002'. Também ajuda a identificar problemas de formatação com nomes compostos ou sobrenomes longos." },
  {
    question: "De onde vêm os nomes e sobrenomes da lista?",
    answer: "Os nomes são baseados nos primeiros nomes e sobrenomes mais comuns no Brasil, segundo dados do IBGE e registros civis públicos. A lista inclui 30 nomes masculinos, 30 femininos e 30 sobrenomes, gerando mais de 1.800 combinações únicas possíveis.",
  },
];

export function GeradorNomes() {
  const tool = getToolBySlug("utilidades", "gerador-nomes")!;
  const [genero, setGenero] = useState("aleatorio");
  const [quantidade, setQuantidade] = useState("5");
  const [comSobrenome, setComSobrenome] = useState(true);
  const [nomes, setNomes] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | "all" | null>(null);

  function gerar() {
    const qty = parseInt(quantidade);
    setNomes(Array.from({ length: qty }, () => gerarNome(genero, comSobrenome)));
    setCopied(null);
  }

  function copiar(texto: string, idx: number | "all") {
    navigator.clipboard.writeText(texto);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador combina aleatoriamente primeiros nomes (masculinos ou femininos) com sobrenomes
            comuns no Brasil para criar nomes fictícios realistas. Gere de 1 a 20 nomes por vez,
            filtre por gênero e escolha se quer incluir sobrenome — ideal para popular dados de teste,
            criar personagens e gerar listas de usuários fictícios.
          </p>
          <p>
            Os nomes são baseados nos primeiros nomes e sobrenomes mais comuns no Brasil segundo dados
            do IBGE. Cada combinação é aleatória e independente — o mesmo nome pode aparecer em
            gerações diferentes. Copie nomes individualmente ou todos de uma vez com o botão "Copiar todos".
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplos de nomes gerados</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Masculino com sobrenome: Rafael Oliveira, Carlos Santos</li>
              <li>• Feminino com sobrenome: Ana Ferreira, Beatriz Lima</li>
              <li>• Aleatório sem sobrenome: João, Maria, Lucas, Camila</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Gênero</Label>
              <Select value={genero} onValueChange={(v) => setGenero(v ?? genero)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aleatorio">Aleatório</SelectItem>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Select value={quantidade} onValueChange={(v) => setQuantidade(v ?? quantidade)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 nome</SelectItem>
                  <SelectItem value="5">5 nomes</SelectItem>
                  <SelectItem value="10">10 nomes</SelectItem>
                  <SelectItem value="20">20 nomes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sobrenome</Label>
              <Select value={comSobrenome ? "sim" : "nao"} onValueChange={(v) => setComSobrenome(v === "sim")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Incluir sobrenome</SelectItem>
                  <SelectItem value="nao">Apenas primeiro nome</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full gap-2" onClick={gerar}>
            <RefreshCw className="h-4 w-4" />
            Gerar Nomes
          </Button>

          {nomes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{nomes.length} nome{nomes.length > 1 ? "s" : ""} gerado{nomes.length > 1 ? "s" : ""}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => copiar(nomes.join("\n"), "all")}
                >
                  {copied === "all" ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  Copiar todos
                </Button>
              </div>
              <div className="divide-y rounded-lg border">
                {nomes.map((nome, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5">
                    <span className="font-medium">{nome}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => copiar(nome, i)}
                    >
                      {copied === i ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
