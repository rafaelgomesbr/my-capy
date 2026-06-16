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
  { question: "O que torna um título irresistível?", answer: "Títulos eficazes usam números específicos, criam curiosidade, fazem uma promessa clara de benefício e falam diretamente com a dor ou desejo do leitor. Ex: '7 Erros que Custam Caro para Iniciantes em Investimentos'." },
  { question: "Quantos títulos devo testar?", answer: "Sempre teste pelo menos 3-5 variações de título. Em email marketing e ads, faça A/B test com 2-3 versões. No YouTube, a taxa de clique (CTR) da thumbnail é o principal indicador de qual título funciona melhor." },
  { question: "Números ímpares performam melhor em títulos?", answer: "Estudos de marketing de conteúdo mostram que listas com números ímpares (5, 7, 9, 11) têm CTR maior do que com números pares. '7 dicas' tende a performar melhor que '8 dicas'. Títulos com 65 caracteres são ideais para SEO." },
  { question: "Qual a diferença entre título para blog e para YouTube?", answer: "Títulos de blog são otimizados para SEO (palavras-chave no início, entre 50-70 caracteres). Títulos de YouTube precisam gerar curiosidade e trabalhar com a thumbnail (podem ser mais curtos). Ambos devem prometer valor claro." },
  { question: "Devo usar maiúsculas em todas as palavras?", answer: "Em inglês, o 'title case' é padrão. Em português, o estilo mais eficaz varia: capitalize as palavras principais para destaque ou use apenas a inicial do título. Evite TODAS AS LETRAS MAIÚSCULAS (parece spam)." },
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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador cria 8 títulos usando 8 gatilhos diferentes: números, curiosidade, urgência,
            benefício direto, pergunta provocativa, controvérsia, lista e transformação. Cada título
            usa uma técnica de copywriting diferente para atrair públicos com motivações distintas.
          </p>
          <p>
            Especifique o público-alvo para títulos mais personalizados — a IA ajustará o tom, o
            vocabulário e os gatilhos para ressoar com aquele grupo específico. Copie o título
            preferido clicando no ícone de copiar ao lado de cada um.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">8 estilos de título para "Investimentos"</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Número: "7 Investimentos que Todo Iniciante Deve Conhecer"</li>
              <li>• Curiosidade: "O Que Ninguém Te Conta Sobre Renda Fixa"</li>
              <li>• Urgência: "Por Que Você Precisa Começar a Investir Agora"</li>
              <li>• Pergunta: "Seu Dinheiro Está Perdendo Valor?"</li>
            </ul>
          </div>
        </div>
      }
    >
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
