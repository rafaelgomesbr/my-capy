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
  { question: "Como nunca ficar sem ideias de conteúdo?", answer: "Use o método 3H: Help (tutoriais que resolvem problemas), Hub (conteúdo regular do seu nicho) e Hero (grandes conteúdos de destaque). Misture formatos: vídeo, reels, carrossel, stories e blog." },
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
    <ToolLayout tool={tool} faqs={faqs}>
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
