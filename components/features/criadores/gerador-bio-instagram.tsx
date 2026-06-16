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

const tool = getToolBySlug("criadores", "gerador-bio-instagram")!;
const faqs = [
  { question: "Quantos caracteres tem a bio do Instagram?", answer: "A bio do Instagram permite até 150 caracteres. Aproveite emojis e quebras de linha para destacar informações importantes de forma visual e otimizar o espaço." },
  { question: "O que não pode faltar na bio?", answer: "Uma bio eficaz tem: quem você é, o que você faz, para quem você faz, e um CTA (chamada para ação) — ex: 'Acesse o link abaixo' ou 'DM para parceria'." },
  { question: "Emojis na bio ajudam ou atrapalham?", answer: "Emojis usados estrategicamente ajudam: substituem palavras (economizando caracteres), criam hierarquia visual e tornam a bio mais dinâmica. Use 3-5 emojis relevantes ao seu nicho, não encha de emojis aleatórios." },
  { question: "Devo colocar o nome ou o nicho no campo 'nome' do perfil?", answer: "O campo 'nome' (acima da bio, em negrito) aparece nas buscas do Instagram. Criadores de conteúdo costumam colocar Nome + Nicho (ex: 'Maria | Coach de Finanças') para aumentar a descoberta por pesquisa." },
  { question: "Com que frequência devo atualizar minha bio?", answer: "Atualize a bio sempre que sua proposta de valor mudar, ao lançar um produto ou curso, ao participar de um evento ou ao mudar o CTA. Uma bio desatualizada passa falta de credibilidade." },
];

export function GeradorBioInstagram() {
  const [nome, setNome] = useState("");
  const [profissao, setProfissao] = useState("");
  const [proposta, setProposta] = useState("");
  const [cta, setCta] = useState("");
  const [bios, setBios] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { generate, loading, error } = useGemini({ tool: "gerador-bio-instagram" });

  const gerar = useCallback(async () => {
    if (!profissao.trim()) return;
    const prompt = `Crie 3 versões de bio para Instagram com até 150 caracteres cada.
Nome: ${nome || "não informado"}
Profissão/Nicho: ${profissao}
Proposta de valor: ${proposta || "não informado"}
CTA desejado: ${cta || "não informado"}

Regras:
- Use emojis relevantes
- Seja direto e impactante
- Cada bio em um bloco separado por linha em branco
- Máximo 150 caracteres por bio
- Inclua quebras de linha (\n) para separar as partes da bio
- Apenas as bios, sem numeração ou explicações`;

    const result = await generate(prompt);
    if (result) {
      const blocks = result.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
      setBios(blocks.slice(0, 3));
    }
  }, [nome, profissao, proposta, cta, generate]);

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
            O gerador cria 3 versões de bio para Instagram com até 150 caracteres cada, usando IA
            para combinar seu nome, profissão, proposta de valor e CTA em textos concisos e impactantes.
            Cada versão tem um estilo diferente — desde mais profissional até mais descontraída.
          </p>
          <p>
            Quanto mais detalhes você preencher (proposta de valor e CTA), mais personalizada e eficaz
            será a bio gerada. O campo de profissão/nicho é obrigatório. Copie a versão que mais
            combina com seu perfil e ajuste ao seu gosto pessoal.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Exemplo de bio bem estruturada (150 chars)</p>
            <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
              {`💰 Coach de Finanças\nAjudo você a sair das dívidas em 90 dias\n📚 + de 1.000 alunos transformados\n👇 Acesse o treinamento gratuito`}
            </p>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome-bio">Seu nome (opcional)</Label>
              <Input id="nome-bio" placeholder="Ex: Maria Silva" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prof-bio">Profissão / Nicho *</Label>
              <Input id="prof-bio" placeholder="Ex: Coach de Finanças" value={profissao} onChange={(e) => setProfissao(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prop-bio">Proposta de valor</Label>
              <Input id="prop-bio" placeholder="Ex: Ajudo a sair das dívidas em 90 dias" value={proposta} onChange={(e) => setProposta(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-bio">Call to Action</Label>
              <Input id="cta-bio" placeholder="Ex: Acesse o link para o curso gratuito" value={cta} onChange={(e) => setCta(e.target.value)} />
            </div>
          </div>

          <Button onClick={gerar} disabled={loading || !profissao.trim()} className="w-full gap-2">
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Gerando com IA...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Gerar Bios com IA</>
            )}
          </Button>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}

          {bios.map((bio, i) => (
            <div key={i} className="rounded-xl border p-4 space-y-2">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{bio}</pre>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${bio.length > 150 ? "text-red-500" : "text-muted-foreground"}`}>
                  {bio.replace(/\n/g, "").length}/150 chars
                </span>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(bio, i)} className="gap-1.5 h-8">
                  {copiedIdx === i ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedIdx === i ? "Copiado!" : "Copiar"}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
