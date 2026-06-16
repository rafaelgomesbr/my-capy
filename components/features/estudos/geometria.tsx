"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const faqsPitag = [
  { question: "Para que serve o Teorema de Pitágoras?", answer: "Para calcular o lado desconhecido de um triângulo retângulo: a² + b² = c², onde c é a hipotenusa (lado oposto ao ângulo reto, sempre o maior). Dado dois lados, calcula-se o terceiro." },
  { question: "O que é hipotenusa?", answer: "A hipotenusa é o lado oposto ao ângulo reto (90°) em um triângulo retângulo. É sempre o maior dos três lados. Nos triângulos notáveis: no 3-4-5, a hipotenusa é 5; no 5-12-13, é 13." },
  { question: "Quais são os triângulos pitagóricos mais conhecidos?", answer: "Ternas pitagóricas (a, b, c onde a²+b²=c²): 3-4-5, 5-12-13, 8-15-17, 7-24-25. Qualquer múltiplo também funciona: 6-8-10, 9-12-15, etc." },
  { question: "Como usar Pitágoras para calcular a diagonal de um quadrado?", answer: "A diagonal de um quadrado de lado L é d = L × √2. Por Pitágoras: d² = L² + L² = 2L². Exemplo: quadrado de lado 5 → diagonal = 5√2 ≈ 7,07." },
  { question: "Pitágoras funciona só com triângulos retângulos?", answer: "Sim. O teorema só se aplica a triângulos retângulos (com ângulo de 90°). Para outros triângulos, usa-se a Lei dos Cossenos: c² = a² + b² - 2ab × cos(C)." },
];

const faqsAreaTri = [
  { question: "Como calcular a área de um triângulo?", answer: "Área = (base × altura) / 2. A altura deve ser perpendicular à base. Para triângulo equilátero de lado L: Área = (L² × √3) / 4. Para triângulo com três lados conhecidos, use a fórmula de Herão." },
  { question: "O que é a fórmula de Herão?", answer: "Para um triângulo com lados a, b, c: s = (a+b+c)/2 (semiperímetro). Área = √(s(s-a)(s-b)(s-c)). Útil quando não se conhece a altura mas se conhecem os três lados." },
  { question: "A altura de um triângulo é sempre interna?", answer: "Não. Em triângulos obtusos (com ângulo > 90°), a altura de alguns lados cai fora do triângulo. Mesmo assim, a fórmula (base × altura) / 2 continua válida com a altura correta." },
  { question: "Como calcular a área de um triângulo equilátero?", answer: "Área = (√3 / 4) × L², onde L é o comprimento do lado. Ex: triângulo equilátero de lado 6 → Área = (√3/4) × 36 ≈ 15,59 unidades²." },
  { question: "Qual a unidade do resultado de área?", answer: "A área é expressa em unidades quadradas da unidade usada nas medidas (ex: cm² se as medidas são em cm, m² se em metros). Para converter: 1 m² = 10.000 cm²." },
];

const faqsCirc = [
  { question: "Qual a fórmula da área do círculo?", answer: "Área = π × r², onde r é o raio (metade do diâmetro) e π ≈ 3,14159. Circunferência = 2 × π × r = π × diâmetro." },
  { question: "Qual a diferença entre círculo e circunferência?", answer: "Circunferência é o perímetro do círculo — a linha curva que forma a borda. Círculo é o conjunto de todos os pontos, incluindo o interior. Na linguagem cotidiana, ambos são usados para o mesmo objeto." },
  { question: "Como calcular o diâmetro dado a circunferência?", answer: "d = C / π. Ex: circunferência de 31,4 cm → diâmetro = 31,4 / 3,14159 ≈ 10 cm, raio ≈ 5 cm." },
  { question: "O que é π (pi)?", answer: "Pi (π) é a razão constante entre a circunferência e o diâmetro de qualquer círculo: π = C/d ≈ 3,14159265... É um número irracional com infinitas casas decimais sem repetição." },
  { question: "Como converter raio para diâmetro?", answer: "Diâmetro = 2 × raio. Raio = diâmetro / 2. O raio é a distância do centro à borda; o diâmetro é a distância máxima entre dois pontos opostos da borda, passando pelo centro." },
];

const faqsVol = [
  { question: "Como calcular o volume de um paralelepípedo?", answer: "Volume = comprimento × largura × altura. Para um cubo (todos lados iguais a): Volume = a³. A área superficial do cubo = 6a²; do paralelepípedo = 2(ab + bc + ac)." },
  { question: "Qual a diferença entre volume e capacidade?", answer: "Volume é a medida em unidades cúbicas (cm³, m³). Capacidade é expressa em litros. 1 litro = 1 dm³ = 1.000 cm³. Um cubo de 10cm × 10cm × 10cm tem volume de 1.000 cm³ = 1 litro." },
  { question: "Como calcular volume de um cilindro?", answer: "Volume cilindro = π × r² × h, onde r é o raio da base e h é a altura. Ex: cilindro com raio 5 cm e altura 10 cm → V = π × 25 × 10 ≈ 785,4 cm³ ≈ 0,785 litros." },
  { question: "Como calcular a área superficial de um paralelepípedo?", answer: "Área = 2 × (ab + bc + ac), onde a, b, c são as dimensões (comprimento, largura, altura). Para um cubo de lado a: Área = 6a²." },
  { question: "Para que calcular área superficial?", answer: "A área superficial é útil para calcular a quantidade de tinta para pintar um objeto, a quantidade de papel para embrulhar uma caixa, ou o material necessário para fabricar uma embalagem." },
];

