"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGemini } from "@/hooks/use-gemini";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("criadores", "gerador-ideias-conteudo")!;
const faqs = [
  { question: "Como nunca ficar sem ideias de conteúdo?", answer: "Use o método 3H: Help (tutoriais que resolvem problemas), Hub (conteúdo regular do seu nicho) e Hero (grandes conteúdos de destaque). Misture formatos: vídeo, reels, carrossel, stories e blog. Salve também dúvidas que seu público faz em DMs e comentários — são ideias valiosas." },
  { question: "Qual tipo de conteúdo gera mais engajamento?", answer: "Conteúdos educativos (tutoriais, listas de dicas) e emocionais (histórias, bastidores) tendem a gerar mais compartilhamentos. Enquetes e perguntas aumentam comentários. Reels e vídeos curtos dominam o alcance orgânico na maioria das plataformas atualmente." },
  { question: "Preciso criar conteúdo original ou posso reinterpretar temas?", answer: "Reinterpretar é válido e eficaz — o que importa é trazer sua perspectiva única. Não existe assunto totalmente original; existe o SEU olhar sobre um assunto. Combine sua experiência pessoal com temas do nicho para gerar conteúdo genuinamente seu." },
  { question: "Quanto tempo leva para um canal crescer?", answer: "A maioria dos criadores de conteúdo vê crescimento consistente após 6-12 meses de publicação regular. Os primeiros 3 meses são os mais difíceis (poucos seguidores, pouco engajamento). A chave é manter a consistência mesmo sem resultados imediatos." },
  { question: "Como saber quais ideias vão performar bem?", answer: "Pesquise: veja quais posts do seu nicho têm mais engajamento, use o Google Trends para identificar assuntos em alta, e consulte as perguntas mais frequentes em grupos e fóruns do seu nicho. Use as 12 ideias geradas como ponto de partida e adapte ao seu estilo." },
];

interface Ideia {
  tipo: string;
  titulo: string;
}

export function GeradorIdeiasConteudo() {
  const [nicho, setNicho] = useState("");
  const [publico, setPublico] = useState("");
  const [ideias, setIdeias] = useState<Ideia[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { generate, loading, error } = useGemini({ tool: "gerador-ideias-conteudo" });

  const gerar = useCallback(async () => {
    if (!nicho.trim()) return;
    const prompt = `Gere 12 ideias de conteúdo criativas e específicas para o nicho "${nicho}"${publico ? ` voltado para ${publico}` : ""}.

Para cada ideia, use o formato exato:
[TIPO] Título da ideia

Tipos disponíveis: Tutorial, Lista, Estudo de caso, Comparativo, Bastidores, Opinião, FAQ, Tendência, Dica Rápida, Desafio, Review, Série

Seja específico e original. Crie ideias que realmente engajam, não genéricas.
Retorne apenas as 12 ideias no formato indicado, sem introdução ou conclusão.`;

    const result = await generate(prompt);
    if (result) {
      const parsed = result
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const match = l.match(/^\[([^\]]+)\]\s+(.+)$/);
          if (match) return { tipo: match[1], titulo: match[2] };
          return { tipo: "Ideia", titulo: l };
        })
        .slice(0, 12);
      setIdeias(parsed);
    }
  }, [nicho, publico, generate]);

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
            O gerador cria 12 ideias de conteúdo específicas para o seu nicho, categorizadas por
            tipo: Tutorial, Lista, Estudo de caso, Comparativo, Bastidores, Opinião, FAQ, Tendência,
            Dica Rápida, Desafio, Review ou Série. Cada ideia é pensada para engajamento real, não
            sugestões genéricas.
          </p>
          <p>
            Quanto mais específico o nicho e o público-alvo, mais personalizadas serão as ideias.
            Clique no ícone de copiar ao lado de cada ideia para usar como pauta. Gere novamente para
            obter um novo conjunto de 12 ideias diferentes — cada geração usa um ângulo diferente.
          </p>
          <p>
            Profissionais de marketing de conteúdo usam a regra 70-20-10 para equilibrar os tipos de
            pauta: 70% de conteúdo educativo ou de entretenimento (o que mantém a audiência), 20% de
            conteúdo de relacionamento (bastidores, histórias pessoais, enquetes) e 10% de conteúdo
            comercial (lançamentos, promoções, vendas). Essa proporção mantém o engajamento alto sem
            cansar o público com excesso de auto-promoção. O maior erro de criadores iniciantes é
            inverter essa proporção — muito conteúdo comercial e pouco educativo — o que gera
            unfollow em massa. Use as 12 ideias geradas para montar um calendário editorial balanceado
            seguindo essa regra.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplos de ideias para nicho "Finanças pessoais"</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• [Tutorial] Como montar sua primeira reserva de emergência em 6 meses</li>
              <li>• [Comparativo] Tesouro Direto vs CDB: onde investir R$500?</li>
              <li>• [Bastidores] Meu extrato de investimentos ao vivo — acertos e erros</li>
              <li>• [FAQ] 10 dúvidas que iniciantes em investimento têm</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nicho-ic">Seu nicho *</Label>
              <Input id="nicho-ic" placeholder="Ex: Culinária saudável, Finanças pessoais..." value={nicho} onChange={(e) => setNicho(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pub-ic">Público-alvo (opcional)</Label>
              <Input id="pub-ic" placeholder="Ex: Mães de primeira viagem" value={publico} onChange={(e) => setPublico(e.target.value)} />
            </div>
          </div>

          <Button onClick={gerar} disabled={loading || !nicho.trim()} className="w-full gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando com IA...</> : <><Sparkles className="h-4 w-4" /> Gerar Ideias com IA</>}
          </Button>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}

          {ideias.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{ideias.length} ideias geradas</p>
                <Button variant="ghost" size="sm" onClick={gerar} disabled={loading} className="gap-1.5 h-8">
                  <RefreshCw className="h-3.5 w-3.5" /> Gerar mais
                </Button>
              </div>
              <div className="space-y-2">
                {ideias.map((ideia, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/30">
                    <Badge variant="secondary" className="shrink-0 text-xs">{ideia.tipo}</Badge>
                    <span className="flex-1 text-sm">{ideia.titulo}</span>
                    <button onClick={() => handleCopy(ideia.titulo, i)} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                      {copiedIdx === i ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
