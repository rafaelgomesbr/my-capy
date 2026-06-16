"use client";

import { useState, useCallback, useRef } from "react";
import { Download, QrCode } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("utilidades", "gerador-qr-code")!;
const faqs = [
  { question: "Qual tamanho ideal para um QR Code impresso?", answer: "Para impressão: mínimo 2,5cm × 2,5cm. Para leitura a distância (cartaz, banner), aumente proporcionalmente — 1 metro de distância de leitura exige aproximadamente 8cm de QR Code. Sempre inclua uma margem branca (quiet zone) de pelo menos 4 módulos ao redor para garantir a leitura." },
  { question: "QR Codes expiram?", answer: "QR Codes estáticos (como os gerados aqui) não expiram — eles codificam o conteúdo diretamente, sem depender de servidores externos. QR Codes dinâmicos de serviços pagos redirecionam para uma URL que pode expirar se a assinatura for cancelada. Os QR Codes gerados aqui são permanentes." },
  { question: "Como funciona o QR Code de WhatsApp gerado?", answer: "O QR Code de WhatsApp usa o formato wa.me/[número] — quando escaneado, abre automaticamente uma conversa com o número no WhatsApp. Digite o número com o código do país (55 para Brasil) e DDD, sem espaços ou caracteres especiais. Ex: 5511999999999." },
  { question: "Posso personalizar as cores do QR Code?", answer: "Atualmente, o gerador cria QR Codes em preto e branco padrão, que garantem a máxima legibilidade. Evite inverter as cores (fundo escuro com módulos claros) pois alguns leitores têm dificuldade. Se precisar de cores personalizadas com logotipo, use ferramentas especializadas como o QR Code com nível de correção de erro 'H'." },
  { question: "Qual a capacidade máxima de dados em um QR Code?", answer: "Um QR Code pode armazenar até 7.089 caracteres numéricos, 4.296 caracteres alfanuméricos ou 2.953 bytes binários. Para URLs curtas e textos simples, isso é mais que suficiente. Quanto mais dados, mais densa e difícil de ler a imagem — mantenha o conteúdo conciso para garantir leitura rápida." },
];

const typeLabels: Record<string, string> = {
  url: "URL / Link",
  text: "Texto",
  email: "E-mail",
  tel: "Telefone",
  whatsapp: "WhatsApp",
};

const typePrefixes: Record<string, string> = {
  email: "mailto:",
  tel: "tel:",
  whatsapp: "https://wa.me/",
};

const typePlaceholders: Record<string, string> = {
  url: "https://exemplo.com",
  text: "Seu texto aqui",
  email: "email@exemplo.com",
  tel: "+5511999999999",
  whatsapp: "5511999999999",
};

export function GeradorQrCode() {
  const [content, setContent] = useState("https://mycapy.app");
  const [type, setType] = useState("url");
  const [size, setSize] = useState("300");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQr = useCallback(async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError("");

    try {
      const QRCode = (await import("qrcode")).default;
      const prefix = typePrefixes[type] ?? "";
      const data = prefix + content.trim();
      const px = parseInt(size);

      const dataUrl = await QRCode.toDataURL(data, {
        width: px,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      setError("Erro ao gerar QR Code. Verifique o conteúdo e tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [content, type, size]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qrcode-mycapy.png`;
    link.click();
  };

  return (
    <ToolLayout
      tool={tool}
      faqs={faqs}
      explanation={
        <div className="space-y-3">
          <p>
            O gerador usa a biblioteca open source <em>qrcode</em> para criar QR Codes estáticos
            diretamente no seu navegador. Suporta 5 tipos de conteúdo: URL/Link (abre no navegador),
            Texto simples, E-mail (abre cliente de e-mail), Telefone (inicia chamada) e WhatsApp
            (abre conversa diretamente).
          </p>
          <p>
            O nível de correção de erro M (15%) garante que o QR Code seja legível mesmo com até
            15% dos módulos danificados ou obstruídos — ideal para uso em materiais impressos.
            Escolha o tamanho 600×600 para impressão e 300×300 para uso digital.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Casos de uso por tipo</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• <strong>URL:</strong> cardápio digital, portfólio, landing page</li>
              <li>• <strong>WhatsApp:</strong> atendimento direto no número da loja</li>
              <li>• <strong>E-mail:</strong> contato em cartão de visita</li>
              <li>• <strong>Texto:</strong> instruções, código de produto, senha Wi-Fi</li>
            </ul>
          </div>
        </div>
      }
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type-qr">Tipo de conteúdo</Label>
              <select
                id="type-qr"
                value={type}
                onChange={(e) => { setType(e.target.value); setQrDataUrl(""); }}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {Object.entries(typeLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size-qr">Tamanho (px)</Label>
              <select
                id="size-qr"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="200">200×200 (pequeno)</option>
                <option value="300">300×300 (médio)</option>
                <option value="400">400×400 (grande)</option>
                <option value="600">600×600 (alta resolução)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-qr">{typeLabels[type]}</Label>
            <Input
              id="content-qr"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={typePlaceholders[type] ?? ""}
              onKeyDown={(e) => e.key === "Enter" && generateQr()}
            />
          </div>

          <Button onClick={generateQr} disabled={loading || !content.trim()} className="w-full gap-2">
            {loading ? (
              <><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> Gerando...</>
            ) : (
              <><QrCode className="h-4 w-4" /> Gerar QR Code</>
            )}
          </Button>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>
          )}

          {qrDataUrl && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-xl border-2 border-border bg-white p-4 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt={`QR Code para: ${content}`}
                  width={parseInt(size)}
                  height={parseInt(size)}
                  className="block"
                  style={{ maxWidth: "280px", height: "auto" }}
                />
              </div>
              <p className="max-w-xs text-center text-xs text-muted-foreground">
                Conteúdo: {typePrefixes[type] ?? ""}{content}
              </p>
              <Button variant="outline" onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" /> Baixar PNG
              </Button>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
