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
  { question: "Qual tamanho ideal para um QR Code impresso?", answer: "Para impressão: mínimo 2,5cm × 2,5cm. Sempre inclua uma margem branca (quiet zone) de pelo menos 4 módulos ao redor. Teste a leitura antes de imprimir em escala." },
  { question: "QR Codes expiram?", answer: "QR Codes estáticos (como os gerados aqui) não expiram. QR Codes dinâmicos de serviços pagos podem expirar se a assinatura for cancelada." },
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
    <ToolLayout tool={tool} faqs={faqs}>
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
