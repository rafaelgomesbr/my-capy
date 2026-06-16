"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { Copy, CheckCheck, RefreshCw } from "lucide-react";

const tool = getToolBySlug("documentos", "gerador-pessoas")!;

const faqs = [
  {
    question: "Para que serve o gerador de pessoas?",
    answer: "O gerador cria perfis fictícios completos com nome, CPF, RG, data de nascimento, telefone, e-mail, CEP e endereço para uso em testes de sistemas, desenvolvimento de software, homologação e staging. Permite preencher fluxos completos de cadastro sem usar dados reais, respeitando a LGPD.",
  },
  {
    question: "Os dados gerados são reais?",
    answer: "Não. Todos os dados são gerados aleatoriamente. O CPF segue o algoritmo oficial da Receita Federal e passa em validações matemáticas, mas não pertence a nenhuma pessoa real. Os endereços combinam ruas, bairros e cidades reais do Brasil, mas em combinações aleatórias que podem não existir.",
  },
  {
    question: "Posso usar esses dados para testes de sistema?",
    answer: "Sim, esse é exatamente o propósito. Use em ambientes de desenvolvimento, QA e homologação para testar fluxos de cadastro, validação de documentos e formatação de dados sem expor informações reais. Nunca use dados fictícios em sistemas de produção, documentos oficiais ou comunicações externas.",
  },
  {
    question: "Por que usar dados fictícios em vez de dados reais de teste?",
    answer: "A Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018) exige que dados pessoais reais sejam tratados com cuidados específicos, mesmo em ambientes de teste. Usar dados fictícios elimina esse risco legal, facilita a criação de ambientes isolados e permite compartilhar bases de teste com equipes sem preocupações de privacidade.",
  },
  {
    question: "Quantos campos o perfil completo inclui?",
    answer: "O gerador completo inclui: nome completo (primeiro nome + 2 sobrenomes), gênero, data de nascimento (1960-2005), CPF validado matematicamente, RG (formato SSP-SP), telefone celular com DDD real, e-mail fictício mas formatado corretamente, CEP e endereço com rua, número, bairro e cidade do Brasil. Cada campo pode ser copiado individualmente ou todos de uma vez.",
  },
];

const nomesMasc = ["João", "Pedro", "Lucas", "Gabriel", "Matheus", "Rafael", "Bruno", "Gustavo", "Felipe", "André", "Carlos", "Marcos", "Paulo", "Roberto", "Diego", "Eduardo", "Thiago", "Vinícius", "Rodrigo", "Alexandre"];
const nomesFem = ["Ana", "Maria", "Juliana", "Amanda", "Fernanda", "Camila", "Larissa", "Bruna", "Mariana", "Beatriz", "Letícia", "Patrícia", "Renata", "Sandra", "Carla", "Vanessa", "Aline", "Priscila", "Débora", "Cristiane"];
const sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Carvalho", "Gomes", "Costa", "Martins", "Araújo", "Melo", "Barbosa", "Ribeiro", "Rocha", "Cardoso", "Correia"];
const ruas = ["das Flores", "dos Ipês", "da Paz", "XV de Novembro", "Sete de Setembro", "Brasil", "Tiradentes"];
const cidades = ["São Paulo - SP", "Rio de Janeiro - RJ", "Belo Horizonte - MG", "Porto Alegre - RS", "Salvador - BA", "Curitiba - PR", "Fortaleza - CE"];
const ddds = ["11", "21", "31", "51", "71", "41", "85"];
const dominios = ["@gmail.com", "@hotmail.com", "@yahoo.com.br"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gerarCPF(): string {
  let digits: number[];
  do {
    digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  } while (new Set(digits).size === 1);

  const soma1 = digits.reduce((acc, v, i) => acc + v * (10 - i), 0);
  const r1 = soma1 % 11;
  const d10 = r1 < 2 ? 0 : 11 - r1;
  const soma2 = [...digits, d10].reduce((acc, v, i) => acc + v * (11 - i), 0);
  const r2 = soma2 % 11;
  const d11 = r2 < 2 ? 0 : 11 - r2;
  const all = [...digits, d10, d11];
  return `${all.slice(0, 3).join("")}.${all.slice(3, 6).join("")}.${all.slice(6, 9).join("")}-${all.slice(9).join("")}`;
}

function gerarRG(): string {
  const nums = Array.from({ length: 8 }, () => rand(0, 9));
  return `${nums.slice(0, 2).join("")}.${nums.slice(2, 5).join("")}.${nums.slice(5, 8).join("")}-${rand(0, 9)}`;
}

function gerarData(): string {
  const ano = rand(1960, 2005);
  const mes = String(rand(1, 12)).padStart(2, "0");
  const dia = String(rand(1, 28)).padStart(2, "0");
  return `${dia}/${mes}/${ano}`;
}

function gerarTelefone(): string {
  const ddd = pick(ddds);
  const parte = rand(90000, 99999);
  const fim = rand(1000, 9999);
  return `(${ddd}) 9${parte}-${fim}`;
}

function gerarCEP(): string {
  const p1 = String(rand(10000, 99999));
  const p2 = String(rand(0, 999)).padStart(3, "0");
  return `${p1}-${p2}`;
}

function normalizarNome(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, ".");
}

