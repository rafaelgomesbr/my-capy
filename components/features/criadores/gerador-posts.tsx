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
  { question: "Como criar posts que engajam?", answer: "Posts com alta performance têm um gancho forte nas primeiras linhas, entregam valor real, possuem CTA claro e pedem interação do público." },
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
    <ToolLayout tool={tool} faqs={faqs}>
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
