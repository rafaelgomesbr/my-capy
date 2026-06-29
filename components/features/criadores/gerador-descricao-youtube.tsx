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
  { question: "Como escrever uma boa descrição no YouTube?", answer: "Inclua as palavras-chave principais nas primeiras 3 linhas (visíveis sem expandir), links relevantes, timestamps, suas redes sociais e de 3 a 5 hashtags no final. As primeiras 150 caracteres são exibidas nas buscas do Google — use-os para convencer o usuário a clicar." },
  { question: "As palavras-chave na descrição afetam o SEO do YouTube?", answer: "Sim. O algoritmo do YouTube analisa título, tags E descrição para entender do que trata o vídeo. Use palavras-chave naturalmente ao longo do texto — não repita a mesma palavra artificialmente (keyword stuffing). Uma descrição bem escrita melhora a descoberta orgânica." },
  { question: "Qual o tamanho ideal de descrição no YouTube?", answer: "YouTube permite até 5.000 caracteres. Para SEO, descrições entre 500-800 palavras são consideradas ideais, pois oferecem contexto suficiente para o algoritmo. As primeiras 2-3 linhas são as mais importantes — aparecem sem que o usuário precise clicar em 'mostrar mais'." },
  { question: "Devo incluir timestamps (capítulos) na descrição?", answer: "Sim, timestamps melhoram a experiência do usuário e criam 'capítulos' automáticos no player. Use o formato 00:00 Introdução, 02:30 Tópico A. Isso também ajuda no SEO, pois o Google pode exibir trechos específicos do vídeo nos resultados de busca." },
  { question: "Preciso mudar a descrição depois de publicar o vídeo?", answer: "Você pode e deve atualizar as descrições. Adicionar links para vídeos relacionados, corrigir informações desatualizadas ou incluir promoções temporárias são ajustes válidos. Mudanças significativas no conteúdo, porém, podem afetar o ranqueamento temporariamente." },
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
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador cria uma descrição completa e otimizada para SEO com 500-800 palavras — o
            intervalo ideal para o algoritmo do YouTube. A descrição inclui parágrafo de abertura com
            palavra-chave, resumo detalhado, seções de links e redes sociais, CTA de inscrição e
            hashtags relevantes.
          </p>
          <p>
            As primeiras 2-3 linhas da descrição são as mais críticas — aparecem nos resultados de
            busca do Google e YouTube sem que o usuário precise clicar em "mostrar mais". O gerador
            posiciona a palavra-chave principal nesse trecho para maximizar a relevância e o CTR.
          </p>
          <p>
            O algoritmo do YouTube usa a descrição de três formas distintas: para classificar o vídeo
            em buscas internas, para sugerir o vídeo no painel lateral como recomendação, e para
            decidir se o vídeo aparece em resultados do Google. A palavra-chave principal deve estar
            nas primeiras 25 palavras e ser repetida 2-3 vezes ao longo do texto de forma natural.
            Timestamps (capítulos) na descrição têm duplo benefício: melhoram a retenção do
            espectador — que pula para a parte relevante em vez de abandonar o vídeo — e criam
            fragmentos indexáveis que podem aparecer individualmente nos resultados de busca do
            Google, amplificando o alcance orgânico do vídeo.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Estrutura da descrição gerada</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Abertura:</strong> Palavra-chave + resumo do valor do vídeo (2-3 linhas)</li>
              <li>• <strong>Sobre este vídeo:</strong> Detalhe dos tópicos abordados</li>
              <li>• <strong>Links úteis:</strong> Placeholders para você preencher</li>
              <li>• <strong>Redes sociais:</strong> Seus perfis para divulgação</li>
              <li>• <strong>Hashtags:</strong> 3-5 hashtags de nicho no final</li>
            </ul>
          </div>
        </div>
      }
    >
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
