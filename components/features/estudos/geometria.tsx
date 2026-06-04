"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqsGeo = [{ question: "Para que serve o Teorema de Pitágoras?", answer: "Para calcular o lado desconhecido de um triângulo retângulo: a² + b² = c², onde c é a hipotenusa (lado maior)." }];

export function Pitagoras() {
  const tool = getToolBySlug("estudos", "pitagoras")!;
  const [a, setA] = useState(""); const [b, setB] = useState(""); const [c, setC] = useState("");
  const fa = parseFloat(a), fb = parseFloat(b), fc = parseFloat(c);
  const hipotenusa = !isNaN(fa) && !isNaN(fb) && fa > 0 && fb > 0 ? Math.sqrt(fa * fa + fb * fb).toFixed(4) : null;
  const cateto = !isNaN(fc) && !isNaN(fa) && fc > fa ? Math.sqrt(fc * fc - fa * fa).toFixed(4) : null;

  return (
    <ToolLayout tool={tool} faqs={faqsGeo}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <p className="rounded-lg bg-muted/50 p-3 text-center font-mono">a² + b² = c²</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="a-pit">Cateto a</Label><Input id="a-pit" type="number" placeholder="Ex: 3" value={a} onChange={(e) => setA(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="b-pit">Cateto b</Label><Input id="b-pit" type="number" placeholder="Ex: 4" value={b} onChange={(e) => setB(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="c-pit">Hipotenusa c</Label><Input id="c-pit" type="number" placeholder="Ex: 5" value={c} onChange={(e) => setC(e.target.value)} /></div>
          </div>
          {(hipotenusa || cateto) && (
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              {hipotenusa && !c && <><p className="text-xs text-muted-foreground">Hipotenusa (c)</p><p className="text-2xl font-bold text-primary">{hipotenusa}</p></>}
              {cateto && <><p className="text-xs text-muted-foreground">Cateto desconhecido</p><p className="text-2xl font-bold text-primary">{cateto}</p></>}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function AreaTriangulo() {
  const tool = getToolBySlug("estudos", "area-triangulo")!;
  const [base, setBase] = useState(""); const [altura, setAltura] = useState("");
  const area = base && altura && !isNaN(parseFloat(base)) && !isNaN(parseFloat(altura))
    ? ((parseFloat(base) * parseFloat(altura)) / 2).toFixed(4) : null;
  const faqs = [{ question: "Como calcular a área de um triângulo?", answer: "Área = (base × altura) / 2. A altura deve ser perpendicular à base." }];

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="base-tri">Base</Label><Input id="base-tri" type="number" placeholder="Ex: 6" value={base} onChange={(e) => setBase(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="alt-tri">Altura</Label><Input id="alt-tri" type="number" placeholder="Ex: 4" value={altura} onChange={(e) => setAltura(e.target.value)} /></div>
          </div>
          {area && <div className="rounded-lg bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Área</p><p className="text-2xl font-bold text-primary">{area} u²</p></div>}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function AreaCirculo() {
  const tool = getToolBySlug("estudos", "area-circulo")!;
  const [raio, setRaio] = useState("");
  const r = parseFloat(raio);
  const area = raio && !isNaN(r) ? (Math.PI * r * r).toFixed(4) : null;
  const circunf = raio && !isNaN(r) ? (2 * Math.PI * r).toFixed(4) : null;
  const faqs = [{ question: "Qual a fórmula da área do círculo?", answer: "Área = π × r², onde r é o raio. Circunferência = 2 × π × r." }];

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2"><Label htmlFor="raio-circ">Raio (r)</Label><Input id="raio-circ" type="number" placeholder="Ex: 5" value={raio} onChange={(e) => setRaio(e.target.value)} step="0.01" /></div>
          {area && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Área</p><p className="text-2xl font-bold text-primary">{area} u²</p></div>
              <div className="rounded-lg bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Circunferência</p><p className="text-2xl font-bold">{circunf} u</p></div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function VolumeCubo() {
  const tool = getToolBySlug("estudos", "volume-cubo")!;
  const [a, setA] = useState(""); const [b, setB] = useState(""); const [c, setC] = useState("");
  const fa = parseFloat(a), fb = parseFloat(b) || parseFloat(a), fc = parseFloat(c) || parseFloat(a);
  const volume = a && !isNaN(fa) ? (fa * fb * fc).toFixed(4) : null;
  const areaSuperficial = a && !isNaN(fa) ? (2 * (fa * fb + fb * fc + fa * fc)).toFixed(4) : null;
  const faqs = [{ question: "Como calcular o volume de um paralelepípedo?", answer: "Volume = comprimento × largura × altura. Para um cubo, todos os lados são iguais: Volume = a³." }];

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">Deixe b e c em branco para calcular um cubo (todos lados iguais)</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="a-vol">Lado a</Label><Input id="a-vol" type="number" placeholder="Ex: 4" value={a} onChange={(e) => setA(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="b-vol">Lado b</Label><Input id="b-vol" type="number" placeholder="Opcional" value={b} onChange={(e) => setB(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="c-vol">Lado c</Label><Input id="c-vol" type="number" placeholder="Opcional" value={c} onChange={(e) => setC(e.target.value)} /></div>
          </div>
          {volume && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Volume</p><p className="text-2xl font-bold text-primary">{volume} u³</p></div>
              <div className="rounded-lg bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Área superficial</p><p className="text-2xl font-bold">{areaSuperficial} u²</p></div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
