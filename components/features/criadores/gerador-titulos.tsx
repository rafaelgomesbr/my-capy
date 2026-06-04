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

const tool = getToolBySlug("criadores", "gerador-titulos")!;
const faqs = [
  { question: "O que torna um título irresistível?", answer: "Títulos eficazes usam números específicos, criam curiosidade, fazem uma promessa clara e falam diretamente com a dor ou desejo do leitor." },
  { question: "Quantos títulos devo testar?", answer: "Sempre teste pelo menos 3-5 variações de título. Em email marketing e ads, faça A/B test. No YouTube, use thumbnails diferentes para medir CTR." },
];

export function GeradorTitulos() {
  const [tema, setTema] = useState("");
  const [formato, setFormato] = useState("blog");
  const [publico, setPublico] = useState("");
  const [titulos, setTitulos] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { generate, loading, error } = useGemini({ tool: "gerador-titulos" });

  const gerar = useCallback(async () => {
    if (!tema.trim()) return;
    const prompt = `Crie 8 títulos irresistíveis para ${formato} sobre "${tema}"${publico ? ` para ${publico}` : ""}.

Use diferentes gatilhos em cada título:
- Números específicos
- Curiosidade e mistério
- Urgência / escassez
- Benefício direto
- Pergunta provocativa
- Controvérsia
- Lista (Como, Por que, Quando)
- Transformação (De X para Y)

Retorne apenas os títulos, um por linha, sem numeração ou explicações.`;

    const result = await generate(prompt);
    if (result) {
      const lines = result.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 8);
      setTitulos(lines);
    }
  }, [tema, formato, publico, generate]);

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
              <Label htmlFor="tema-tit">Tema / Assunto *</Label>
              <Input id="tema-tit" placeholder="Ex: Investimentos para iniciantes" value={tema} onChange={(e) => setTema(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fmt-tit">Formato</Label>
              <select id="fmt-tit" value={formato} onChange={(e) => setFormato(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="blog">Artigo de blog</option>
                <option value="video do YouTube">Vídeo YouTube</option>
                <option value="post do Instagram">Post Instagram</option>
                <option value="email marketing">Email marketing</option>
                <option value="anuncio">Anúncio / Ad</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pub-tit">Público-alvo (opcional)</Label>
            <Input id="pub-tit" placeholder="Ex: Mães empreendedoras, jovens de 18-25 anos..." value={publico} onChange={(e) => setPublico(e.target.value)} />
          </div>

          <Button onClick={gerar} disabled={loading || !tema.trim()} className="w-full gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando com IA...</> : <><Sparkles className="h-4 w-4" /> Gerar Títulos com IA</>}
          </Button>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}

          {titulos.length > 0 && (
            <div className="space-y-2">
              {titulos.map((t, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/40">
                  <p className="flex-1 text-sm font-medium leading-snug">{t}</p>
                  <button onClick={() => handleCopy(t, i)} className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors">
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
