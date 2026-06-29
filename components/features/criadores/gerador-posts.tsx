"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Sparkles, Loader2 } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGemini } from "@/hooks/use-gemini";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("criadores", "gerador-posts")!;
const faqs = [
  { question: "Como criar posts que engajam?", answer: "Posts com alta performance têm um gancho forte nas primeiras linhas, entregam valor real, possuem CTA claro e pedem interação do público. As primeiras 1-2 linhas determinam se o usuário vai clicar em 'ver mais' ou passar para o próximo post." },
  { question: "Qual o tamanho ideal de um post?", answer: "No Instagram, posts entre 300-700 caracteres têm melhor desempenho. No LinkedIn, textos mais longos (1.000-2.000 caracteres) funcionam bem. No Twitter/X, o limite é 280 caracteres por tweet. Sempre priorize qualidade sobre quantidade." },
  { question: "Quantas vezes por semana devo postar?", answer: "A consistência supera a frequência. Postar 3x/semana de forma consistente por 6 meses gera mais resultado do que postar 7x/semana por 2 semanas. Encontre um ritmo sustentável e siga-o." },
  { question: "Como adaptar o mesmo conteúdo para diferentes redes?", answer: "Mude o formato, não a mensagem. O mesmo tema pode virar: post longo no LinkedIn, carrossel no Instagram, fio no Twitter, reels no TikTok e artigo no blog. Isso multiplica o alcance sem criar mais trabalho do zero." },
  { question: "Quando é melhor postar nas redes sociais?", answer: "Os melhores horários variam por plataforma e audiência. No geral: Instagram — 18h-21h em dias de semana; LinkedIn — 8h-10h de terça a quinta; TikTok — 19h-23h. Use as métricas do seu próprio perfil para descobrir os horários ideais." },
];

export function GeradorPosts() {
  const [tema, setTema] = useState("");
  const [rede, setRede] = useState("instagram");
  const [tom, setTom] = useState("educativo");
  const [posts, setPosts] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { generate, loading, error } = useGemini({ tool: "gerador-posts" });

  const gerar = useCallback(async () => {
    if (!tema.trim()) return;
    const limits: Record<string, string> = {
      instagram: "até 2200 caracteres",
      linkedin: "até 3000 caracteres",
      twitter: "até 280 caracteres por tweet — crie um fio de 3 tweets",
      facebook: "até 1500 caracteres",
    };
    const prompt = `Crie 2 versões de post para ${rede} sobre "${tema}".
Tom: ${tom}
Limite: ${limits[rede] || "adequado para a rede"}

Cada post deve ter:
- Gancho forte na primeira linha
- Corpo com valor real e prático
- Call to action no final
- Emojis relevantes
- Quebras de linha para facilitar leitura

Separe as 2 versões com uma linha contendo apenas "---".
Retorne apenas os posts, sem títulos ou explicações.`;

    const result = await generate(prompt);
    if (result) {
      const blocks = result.split(/\n---\n/).map((b) => b.trim()).filter(Boolean);
      setPosts(blocks.slice(0, 2));
    }
  }, [tema, rede, tom, generate]);

  const handleCopy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador cria 2 versões de post para a rede social escolhida, com gancho forte, corpo
            com valor prático, emojis e CTA (chamada para ação) no final. Cada versão usa um ângulo
            ligeiramente diferente para o mesmo tema, dando opções para você escolher ou combinar.
          </p>
          <p>
            O texto é adaptado automaticamente às regras de cada plataforma: até 2.200 caracteres no
            Instagram, 3.000 no LinkedIn, e fio de 3 tweets no Twitter/X. Escolha o tom de voz que
            melhor representa sua marca — de educativo a provocativo.
          </p>
          <p>
            Posts de alto engajamento compartilham uma estrutura em comum chamada AIDA adaptada para
            redes sociais: <strong>Gancho</strong> (primeira linha que para o scroll — uma afirmação
            ousada, número surpreendente ou pergunta direta), <strong>Corpo</strong> (2-4 pontos com
            valor prático real, sem enrolação), <strong>Prova</strong> (dado, resultado ou exemplo
            concreto que valida o que foi dito) e <strong>CTA</strong> (ação específica para o
            leitor tomar). No Instagram, quebre o texto em linhas curtas — parágrafos de 1-2 linhas
            são mais fáceis de ler em telas mobile e aumentam o tempo de leitura, que o algoritmo
            interpreta como sinal de qualidade.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Estrutura de post de alto engajamento</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Gancho:</strong> "99% das pessoas cometem esse erro ao investir..."</li>
              <li>• <strong>Corpo:</strong> 3-5 pontos com valor prático e real</li>
              <li>• <strong>CTA:</strong> "Salve esse post e marque quem precisa ver isso 👇"</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tema-post">Tema do post *</Label>
            <Input id="tema-post" placeholder="Ex: Como aumentar vendas no Instagram" value={tema} onChange={(e) => setTema(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rede-post">Rede social</Label>
              <select id="rede-post" value={rede} onChange={(e) => setRede(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter/X</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tom-post">Tom de voz</Label>
              <select id="tom-post" value={tom} onChange={(e) => setTom(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="educativo">Educativo</option>
                <option value="inspirador">Inspirador</option>
                <option value="descontraído">Descontraído</option>
                <option value="profissional">Profissional</option>
                <option value="provocativo">Provocativo</option>
              </select>
            </div>
          </div>

          <Button onClick={gerar} disabled={loading || !tema.trim()} className="w-full gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando com IA...</> : <><Sparkles className="h-4 w-4" /> Gerar Posts com IA</>}
          </Button>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}

          {posts.map((p, i) => (
            <div key={i} className="rounded-xl border p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Versão {i + 1}</p>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{p}</pre>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(p, i)} className="gap-1.5 h-8 w-full">
                {copiedIdx === i ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedIdx === i ? "Copiado!" : "Copiar post"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