export function Pitagoras() {
  const tool = getToolBySlug("estudos", "pitagoras")!;
  const [a, setA] = useState(""); const [b, setB] = useState(""); const [c, setC] = useState("");
  const fa = parseFloat(a), fb = parseFloat(b), fc = parseFloat(c);
  const hipotenusa = !isNaN(fa) && !isNaN(fb) && fa > 0 && fb > 0 ? Math.sqrt(fa * fa + fb * fb).toFixed(4) : null;
  const cateto = !isNaN(fc) && !isNaN(fa) && fc > fa ? Math.sqrt(fc * fc - fa * fa).toFixed(4) : null;

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsPitag}
      explanation={
        <div className="space-y-3">
          <p>
            O Teorema de Pitágoras estabelece que em todo triângulo retângulo a soma dos quadrados dos
            catetos é igual ao quadrado da hipotenusa: <strong>a² + b² = c²</strong>. A ferramenta aceita
            dois valores e calcula o terceiro automaticamente — forneça os dois catetos para obter a
            hipotenusa, ou a hipotenusa e um cateto para obter o cateto restante.
          </p>
          <p>
            A aplicação prática é enorme: carpinteiros verificam ângulos retos (se 3²+4²=5², o canto é
            reto), engenheiros calculam diagonais de estruturas, GPS calcula distâncias em coordenadas
            cartesianas, e jogos calculam distâncias entre pontos no espaço.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Verificar canto reto na construção</p>
            <p className="mt-1 text-sm text-muted-foreground">Catetos: 3 m e 4 m → Hipotenusa = √(9+16) = √25 = 5 m</p>
            <p className="mt-1 text-sm text-primary font-semibold">Se a diagonal mede 5 m, o ângulo é exatamente 90°</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Diagonal de uma TV</p>
            <p className="mt-1 text-sm text-muted-foreground">Largura: 122 cm, Altura: 68,5 cm → Diagonal = √(122²+68,5²) ≈ 140 cm ≈ 55 polegadas</p>
          </div>
        </div>
      }
    >
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

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsAreaTri}
      explanation={
        <div className="space-y-3">
          <p>
            A área de um triângulo é calculada pela fórmula <strong>A = (base × altura) / 2</strong>.
            A altura deve ser a medida perpendicular à base — não o lado inclinado. Para triângulos
            retângulos, os catetos servem como base e altura um do outro.
          </p>
          <p>
            O fator 1/2 existe porque um triângulo é exatamente metade de um paralelogramo (retângulo).
            Qualquer paralelogramo pode ser cortado na diagonal para formar dois triângulos de mesma área.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Lote triangular</p>
            <p className="mt-1 text-sm text-muted-foreground">Base: 20 m, Altura: 15 m</p>
            <p className="mt-1 text-sm text-primary font-semibold">Área = (20 × 15) / 2 = 150 m²</p>
          </div>
        </div>
      }
    >
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

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsCirc}
      explanation={
        <div className="space-y-3">
          <p>
            A área do círculo é <strong>A = π × r²</strong> e a circunferência (perímetro) é
            <strong> C = 2 × π × r</strong>. A ferramenta usa o valor de π com precisão total do
            JavaScript (Math.PI ≈ 3,141592653589793).
          </p>
          <p>
            Conhecendo o raio você obtém área e perímetro simultaneamente. Se você conhece apenas o
            diâmetro, divida por 2 para obter o raio. Se conhece a circunferência, o raio é r = C / (2π).
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Pizza de 35 cm de diâmetro</p>
            <p className="mt-1 text-sm text-muted-foreground">Raio = 17,5 cm</p>
            <p className="mt-1 text-sm text-primary font-semibold">Área = π × 17,5² ≈ 962,1 cm²</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Piscina circular com raio 4 m</p>
            <p className="mt-1 text-sm text-muted-foreground">Área = π × 16 ≈ 50,27 m² | Circunferência ≈ 25,13 m</p>
          </div>
        </div>
      }
    >
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

  return (
    <ToolLayout
      tool={tool}
      faqs={faqsVol}
      explanation={
        <div className="space-y-3">
          <p>
            O volume de um paralelepípedo retangular (caixa) é <strong>V = a × b × c</strong> e a área
            superficial total é <strong>S = 2(ab + bc + ac)</strong>. Se apenas o lado "a" for fornecido,
            a ferramenta calcula como cubo perfeito (a = b = c).
          </p>
          <p>
            A área superficial é importante para calcular materiais de revestimento, embalagem ou pintura.
            O volume é usado para calcular capacidade de caixas, piscinas, reservatórios e espaços de
            armazenamento.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Caixa de papelão</p>
            <p className="mt-1 text-sm text-muted-foreground">40 cm × 30 cm × 20 cm</p>
            <p className="mt-1 text-sm text-primary font-semibold">Volume = 24.000 cm³ = 24 litros | Área = 5.200 cm²</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Aquário cúbico de lado 50 cm</p>
            <p className="mt-1 text-sm text-muted-foreground">Apenas lado a = 50 cm</p>
            <p className="mt-1 text-sm text-primary font-semibold">Volume = 125.000 cm³ = 125 litros</p>
          </div>
        </div>
      }
    >
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
