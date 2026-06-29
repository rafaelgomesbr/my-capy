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

const tool = getToolBySlug("criadores", "gerador-cta")!;
const faqs = [
  { question: "O que é um CTA eficaz?", answer: "Um CTA (Call to Action) eficaz usa verbos no imperativo, cria urgência ou valor claro e é específico. 'Baixe o guia grátis agora' converte muito mais que o genérico 'Clique aqui'. O segredo está em comunicar o benefício imediato da ação." },
  { question: "Onde devo colocar o CTA em uma landing page?", answer: "O CTA principal deve aparecer acima da dobra (sem rolar a página), com destaque visual (cor contrastante, tamanho maior). Em páginas longas, repita o CTA ao final. Nunca coloque mais de 2-3 CTAs diferentes na mesma página — isso cria paralisia de decisão." },
  { question: "Qual cor de botão de CTA converte mais?", answer: "Não existe uma cor universalmente melhor — o que funciona é o contraste com o restante da página. Um botão laranja em uma página azul se destaca mais do que um botão azul. A cor deve chamar atenção, não se misturar ao layout." },
  { question: "Devo usar urgência em todos os CTAs?", answer: "Não abuse da urgência falsa — o consumidor moderno detecta e desconfia. Use urgência apenas quando for real: estoque limitado, desconto por tempo determinado, vagas limitadas. CTAs com valor genuíno ('Economize 40% hoje') convertem melhor que urgência artificial." },
  { question: "Como testar qual CTA funciona melhor?", answer: "Faça A/B testing: mantenha tudo igual e mude apenas o texto do CTA. Teste variáveis como: verbo ('Comprar' vs 'Quero comprar'), benefício ('Grátis' vs 'Sem custo'), urgência ('Agora' vs 'Hoje'). Com tráfego suficiente (500+ visitantes), você terá dados confiáveis em poucos dias." },
];

export function GeradorCta() {
  const [produto, setProduto] = useState("");
  const [objetivo, setObjetivo] = useState("conversao");
  const [canal, setCanal] = useState("site");
  const [ctas, setCtas] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { generate, loading, error } = useGemini({ tool: "gerador-cta" });

  const gerar = useCallback(async () => {
    if (!produto.trim()) return;
    const objetivos: Record<string, string> = {
      conversao: "converter visitante em cliente/comprador",
      lead: "capturar lead (email/contato)",
      engajamento: "gerar engajamento (curtida, comentário, compartilhamento)",
      download: "fazer o usuário baixar algo",
      inscricao: "fazer o usuário se inscrever",
    };
    const prompt = `Crie 8 CTAs (Calls to Action) de alta conversão para:
Produto/Serviço: ${produto}
Objetivo: ${objetivos[objetivo] || objetivo}
Canal: ${canal}

Regras:
- Use verbos de ação fortes no imperativo
- Crie senso de urgência ou valor em alguns
- Varie entre curtos (2-5 palavras) e médios (5-10 palavras)
- Sejam específicos ao produto
- Um CTA por linha, sem numeração
- Apenas os CTAs, sem explicações`;

    const result = await generate(prompt);
    if (result) {
      const lines = result.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 8);
      setCtas(lines);
    }
  }, [produto, objetivo, canal, generate]);

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
            O gerador cria 8 CTAs (Calls to Action) adaptados ao objetivo e canal escolhidos. A IA
            usa verbos de ação fortes no imperativo, cria senso de valor ou urgência em algumas opções
            e varia entre versões curtas (2-5 palavras) e médias (5-10 palavras) para diferentes
            contextos de uso.
          </p>
          <p>
            O canal importa: CTAs para anúncios pagos são mais diretos e objetivos; CTAs para Instagram
            pedem engajamento; CTAs para email marketing precisam criar curiosidade. Cada geração é
            calibrada para o canal selecionado, maximizando a relevância para o formato de mídia.
          </p>
          <p>
            A psicologia por trás de CTAs eficazes envolve três princípios fundamentais: especificidade
            ("Baixe o guia de 47 páginas" converte mais que "Baixe o guia"), benefício imediato
            (o usuário deve entender o que ganha em menos de 3 palavras) e baixa fricção ("Ver
            demonstração grátis" converte mais que "Comprar agora"). Testes A/B conduzidos por
            plataformas de e-mail marketing mostram que trocar a primeira pessoa — "Quero meu desconto"
            em vez de "Clique aqui" — pode aumentar a taxa de clique em até 90%. O CTA ideal tem no
            máximo 5 palavras e usa verbos no infinitivo ou imperativo com complemento de benefício.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">CTAs para "Curso de Marketing Digital" — objetivo: conversão</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• "Quero dominar o marketing digital agora"</li>
              <li>• "Acesse o curso com 50% de desconto hoje"</li>
              <li>• "Comece sua transformação profissional"</li>
              <li>• "Inscreva-se — vagas limitadas"</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prod-cta">Produto / Serviço *</Label>
            <Input id="prod-cta" placeholder="Ex: Curso de programação online" value={produto} onChange={(e) => setProduto(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="obj-cta">Objetivo</Label>
              <select id="obj-cta" value={objetivo} onChange={(e) => setObjetivo(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="conversao">Venda / Conversão</option>
                <option value="lead">Captura de Lead</option>
                <option value="engajamento">Engajamento</option>
                <option value="download">Download</option>
                <option value="inscricao">Inscrição</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="canal-cta">Canal</Label>
              <select id="canal-cta" value={canal} onChange={(e) => setCanal(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="site">Site / Landing Page</option>
                <option value="email">Email Marketing</option>
                <option value="instagram">Instagram</option>
                <option value="anuncio">Anúncio (Google/Meta)</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
          </div>

          <Button onClick={gerar} disabled={loading || !produto.trim()} className="w-full gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando com IA...</> : <><Sparkles className="h-4 w-4" /> Gerar CTAs com IA</>}
          </Button>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}

          {ctas.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {ctas.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border bg-primary/5 px-4 py-3">
                  <span className="text-sm font-medium">{c}</span>
                  <button onClick={() => handleCopy(c, i)} className="ml-2 text-muted-foreground hover:text-foreground transition-colors">
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
