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

const tool = getToolBySlug("criadores", "gerador-username")!;
const faqs = [
  { question: "O que torna um bom username?", answer: "Um bom username é curto (menos de 15 caracteres), fácil de lembrar, sem caracteres especiais complexos, único e consistente entre plataformas." },
];

export function GeradorUsername() {
  const [nome, setNome] = useState("");
  const [nicho, setNicho] = useState("");
  const [rede, setRede] = useState("instagram");
  const [usernames, setUsernames] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { generate, loading, error } = useGemini({ tool: "gerador-username" });

  const gerar = useCallback(async () => {
    if (!nome.trim()) return;
    const prompt = `Gere 10 usernames únicos e criativos para ${rede}.
Nome/Palavra base: ${nome}
Nicho/Área: ${nicho || "geral"}

Regras:
- Máximo 15 caracteres cada
- Use apenas letras, números, ponto e underscore
- Sem espaços
- Misture estilos: simples, com sufixo (br, real, hq, pro), com prefixo (the, its, mr)
- Sejam memoráveis e profissionais
- Um username por linha, sem numeração ou "@"
- Apenas os usernames, sem explicações`;

    const result = await generate(prompt);
    if (result) {
      const lines = result.split("\n").map((l) => l.trim().replace(/^@/, "")).filter((l) => l && l.length <= 20).slice(0, 10);
      setUsernames(lines);
    }
  }, [nome, nicho, rede, generate]);

  const handleCopy = (u: string, i: number) => {
    navigator.clipboard.writeText(u);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome-un">Nome ou palavra-chave *</Label>
              <Input id="nome-un" placeholder="Ex: João Silva, fitness, tech" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rede-un">Rede social</Label>
              <select id="rede-un" value={rede} onChange={(e) => setRede(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="Twitter/X">Twitter/X</option>
                <option value="YouTube">YouTube</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nicho-un">Nicho / Área (opcional)</Label>
            <Input id="nicho-un" placeholder="Ex: saúde, games, negócios" value={nicho} onChange={(e) => setNicho(e.target.value)} />
          </div>

          <Button onClick={gerar} disabled={loading || !nome.trim()} className="w-full gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando com IA...</> : <><Sparkles className="h-4 w-4" /> Gerar Usernames com IA</>}
          </Button>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}

          {usernames.length > 0 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {usernames.map((u, i) => (
                <div key={u} className="flex items-center justify-between rounded-xl border px-4 py-2.5 transition-colors hover:bg-muted/30">
                  <span className="font-mono text-sm">@{u}</span>
                  <button onClick={() => handleCopy(u, i)} className="text-muted-foreground hover:text-foreground transition-colors">
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
