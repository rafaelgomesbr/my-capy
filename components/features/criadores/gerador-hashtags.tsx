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
  { question: "Devo usar hashtags populares ou de nicho?", answer: "Combine os dois: 30% populares (1M+ posts), 50% médias (100K-1M posts) e 20% de nicho (menos de 100K). Isso maximiza alcance e relevância." },
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
    <ToolLayout tool={tool} faqs={faqs}>
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
