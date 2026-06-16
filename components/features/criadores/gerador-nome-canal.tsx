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

const tool = getToolBySlug("criadores", "gerador-nome-canal")!;
const faqs = [
  { question: "Como escolher um bom nome para canal?", answer: "Escolha um nome que reflita o nicho, seja fácil de pronunciar, memorável e único. Verifique disponibilidade no YouTube, Instagram e como domínio .com.br. Um bom nome deve fazer sentido mesmo sem saber o nicho do canal — ex: 'Primo Rico' comunica finanças e personalidade ao mesmo tempo." },
  { question: "Devo usar meu nome pessoal ou um nome de marca?", answer: "Depende do objetivo. Nome pessoal cria conexão e é mais fácil de humanizar, mas limita caso queira vender o canal futuramente. Nome de marca é mais profissional e escalável, mas exige mais esforço para criar identidade. Muitos criadores de sucesso usam os dois (nome próprio + apelido de marca)." },
  { question: "O nome do canal afeta o SEO no YouTube?", answer: "Sim. Ter palavras-chave do nicho no nome do canal ajuda na descoberta. 'Canal do Cozinheiro' tende a aparecer mais em buscas de culinária do que 'Canal do Carlos'. No entanto, nomes muito genéricos ficam difíceis de diferenciar. Equilíbrio é a chave." },
  { question: "Posso mudar o nome do canal depois?", answer: "Sim, tanto no YouTube quanto no TikTok você pode alterar o nome do canal. Porém, mudanças frequentes confundem o algoritmo e o público. Se seu canal já tem seguidores, comunique a mudança com antecedência e mantenha o mesmo estilo visual para facilitar a transição." },
  { question: "Como verificar se o nome está disponível em todas as plataformas?", answer: "Use serviços como Namechk ou instantusername.com para verificar a disponibilidade de um username em dezenas de plataformas simultaneamente. Também verifique domínios (.com.br) no Registro.br e marcas no INPI antes de consolidar o nome escolhido." },
];

export function GeradorNomeCanal() {
  const [tema, setTema] = useState("");
  const [nome, setNome] = useState("");
  const [plataforma, setPlataforma] = useState("youtube");
  const [nomes, setNomes] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { generate, loading, error } = useGemini({ tool: "gerador-nome-canal" });

  const gerar = useCallback(async () => {
    if (!tema.trim()) return;
    const prompt = `Crie 8 nomes criativos e memoráveis para um canal de ${plataforma}.
Tema/Nicho: ${tema}
Nome do criador: ${nome || "não informado"}

Regras:
- Nomes curtos (2-4 palavras máximo)
- Fáceis de pronunciar e lembrar
- Únicos e originais
- Misture estilos: pessoal, temático, aspiracional, com autoridade
- Em português (pode incluir 1-2 em inglês se fizer sentido)
- Um nome por linha, sem numeração
- Apenas os nomes, sem explicações`;

    const result = await generate(prompt);
    if (result) {
      const lines = result.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 8);
      setNomes(lines);
    }
  }, [tema, nome, plataforma, generate]);

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
            O gerador cria 8 sugestões de nome para canal com 2-4 palavras cada, priorizando nomes
            fáceis de pronunciar, memoráveis e distintos. A IA mistura estilos: pessoal (usando seu
            nome), temático (focado no nicho), aspiracional (transmite transformação) e de autoridade
            (transmite expertise).
          </p>
          <p>
            Os nomes são adaptados para a plataforma: YouTube e TikTok preferem nomes curtos e
            enérgicos; podcasts aceitam nomes mais conceituais; newsletters podem ser mais
            sofisticadas. Inclua seu nome se quiser opções personalizadas — a IA vai combiná-lo
            criativamente com o tema.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Estilos de nome para canal de "Culinária saudável"</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Temático:</strong> Cozinha Sem Culpa</li>
              <li>• <strong>Aspiracional:</strong> Viva Mais Leve</li>
              <li>• <strong>Pessoal:</strong> Cozinhando com Ana</li>
              <li>• <strong>Autoridade:</strong> O Nutricionista da Cozinha</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tema-nc">Tema do canal *</Label>
              <Input id="tema-nc" placeholder="Ex: Finanças pessoais, Receitas, Games" value={tema} onChange={(e) => setTema(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plat-nc">Plataforma</Label>
              <select id="plat-nc" value={plataforma} onChange={(e) => setPlataforma(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="youtube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="podcast">Podcast</option>
                <option value="newsletter">Newsletter</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome-nc">Seu nome (opcional)</Label>
            <Input id="nome-nc" placeholder="Ex: Carlos" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>

          <Button onClick={gerar} disabled={loading || !tema.trim()} className="w-full gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando com IA...</> : <><Sparkles className="h-4 w-4" /> Gerar Nomes com IA</>}
          </Button>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}

          {nomes.length > 0 && (
            <div className="space-y-2">
              {nomes.map((n, i) => (
                <div key={n} className="flex items-center justify-between rounded-xl border px-4 py-3 transition-colors hover:bg-muted/30">
                  <span className="font-medium">{n}</span>
                  <button onClick={() => handleCopy(n, i)} className="text-muted-foreground hover:text-foreground transition-colors">
                    {copiedIdx === i ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
