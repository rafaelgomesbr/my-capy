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

const tool = getToolBySlug("criadores", "gerador-descricao-youtube")!;
const faqs = [
  { question: "Como escrever uma boa descrição no YouTube?", answer: "Inclua as palavras-chave principais nas primeiras 3 linhas (visíveis sem expandir), links relevantes, timestamps, suas redes sociais e de 3 a 5 hashtags no final." },
];

export function GeradorDescricaoYoutube() {
  const [titulo, setTitulo] = useState("");
  const [sobre, setSobre] = useState("");
  const [canal, setCanal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [copied, setCopied] = useState(false);
  const { generate, loading, error } = useGemini({ tool: "gerador-descricao-youtube" });

  const gerar = useCallback(async () => {
    if (!titulo.trim() || !sobre.trim()) return;
    const prompt = `Crie uma descrição completa e otimizada para SEO para um vídeo do YouTube.

Título do vídeo: ${titulo}
O que é abordado: ${sobre}
Nome do canal: ${canal || "não informado"}

A descrição deve ter:
1. Parágrafo de abertura com a palavra-chave principal (primeiras 2-3 linhas visíveis)
2. Seção "SOBRE ESTE VÍDEO" com resumo detalhado
3. Seção "LINKS ÚTEIS" (use [link aqui] como placeholder)
4. Seção "REDES SOCIAIS" (use @${canal?.toLowerCase().replace(/\s/g, "") || "seucanal"} como exemplo)
5. Seção de CTA para inscrição e notificações
6. 3-5 hashtags relevantes no final

Use separadores visuais com ═══ ou ─────.
Escreva em português do Brasil.
Torne a descrição entre 500-800 palavras para SEO ideal.`;

    const result = await generate(prompt);
    if (result) setDescricao(result);
  }, [titulo, sobre, canal, generate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(descricao);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tit-yt">Título do vídeo *</Label>
              <Input id="tit-yt" placeholder="Ex: Como investir R$100 na bolsa" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canal-yt">Nome do canal (opcional)</Label>
              <Input id="canal-yt" placeholder="Ex: FinançasFáceis" value={canal} onChange={(e) => setCanal(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sobre-yt">O que é abordado no vídeo? *</Label>
            <textarea id="sobre-yt" value={sobre} onChange={(e) => setSobre(e.target.value)}
              placeholder="Descreva os principais pontos abordados no vídeo..."
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          <Button onClick={gerar} disabled={loading || !titulo.trim() || !sobre.trim()} className="w-full gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando com IA...</> : <><Sparkles className="h-4 w-4" /> Gerar Descrição com IA</>}
          </Button>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}

          {descricao && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Descrição gerada</Label>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 h-8">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
              <pre className="min-h-[200px] overflow-auto rounded-xl border bg-muted/30 p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap">{descricao}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
