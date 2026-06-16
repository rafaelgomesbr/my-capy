"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw, Shield } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("utilidades", "gerador-senhas")!;
const faqs = [
  { question: "O que torna uma senha forte?", answer: "Uma senha forte tem pelo menos 12 caracteres, combina maiúsculas, minúsculas, números e símbolos, não usa palavras do dicionário e é única para cada serviço. Uma senha de 16 caracteres com todos os tipos leva bilhões de anos para ser quebrada por força bruta." },
  { question: "Como gerenciar senhas fortes?", answer: "Use um gerenciador de senhas como Bitwarden (gratuito e open source) ou 1Password para armazenar senhas fortes sem precisar memorizá-las. Você precisa lembrar apenas uma senha mestra para acessar todas as outras. Nunca reutilize a mesma senha em serviços diferentes." },
  { question: "Por que não devo usar palavras do dicionário na senha?", answer: "Ataques de dicionário testam automaticamente palavras comuns e suas variações (senha123, p@ssword). Mesmo com substituições de letras por números, senhas baseadas em palavras reais são vulneráveis. Uma senha aleatória gerada por computador é exponencialmente mais segura." },
  { question: "Com que frequência devo trocar minhas senhas?", answer: "Troque imediatamente após suspeitar de vazamento. Para senhas importantes (banco, email principal), a troca anual é recomendada. Use sites como HaveIBeenPwned para verificar se seu e-mail apareceu em vazamentos. Senhas longas e únicas por serviço são mais importantes que trocar frequentemente." },
  { question: "Esta ferramenta guarda minhas senhas geradas?", answer: "Não. A geração acontece inteiramente no seu navegador usando a API crypto.getRandomValues() — nenhum dado é enviado a servidores. A senha gerada existe apenas na tela e na área de transferência do seu dispositivo. Após fechar ou atualizar a página, ela não pode ser recuperada." },
];

const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function getStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { score, label: "Fraca", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Média", color: "bg-amber-500" };
  if (score <= 5) return { score, label: "Boa", color: "bg-blue-500" };
  return { score, label: "Forte", color: "bg-emerald-500" };
}

export function GeradorSenhas() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let charset = "";
    if (useUpper) charset += CHARS.upper;
    if (useLower) charset += CHARS.lower;
    if (useNumbers) charset += CHARS.numbers;
    if (useSymbols) charset += CHARS.symbols;
    if (!charset) return;
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const pwd = Array.from(array, (n) => charset[n % charset.length]).join("");
    setPassword(pwd);
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  const handleCopy = () => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const strength = password ? getStrength(password) : null;

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador usa a API <code className="rounded bg-muted px-1 font-mono text-xs">crypto.getRandomValues()</code> do
            navegador para gerar números verdadeiramente aleatórios — diferente de Math.random() que
            usa um algoritmo determinístico. Cada byte da senha é derivado de entropia criptográfica,
            tornando a senha imprevisível mesmo que o atacante conheça o algoritmo.
          </p>
          <p>
            Configure o comprimento (8-64 caracteres) e quais tipos de caracteres incluir. Uma senha
            de 16 caracteres com maiúsculas, minúsculas, números e símbolos gera um espaço de busca
            de aproximadamente 95¹⁶ combinações — computacionalmente inviável de quebrar por força bruta.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Níveis de segurança por configuração</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Fraca (8 chars, só letras):</strong> quebrável em horas</li>
              <li>• <strong>Boa (12 chars, +números):</strong> segura para uso geral</li>
              <li>• <strong>Forte (16 chars, todos tipos):</strong> recomendado para contas críticas</li>
              <li>• <strong>Máxima (24+ chars, todos tipos):</strong> uso em gerenciadores de senha</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="len-pwd">Comprimento: {length} caracteres</Label>
            </div>
            <input
              id="len-pwd"
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-primary"
              aria-label="Comprimento da senha"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Maiúsculas (A-Z)", state: useUpper, set: setUseUpper },
              { label: "Minúsculas (a-z)", state: useLower, set: setUseLower },
              { label: "Números (0-9)", state: useNumbers, set: setUseNumbers },
              { label: "Símbolos (!@#)", state: useSymbols, set: setUseSymbols },
            ].map((opt) => (
              <div key={opt.label} className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor={`sw-${opt.label}`} className="cursor-pointer text-sm">{opt.label}</Label>
                <Switch id={`sw-${opt.label}`} checked={opt.state} onCheckedChange={opt.set} />
              </div>
            ))}
          </div>
          <Button onClick={generate} className="w-full gap-2">
            <RefreshCw className="h-4 w-4" /> Gerar Senha
          </Button>
          {password && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
                <Shield className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 font-mono text-lg break-all">{password}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleCopy} aria-label="Copiar senha">
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {strength && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Força da senha</span>
                    <span className="font-medium">{strength.label}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className={`h-2 rounded-full transition-all ${strength.color}`} style={{ width: `${(strength.score / 7) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
