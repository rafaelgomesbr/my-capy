"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Sparkles, Loader2 } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGemini } from "@/hooks/use-gemini";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("criadores", "gerador-hashtags")!;
const faqs = [
  { question: "Quantas hashtags usar no Instagram?", answer: "O Instagram recomenda entre 3-5 hashtags altamente relevantes. Evite usar 30 hashtags genéricas — foque em hashtags de nicho relacionadas ao seu conteúdo para melhor alcance orgânico." },
  { question: "Devo usar hashtags populares ou de nicho?", answer: "Combine os dois: 30% populares (1M+ posts), 50% médias (100K-1M posts) e 20% de nicho (menos de 100K). Isso maximiza alcance e relevância para sua audiência específica." },
  { question: "As hashtags funcionam igual em todas as redes?", answer: "Não. No Instagram e TikTok são essenciais para descoberta. No LinkedIn, 3-5 hashtags profissionais são suficientes. No Twitter/X, hashtags de tendência são mais eficazes. No YouTube, tags têm papel menor que o título e thumbnail." },
  { question: "Quantas hashtags por post no TikTok?", answer: "No TikTok, use 3-5 hashtags por vídeo: uma tendência geral (#FYP ou #ForYou), 1-2 de nicho e 1-2 específicas do conteúdo. Muitas hashtags podem diluir a relevância e confundir o algoritmo." },
  { question: "O uso de hashtags banidas prejudica meu perfil?", answer: "Sim. Hashtags banidas ou abusadas pelo Instagram podem reduzir o alcance do post e, em casos extremos, do perfil todo (shadow ban). Sempre verifique se a hashtag está ativa antes de usar." },
];

export function GeradorHashtags() {
  const [nicho, setNicho] = useState("");
  const [rede, setRede] = useState("instagram");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const { generate, loading, error } = useGemini({ tool: "gerador-hashtags" });

  const gerar = useCallback(async () => {
    if (!nicho.trim()) return;
    const prompt = `Gere 20 hashtags relevantes para o nicho "${nicho}" para ${rede}.
Regras:
- Inclua mix de populares, médias e de nicho
- Inclua hashtags em português e inglês
- Sem espaços nas hashtags
- Uma por linha, sem numeração
- Apenas as hashtags, sem texto adicional`;

    const result = await generate(prompt);
    if (result) {
      const tags = result
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("#") || l.length > 0)
        .map((l) => (l.startsWith("#") ? l : `#${l}`))
        .filter((l) => l.length > 1)
        .slice(0, 20);
      setHashtags(tags);
    }
  }, [nicho, rede, generate]);

  const allText = hashtags.join(" ");
  const handleCopy = () => {
    navigator.clipboard.writeText(allText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador usa IA (Gemini) para criar hashtags relevantes para o seu nicho e rede social.
            Ele gera um mix estratégico de 20 hashtags incluindo populares (amplo alcance), médias
            (engajamento qualificado) e de nicho (audiência específica), em português e inglês.
          </p>
          <p>
            Cada geração é personalizada para a rede selecionada — a IA considera as boas práticas
            de cada plataforma. Instagram e TikTok permitem mais hashtags; LinkedIn e Twitter preferem
            menos, mas mais precisas. Clique em uma hashtag individual para copiá-la, ou use o botão
            para copiar todas de uma vez.
          </p>
          <p>
            A eficácia das hashtags está diretamente ligada à proporção entre o volume de publicações
            e o seu número de seguidores. Criadores com menos de 10 mil seguidores devem evitar
            hashtags com mais de 1 milhão de publicações — a competição é alta demais e o post some
            em segundos. O foco deve ser em hashtags de nicho (10K–200K publicações), onde o
            engajamento é real e o algoritmo entende exatamente para qual audiência distribuir o
            conteúdo. Hashtags com mais de 500K são úteis apenas para complementar a descoberta
            geral, não para ser o foco da estratégia.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Estratégia de hashtags por tamanho</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Populares (1M+ posts):</strong> #fitness #receitas #empreendedorismo</li>
              <li>• <strong>Médias (10K-1M):</strong> #receitasfitbr #fintechbrasil #mktdigital</li>
              <li>• <strong>Nicho (&lt;10K):</strong> #veganismosaudavel2025 #startuprecife</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nicho-ht">Nicho ou tema do conteúdo</Label>
              <Input
                id="nicho-ht"
                placeholder="Ex: receitas fit, moda feminina, tecnologia..."
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && gerar()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rede-ht">Rede social</Label>
              <select
                id="rede-ht"
                value={rede}
                onChange={(e) => setRede(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">Twitter/X</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
          </div>

          <Button onClick={gerar} disabled={loading || !nicho.trim()} className="w-full gap-2">
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Gerando com IA...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Gerar Hashtags com IA</>
            )}
          </Button>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          )}

          {hashtags.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {hashtags.map((h) => (
                  <Badge
                    key={h}
                    variant="secondary"
                    className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                    onClick={() => navigator.clipboard.writeText(h)}
                  >
                    {h}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" onClick={handleCopy} className="w-full gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado!" : `Copiar todas (${hashtags.length})`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
