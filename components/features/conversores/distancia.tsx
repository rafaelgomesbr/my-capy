"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

function SimpleConverter({ toolSlug, fromLabel, factor, toLabel, fromUnit, toUnit, faqs, explanation, examples }: {
  toolSlug: string; fromLabel: string; factor: number; toLabel: string; fromUnit: string; toUnit: string;
  faqs: { question: string; answer: string }[];
  explanation?: React.ReactNode;
  examples?: React.ReactNode;
}) {
  const tool = getToolBySlug("conversores", toolSlug)!;
  const [value, setValue] = useState("");
  const converted = value !== "" && !isNaN(parseFloat(value)) ? (parseFloat(value) * factor).toFixed(4) : "";

  return (
    <ToolLayout tool={tool} faqs={faqs} explanation={explanation} examples={examples}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`from-${toolSlug}`}>{fromLabel} ({fromUnit})</Label>
            <Input id={`from-${toolSlug}`} type="number" placeholder={`Ex: 10`} value={value} onChange={(e) => setValue(e.target.value)} step="0.01" />
          </div>
          {converted && (
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">{toLabel} ({toUnit})</p>
              <p className="mt-1 text-2xl font-bold text-primary">{converted} {toUnit}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function KmMilhas() {
  return (
    <SimpleConverter
      toolSlug="km-milhas"
      fromLabel="Quilômetros"
      factor={0.621371}
      toLabel="Milhas"
      fromUnit="km"
      toUnit="mi"
      faqs={[
        { question: "Quantas milhas tem 1 km?", answer: "1 km = 0,621371 milhas (miles). 1 milha = 1,60934 km. Para estimar rapidamente, multiplique km por 0,6 ou divida por 1,6." },
        { question: "Para que converto km para milhas?", answer: "Para entender velocímetros e limites de velocidade nos EUA e Reino Unido (em mph), calcular distâncias em aplicativos americanos, ou entender a autonomia de carros elétricos listados em milhas." },
        { question: "Quanto é uma maratona em km?", answer: "Uma maratona tem 42,195 km = 26,219 milhas. A meia-maratona tem 21,097 km = 13,109 milhas. Os treinos americanos de corrida frequentemente usam milhas." },
        { question: "Qual a diferença entre milha e légua?", answer: "1 milha terrestre = 1,60934 km. 1 légua brasileira ≈ 6,6 km (varia por região histórica). São unidades completamente diferentes; a milha é padrão americano, a légua é uma medida histórica." },
        { question: "Como converter km/h para mph?", answer: "Multiplique por 0,621371. Exemplo: 100 km/h = 62,14 mph. Limite de rodovias no Brasil (110 km/h) ≈ 68 mph. Limite nos EUA varia por estado, mas geralmente é 65-75 mph (105-121 km/h)." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            A conversão de quilômetros para milhas usa o fator exato <strong>1 km = 0,621371 mi</strong>.
            A milha terrestre (statute mile) é a unidade de distância padrão nos EUA, Reino Unido (para
            sinalização rodoviária) e alguns outros países do sistema imperial.
          </p>
          <p>
            Além de distâncias geográficas, o conversor é útil para velocidade (km/h ↔ mph) — basta
            aplicar o mesmo fator. Carros americanos têm velocímetro em mph, e muitos aplicativos de
            corrida e ciclismo permitem configurar entre as duas unidades.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Distâncias de referência</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• São Paulo → Rio de Janeiro: 429 km ≈ 267 mi</li>
              <li>• Maratona: 42,195 km = 26,22 mi</li>
              <li>• 100 km/h = 62,14 mph</li>
              <li>• 1 km = 0,6214 mi</li>
            </ul>
          </div>
        </div>
      }
    />
  );
}

export function MilhasKm() {
  return (
    <SimpleConverter
      toolSlug="milhas-km"
      fromLabel="Milhas"
      factor={1.60934}
      toLabel="Quilômetros"
      fromUnit="mi"
      toUnit="km"
      faqs={[
        { question: "Quantos km tem 1 milha?", answer: "1 milha terrestre = 1,60934 km. Para converter milhas para km, multiplique por 1,609 ou some 60% ao valor (estimativa rápida: 10 mi ≈ 16 km)." },
        { question: "Quanto é 60 mph em km/h?", answer: "60 mph = 60 × 1,60934 = 96,56 km/h. O limite padrão em rodovias americanas é de 65-75 mph ≈ 105-121 km/h." },
        { question: "O que é uma milha náutica?", answer: "A milha náutica (nm ou nmi) tem valor diferente: 1 nmi = 1,852 km. É usada em aviação e navegação marítima. A milha terrestre (mi) = 1,60934 km. Este conversor usa milha terrestre." },
        { question: "Aplicativos de corrida americanos usam milhas?", answer: "Sim. Aplicativos como Strava, Garmin e Nike Run Club usam milhas por padrão nos EUA. 5 km = 3,11 mi; 10 km = 6,21 mi; meia-maratona = 13,11 mi." },
        { question: "Qual é o pace em km para um pace de 6 min/mi?", answer: "1 milha = 1,60934 km. Pace de 6:00 min/mi = 6/1,60934 ≈ 3:43 min/km. Pace de 9:00 min/mi ≈ 5:35 min/km." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            A conversão de milhas para quilômetros usa o fator <strong>1 mi = 1,60934 km</strong>.
            Esse valor corresponde à definição exata da milha terrestre (statute mile) adotada
            internacionalmente desde 1959.
          </p>
          <p>
            É especialmente útil para atletas e corredores que treinam com planos americanos (onde
            distâncias são em milhas), para motoristas usando GPS americano ou alugando carro nos EUA,
            e para entender autonomia de veículos elétricos americanos que é declarada em milhas.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Corridas e distâncias esportivas</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• 1 mi = 1,609 km</li>
              <li>• 5 mi = 8,047 km</li>
              <li>• 10 mi = 16,093 km</li>
              <li>• 26,22 mi (maratona) = 42,195 km</li>
            </ul>
          </div>
        </div>
      }
    />
  );
}

export function MetrosPes() {
  return (
    <SimpleConverter
      toolSlug="metros-pes"
      fromLabel="Metros"
      factor={3.28084}
      toLabel="Pés"
      fromUnit="m"
      toUnit="ft"
      faqs={[
        { question: "Quantos pés tem 1 metro?", answer: "1 metro = 3,28084 pés (feet). 1 pé = 0,3048 metro. Para estimar, 1 metro ≈ 3,3 pés, ou multiplique por 3 para uma aproximação rápida." },
        { question: "Para que converto metros para pés?", answer: "Para entender alturas listadas em pés (ex: aeronaves, montanhas em sites americanos), profundidade de piscinas em pés, altitude de voos (em ft), ou dimensões de imóveis nos EUA e Reino Unido." },
        { question: "O que é 1,80 m em pés e polegadas?", answer: "1,80 m = 5,906 pés = 5 pés e 10,87 polegadas (5'11\"). Nos EUA, a altura de pessoas é expressa em pés e polegadas: ex. 6 ft = 182,88 cm ≈ 1,83 m." },
        { question: "Altitude de voos: 35.000 pés = quantos km?", answer: "35.000 pés = 35.000 × 0,3048 = 10.668 metros ≈ 10,7 km. A altitude de cruzeiro de aviões comerciais é geralmente entre 10.000-12.000 metros (33.000-39.000 pés)." },
        { question: "Qual a diferença entre pé e pé quadrado?", answer: "Pé (ft) é unidade de comprimento (1 ft = 0,3048 m). Pé quadrado (sq ft) é unidade de área (1 sq ft = 0,0929 m²). Imóveis americanos são medidos em sq ft. Para converter m² para sq ft, multiplique por 10,764." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            O pé (foot, plural feet) é a unidade de comprimento do sistema imperial, definido desde 1959
            como exatamente <strong>0,3048 metros</strong>. Para converter metros para pés, multiplica-se
            por 3,28084 (o inverso de 0,3048).
          </p>
          <p>
            Pés são usados amplamente em aviação (altitude de voo em flight levels), nos EUA para altura
            de pessoas e edificações, em mergulho (profundidade) e em escaladas (altitude de picos).
            A ferramenta é útil para atletas, pilotos, engenheiros e qualquer pessoa que trabalhe com
            documentos técnicos americanos.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Alturas e altitudes</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• 1,75 m = 5,74 ft (5'9")</li>
              <li>• Everest: 8.849 m = 29.032 ft</li>
              <li>• Voo comercial: 10.000 m = 32.808 ft</li>
              <li>• Piscina olímpica: 2 m de profundidade = 6,56 ft</li>
            </ul>
          </div>
        </div>
      }
    />
  );
}

export function PolegadasCm() {
  return (
    <SimpleConverter
      toolSlug="polegadas-cm"
      fromLabel="Polegadas"
      factor={2.54}
      toLabel="Centímetros"
      fromUnit="in"
      toUnit="cm"
      faqs={[
        { question: "Quantos cm tem 1 polegada?", answer: "1 polegada (inch) = 2,54 centímetros exatamente. Esta é uma definição internacional desde 1959. Para converter, multiplique o número de polegadas por 2,54." },
        { question: "Telas de TV e monitores são medidos em polegadas?", answer: "Sim. O tamanho de telas (TV, monitor, celular, tablet) é medido na diagonal em polegadas no mundo inteiro, por convenção do setor. Uma TV de 55\" tem 55 × 2,54 = 139,7 cm de diagonal." },
        { question: "Parafusos têm tamanho em polegadas?", answer: "Sim. Parafusos no padrão UNC/UNF americano são especificados em frações de polegada (ex: 1/4\", 3/8\"). O padrão métrico (M5, M8, M10) usa milímetros. Muitos equipamentos importados usam parafusos em polegadas." },
        { question: "Como converter polegadas para mm?", answer: "1 polegada = 25,4 mm. Multiplique por 25,4. Exemplo: 1/2\" = 12,7 mm; 3/4\" = 19,05 mm. É útil para especificações de peças mecânicas e canos hidráulicos." },
        { question: "Sapatos: como converter tamanho americano para brasileiro?", answer: "O tamanho de sapato americano em polegadas usa uma fórmula específica por gênero. Em geral: tamanho BR = tamanho EUA (masculino) + 33. Exemplo: US 9 ≈ BR 42. Use sempre uma tabela de conversão de calçados para precisão." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            A polegada (inch, símbolo: ″) é definida como exatamente <strong>2,54 centímetros</strong>
            desde o acordo internacional de 1959. Para converter polegadas em centímetros, basta multiplicar
            por 2,54. O resultado tem precisão total pois 2,54 é um valor exato, não uma aproximação.
          </p>
          <p>
            Além de tamanhos de telas, a polegada aparece em tubulações hidráulicas (canos de 1/2″, 3/4″),
            parafusos e ferramentas do sistema americano, tamanhos de papel fotográfico (4×6″, 5×7″),
            e dimensões de dispositivos eletrônicos.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Tamanhos de telas comuns</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Celular 6,1″ = 15,49 cm</li>
              <li>• Monitor 24″ = 60,96 cm</li>
              <li>• TV 55″ = 139,7 cm</li>
              <li>• TV 65″ = 165,1 cm</li>
              <li>• TV 85″ = 215,9 cm</li>
            </ul>
          </div>
        </div>
      }
    />
  );
}
