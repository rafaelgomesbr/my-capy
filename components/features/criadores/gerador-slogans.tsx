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

const tool = getToolBySlug("criadores", "gerador-slogans")!;
const faqs = [
  { question: "O que torna um slogan inesquecível?", answer: "Slogans memoráveis são curtos (3-7 palavras), rimam ou têm ritmo, comunicam o benefício principal, são únicos e fáceis de repetir. 'Just Do It' da Nike tem apenas 3 palavras mas carrega toda a identidade da marca. Menos é mais." },
  { question: "Slogan e tagline são a mesma coisa?", answer: "São termos frequentemente usados como sinônimos, mas há uma distinção: o slogan pode mudar por campanha (ex: 'Porque você vale muito' da L'Oréal por anos, mas com variações). A tagline é mais permanente e faz parte do posicionamento da marca. Ambos devem reforçar o benefício principal." },
  { question: "Meu slogan precisa mencionar o produto?", answer: "Não necessariamente. Os melhores slogans evocam o sentimento ou benefício, não o produto. 'Abra a Felicidade' (Coca-Cola) não menciona refrigerante. O importante é que o slogan seja associado imediatamente à sua marca no contexto correto." },
  { question: "Posso usar um slogan gerado por IA comercialmente?", answer: "Sim, mas verifique antes se o slogan não está registrado por outra empresa. Faça uma busca no Google e no banco de marcas do INPI (Instituto Nacional da Propriedade Industrial) para garantir que o slogan escolhido está disponível para uso comercial." },
  { question: "Quantos slogans devo testar antes de escolher?", answer: "Teste ao menos 5-10 opções com pessoas do seu público-alvo. Pergunte qual é mais fácil de lembrar 24 horas depois — esse é geralmente o melhor. A ferramenta gera 8 opções com estilos diferentes para você comparar e escolher o que mais ressoa." },
];

export function GeradorSlogans() {
  const [marca, setMarca] = useState("");
  const [produto, setProduto] = useState("");
  const [valores, setValores] = useState("");
  const [slogans, setSlogans] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { generate, loading, error } = useGemini({ tool: "gerador-slogans" });

  const gerar = useCallback(async () => {
    if (!produto.trim()) return;
    const prompt = `Crie 8 slogans memoráveis e originais para:
Marca/Empresa: ${marca || "não informado"}
Produto/Serviço: ${produto}
Valores/Diferenciais: ${valores || "qualidade, confiança, inovação"}

Regras:
- Cada slogan deve ter 3 a 8 palavras
- Misture estilos: emotivo, racional, aspiracional, humorístico
- Todos em português do Brasil
- Sejam únicos e impossíveis de copiar
- Um slogan por linha, sem numeração ou aspas
- Apenas os slogans, sem explicações`;

    const result = await generate(prompt);
    if (result) {
      const lines = result.split("\n").map((l) => l.trim().replace(/^["']|["']$/g, "")).filter(Boolean).slice(0, 8);
      setSlogans(lines);
    }
  }, [marca, produto, valores, generate]);

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
            O gerador cria 8 slogans com 3 a 8 palavras cada, misturando diferentes estilos:
            emotivo (apela a sentimentos), racional (benefício claro), aspiracional (promessa de
            transformação) e humorístico (leveza e memorabilidade). Todos ficam dentro do limite ideal
            para memorização.
          </p>
          <p>
            Quanto mais específico você for nos valores e diferenciais da marca, mais personalizados
            serão os slogans. A IA evita slogans genéricos e tenta criar opções que sejam únicas ao
            seu posicionamento. Combine slogans de estilos diferentes para criar variações por campanha.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Estilos de slogan para "App de finanças pessoais"</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Emotivo:</strong> "Sua paz financeira começa aqui"</li>
              <li>• <strong>Racional:</strong> "Controle total em 5 minutos por dia"</li>
              <li>• <strong>Aspiracional:</strong> "Da dívida à independência financeira"</li>
              <li>• <strong>Humorístico:</strong> "Dinheiro não dá em árvore. Mas dá pra guardar."</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="marc-sl">Nome da marca (opcional)</Label>
              <Input id="marc-sl" placeholder="Ex: TechPro" value={marca} onChange={(e) => setMarca(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-sl">Produto / Serviço *</Label>
              <Input id="prod-sl" placeholder="Ex: Software de gestão financeira" value={produto} onChange={(e) => setProduto(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="val-sl">Valores / Diferenciais (opcional)</Label>
            <Input id="val-sl" placeholder="Ex: simplicidade, rapidez, confiança" value={valores} onChange={(e) => setValores(e.target.value)} />
          </div>

          <Button onClick={gerar} disabled={loading || !produto.trim()} className="w-full gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando com IA...</> : <><Sparkles className="h-4 w-4" /> Gerar Slogans com IA</>}
          </Button>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}

          {slogans.length > 0 && (
            <div className="space-y-2">
              {slogans.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border px-4 py-3 transition-colors hover:bg-muted/30">
                  <span className="italic font-medium">&ldquo;{s}&rdquo;</span>
                  <button onClick={() => handleCopy(s, i)} className="ml-3 text-muted-foreground hover:text-foreground transition-colors">
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
