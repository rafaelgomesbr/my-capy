"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqsDigital = [
  { question: "Qual a diferença entre MB e MiB?", answer: "MB (Megabyte) usa base 10: 1 MB = 1.000.000 bytes. MiB (Mebibyte) usa base 2: 1 MiB = 1.048.576 bytes. Fabricantes de HD e SSD usam MB (base 10) para anunciar capacidade maior. Sistemas operacionais geralmente usam MiB mas exibem como MB." },
  { question: "Por que meu HD de 1 TB aparece como 931 GB no computador?", answer: "O fabricante usa base 10: 1 TB = 1.000.000.000.000 bytes. O Windows usa base 2: 1 TB (real) = 1.099.511.627.776 bytes. Portanto, 1 TB de fabricante = 931,32 GiB no sistema operacional. A diferença (~7%) é estrutural, não uma perda de espaço." },
  { question: "O que é um byte?", answer: "Um byte é a unidade básica de informação digital, composta por 8 bits. Cada bit é um dígito binário (0 ou 1). Um byte pode representar 256 valores diferentes (2^8). Um caractere de texto em ASCII ocupa 1 byte; em UTF-8, caracteres acentuados ocupam 2-3 bytes." },
  { question: "Quanto ocupa uma foto, um vídeo e uma música?", answer: "Foto JPEG: 2-8 MB. Foto RAW: 20-50 MB. Música MP3 (3 min): 3-10 MB. Vídeo Full HD (1 min): 100-300 MB. Vídeo 4K (1 min): 400-700 MB. Arquivo PDF simples: 50-500 KB." },
  { question: "O que é largura de banda em Mbps?", answer: "Megabits por segundo (Mbps) mede velocidade de conexão, diferente de Megabytes (MB) que mede armazenamento. 1 byte = 8 bits. Para baixar 1 GB em 1 minuto, precisa de 8.000 Mbps ÷ 60 ≈ 133 Mbps de velocidade." },
];

function DigitalConverter({ slug, from, to, factor, unit, toUnit }: {
  slug: string; from: string; to: string; factor: number; unit: string; toUnit: string;
}) {
  const tool = getToolBySlug("conversores", slug)!;
  const [value, setValue] = useState("");
  const converted = value !== "" && !isNaN(parseFloat(value)) ? (parseFloat(value) * factor).toFixed(6) : "";

  const explanation = (
    <div className="space-y-3">
      <p>
        O conversor usa a escala decimal (SI): 1 KB = 1.000 bytes, 1 MB = 1.000.000 bytes,
        1 GB = 1.000.000.000 bytes, 1 TB = 1.000.000.000.000 bytes. Esta é a escala usada por
        fabricantes de armazenamento para anunciar capacidade.
      </p>
      <p>
        Vale notar que sistemas operacionais como Windows usam a escala binária (onde 1 GB = 1.073.741.824
        bytes) mas a exibem com a sigla GB (incorretamente — o correto seria GiB). Isso gera a confusão
        do {`"HD que aparece menor no computador"`}: a diferença é de método de cálculo, não de capacidade real.
      </p>
    </div>
  );

  const examples = (
    <div className="space-y-3">
      <div className="rounded-lg border p-4">
        <p className="font-medium">Referência de tamanhos</p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>• Foto JPEG: 3-8 MB</li>
          <li>• Música MP3: 3-10 MB</li>
          <li>• Vídeo FHD (1h): 3-8 GB</li>
          <li>• Jogo AAA: 50-150 GB</li>
          <li>• Backup completo de celular: 10-30 GB</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout tool={tool} faqs={faqsDigital} explanation={explanation} examples={examples}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`from-${slug}`}>{from} ({unit})</Label>
            <Input id={`from-${slug}`} type="number" placeholder="Ex: 1024" value={value} onChange={(e) => setValue(e.target.value)} step="any" />
          </div>
          {converted && (
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">{to} ({toUnit})</p>
              <p className="mt-1 text-2xl font-bold text-primary">{parseFloat(converted).toLocaleString("pt-BR", { maximumFractionDigits: 6 })} {toUnit}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function BytesMb() {
  return <DigitalConverter slug="bytes-mb" from="Bytes" to="Megabytes" factor={1 / 1000000} unit="B" toUnit="MB" />;
}
export function MbGb() {
  return <DigitalConverter slug="mb-gb" from="Megabytes" to="Gigabytes" factor={1 / 1000} unit="MB" toUnit="GB" />;
}
export function GbTb() {
  return <DigitalConverter slug="gb-tb" from="Gigabytes" to="Terabytes" factor={1 / 1000} unit="GB" toUnit="TB" />;
}
