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
  { question: "Como escolher um bom nome para canal?", answer: "Escolha um nome que reflita o nicho, seja fácil de pronunciar, memorável e único. Verifique disponibilidade no YouTube, Instagram e como domínio .com.br." },
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
    <ToolLayout tool={tool} faqs={faqs}>
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