interface Pessoa {
  nome: string;
  genero: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  telefone: string;
  email: string;
  cep: string;
  endereco: string;
}

function gerarPessoa(genero: "Masculino" | "Feminino" | "Aleatório"): Pessoa {
  const gen: "Masculino" | "Feminino" = genero === "Aleatório" ? (Math.random() < 0.5 ? "Masculino" : "Feminino") : genero;
  const nome = gen === "Masculino" ? pick(nomesMasc) : pick(nomesFem);
  const sobrenome1 = pick(sobrenomes);
  const sobrenome2 = pick(sobrenomes);
  const nomeCompleto = `${nome} ${sobrenome1} ${sobrenome2}`;
  const email = `${normalizarNome(nome)}.${normalizarNome(sobrenome1)}${rand(1, 99)}${pick(dominios)}`;
  const cidade = pick(cidades);
  const rua = pick(ruas);
  const numero = rand(1, 9999);
  const bairros = ["Centro", "Jardim América", "Vila Nova", "Boa Vista", "Santa Cruz", "Bela Vista"];
  const bairro = pick(bairros);
  return {
    nome: nomeCompleto,
    genero: gen,
    dataNascimento: gerarData(),
    cpf: gerarCPF(),
    rg: gerarRG(),
    telefone: gerarTelefone(),
    email,
    cep: gerarCEP(),
    endereco: `Rua ${rua}, ${numero}, ${bairro}, ${cidade}`,
  };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} title="Copiar">
      {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

const campos: { key: keyof Pessoa; label: string }[] = [
  { key: "nome", label: "Nome completo" },
  { key: "genero", label: "Gênero" },
  { key: "dataNascimento", label: "Data de nascimento" },
  { key: "cpf", label: "CPF" },
  { key: "rg", label: "RG" },
  { key: "telefone", label: "Telefone" },
  { key: "email", label: "E-mail" },
  { key: "cep", label: "CEP" },
  { key: "endereco", label: "Endereço" },
];

export function GeradorPessoas() {
  const [genero, setGenero] = useState<"Masculino" | "Feminino" | "Aleatório">("Aleatório");
  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [copiadoTudo, setCopiadoTudo] = useState(false);

  const handleGerar = () => setPessoa(gerarPessoa(genero));

  const handleCopiarTudo = () => {
    if (!pessoa) return;
    const texto = campos.map((c) => `${c.label}: ${pessoa[c.key]}`).join("\n");
    navigator.clipboard.writeText(texto);
    setCopiadoTudo(true);
    setTimeout(() => setCopiadoTudo(false), 2000);
  };

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador cria perfis fictícios completos combinando nomes e sobrenomes brasileiros
            comuns, com CPF calculado pelo algoritmo da Receita Federal, RG no formato SSP-SP,
            telefone com DDDs de capitais reais, e-mail fictício com domínio real (gmail, hotmail,
            yahoo) e endereço com logradouros, bairros e cidades brasileiras reais.
          </p>
          <p>
            Cada campo pode ser copiado individualmente clicando no ícone de cópia, ou copie todos
            os dados de uma vez com o botão "Copiar Tudo" — ideal para preencher formulários de teste
            rapidamente. Todos os dados são gerados localmente no navegador; nenhuma informação é
            enviada a servidores.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo de perfil gerado</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Nome:</strong> Juliana Ferreira Santos</li>
              <li>• <strong>CPF:</strong> 529.982.247-25</li>
              <li>• <strong>Telefone:</strong> (11) 99847-3218</li>
              <li>• <strong>E-mail:</strong> juliana.ferreira47@gmail.com</li>
              <li>• <strong>Endereço:</strong> Rua das Flores, 1203, Centro, São Paulo - SP</li>
            </ul>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                ⚠️ Dados fictícios gerados para testes. Não use em sistemas de produção ou cadastros oficiais.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="genero-select">Gênero</Label>
                <select
                  id="genero-select"
                  value={genero}
                  onChange={(e) => setGenero(e.target.value as typeof genero)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {(["Aleatório", "Masculino", "Feminino"] as const).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleGerar}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Gerar Pessoa
              </Button>
            </div>

            {pessoa && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  {campos.map((c) => (
                    <div key={c.key} className="flex items-center justify-between rounded-lg border px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">{c.label}</p>
                        <p className="text-sm font-medium truncate">{pessoa[c.key]}</p>
                      </div>
                      <CopyButton text={pessoa[c.key]} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button variant="outline" onClick={handleCopiarTudo}>
                    {copiadoTudo ? <CheckCheck className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                    Copiar Tudo
                  </Button>
                  <Button variant="outline" onClick={handleGerar}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Gerar Novamente
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
