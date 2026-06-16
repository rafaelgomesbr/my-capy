"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";

function TextTransformer({
  toolSlug,
  category,
  transform,
  placeholder,
  buttonLabel,
  faqs,
  explanation,
  examples,
}: {
  toolSlug: string;
  category: string;
  transform: (text: string) => string;
  placeholder: string;
  buttonLabel: string;
  faqs: { question: string; answer: string }[];
  explanation?: React.ReactNode;
  examples?: React.ReactNode;
}) {
  const tool = getToolBySlug(category, toolSlug)!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleTransform = useCallback(() => {
    setOutput(transform(input));
  }, [input, transform]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolLayout tool={tool} faqs={faqs} explanation={explanation} examples={examples}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`input-${toolSlug}`}>Texto de entrada</Label>
            <textarea
              id={`input-${toolSlug}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>
          <Button onClick={handleTransform} className="w-full">{buttonLabel}</Button>
          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Resultado</Label>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2 h-8">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
              <div className="min-h-[140px] w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm whitespace-pre-wrap break-words">
                {output}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}

export function RemoverEspacos() {
  return (
    <TextTransformer
      toolSlug="remover-espacos"
      category="texto"
      transform={(t) => t.replace(/[ \t]+/g, " ").trim()}
      placeholder="Cole o texto com espaços extras aqui..."
      buttonLabel="Remover Espaços Extras"
      faqs={[
        { question: "Que tipo de espaços são removidos?", answer: "São removidos espaços duplos, triplos e todos os espaços extras consecutivos, além de tabs. Cada sequência de espaços/tabs é reduzida a um único espaço. Os espaços no início e no fim do texto também são removidos." },
        { question: "Quebras de linha são afetadas?", answer: "Não. A ferramenta preserva as quebras de linha (\n) do texto original. Apenas os espaços e tabs em excesso dentro de cada linha são removidos." },
        { question: "Quando espaços extras aparecem em textos?", answer: "Espaços extras surgem frequentemente ao copiar texto de PDFs, e-mails, sites ou ao converter entre formatos de arquivo. Editores de texto também podem inserir espaços duplicados acidentalmente durante edição." },
        { question: "Isso afeta o texto colado de PDFs?", answer: "Sim, é uma das principais utilidades desta ferramenta. PDFs frequentemente adicionam espaços extras entre palavras ao serem copiados. A limpeza resulta em um texto mais limpo e pronto para uso." },
        { question: "Posso usar para limpar dados antes de importar para um banco de dados?", answer: "Sim. Espaços extras em campos de texto de banco de dados podem causar problemas em comparações de string e buscas. Limpar os dados antes da importação evita inconsistências." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            A ferramenta substitui toda sequência de dois ou mais espaços/tabs consecutivos por um único espaço,
            e remove também os espaços no início e no final do texto. O processo é feito diretamente no
            navegador, sem enviar dados para nenhum servidor.
          </p>
          <p>
            É especialmente útil ao trabalhar com textos copiados de PDFs ou documentos escaneados, que
            frequentemente apresentam espaços duplicados. Também ajuda a limpar textos antes de inserir em
            bancos de dados ou enviar por API, garantindo que não haja caracteres invisíveis desnecessários.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Entrada</p>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{"João   Silva    mora   em   São   Paulo"}</p>
            <p className="mt-2 font-medium">Saída</p>
            <p className="mt-1 font-mono text-sm text-primary">{"João Silva mora em São Paulo"}</p>
          </div>
        </div>
      }
    />
  );
}

export function RemoverLinhasVazias() {
  return (
    <TextTransformer
      toolSlug="remover-linhas-vazias"
      category="texto"
      transform={(t) => t.split("\n").filter((l) => l.trim() !== "").join("\n")}
      placeholder="Cole o texto com linhas vazias aqui..."
      buttonLabel="Remover Linhas Vazias"
      faqs={[
        { question: "Linhas com espaços são consideradas vazias?", answer: "Sim, linhas que contêm apenas espaços em branco ou tabs também são removidas, pois são visualmente vazias e não contêm conteúdo relevante." },
        { question: "Quando uso essa ferramenta?", answer: "É útil para limpar listas copiadas de documentos ou sites que contêm linhas em branco entre os itens, para preparar textos para APIs que não aceitam linhas vazias, ou para reduzir o tamanho de arquivos de texto." },
        { question: "Quantas linhas vazias consecutivas são removidas?", answer: "Todas. Se houver 5 linhas vazias seguidas, todas serão removidas e o resultado terá apenas as linhas com conteúdo." },
        { question: "O resultado fica tudo sem espaçamento?", answer: "As linhas com conteúdo ficam juntas sem nenhuma linha vazia entre elas. Se quiser manter algum espaçamento visual, pode usar a ferramenta de remover espaços extras em vez desta." },
        { question: "Posso usar para limpar listas?", answer: "Sim. É ideal para limpar listas importadas de planilhas, e-mails ou documentos que frequentemente têm linhas em branco extras entre os itens." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            A ferramenta divide o texto em linhas, filtra aquelas que estão completamente em branco (ou contêm
            apenas espaços/tabs) e une as linhas restantes de volta em um único bloco de texto. O resultado
            é um texto mais compacto, sem lacunas desnecessárias.
          </p>
          <p>
            Essa limpeza é frequentemente necessária ao copiar listas de sites ou documentos Office, que
            tendem a inserir linhas em branco entre os itens de uma lista. Também é útil para preparar
            textos para sistemas que tratam linhas em branco como delimitadores ou causam erros de parsing.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Antes (com linhas vazias)</p>
            <p className="mt-1 font-mono text-sm text-muted-foreground whitespace-pre">{"Item 1\n\nItem 2\n\n\nItem 3"}</p>
            <p className="mt-2 font-medium">Depois (limpo)</p>
            <p className="mt-1 font-mono text-sm text-primary whitespace-pre">{"Item 1\nItem 2\nItem 3"}</p>
          </div>
        </div>
      }
    />
  );
}

export function Maiusculas() {
  return (
    <TextTransformer
      toolSlug="maiusculas"
      category="texto"
      transform={(t) => t.toUpperCase()}
      placeholder="Digite o texto para converter..."
      buttonLabel="Converter para MAIÚSCULAS"
      faqs={[
        { question: "Funciona com acentos e caracteres especiais?", answer: "Sim, a conversão usa o método nativo do JavaScript (toUpperCase()), que lida corretamente com letras acentuadas do português como ã, é, ç, ú, ó, etc." },
        { question: "Para que serve converter para maiúsculas?", answer: "Útil para criar títulos de destaque, siglas, textos para placas e faixas, ou para padronizar dados de entrada em sistemas que armazenam texto em caixa alta." },
        { question: "Posso usar para padronizar dados de um banco?", answer: "Sim. Se você precisa que todos os registros de um campo estejam em maiúsculas para facilitar buscas case-insensitive, esta ferramenta ajuda a converter lotes de texto rapidamente." },
        { question: "Números e símbolos são afetados?", answer: "Não. A conversão afeta apenas letras. Números, pontuação, espaços e outros caracteres especiais permanecem inalterados." },
        { question: "Existe limite de tamanho do texto?", answer: "Não há limite imposto pela ferramenta. O processamento é feito no navegador e a velocidade depende apenas do desempenho do dispositivo." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            A conversão para maiúsculas aplica o método <code className="rounded bg-muted px-1 font-mono text-xs">toUpperCase()</code> nativo
            do JavaScript em todo o texto. O resultado é instântaneo e preserva todos os caracteres não-alfabéticos
            (números, pontuação, espaços e quebras de linha) exatamente como estão.
          </p>
          <p>
            É especialmente útil para padronizar dados antes de inserir em sistemas legados que armazenam apenas
            texto em caixa alta, para criar textos de destaque visual em materiais gráficos, ou para converter
            nomes antes de comparações case-insensitive em aplicações.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Entrada</p>
            <p className="mt-1 font-mono text-sm text-muted-foreground">João da Silva — São Paulo, SP</p>
            <p className="mt-2 font-medium">Saída</p>
            <p className="mt-1 font-mono text-sm text-primary">JOÃO DA SILVA — SÃO PAULO, SP</p>
          </div>
        </div>
      }
    />
  );
}

export function Minusculas() {
  return (
    <TextTransformer
      toolSlug="minusculas"
      category="texto"
      transform={(t) => t.toLowerCase()}
      placeholder="Digite o texto para converter..."
      buttonLabel="Converter para minúsculas"
      faqs={[
        { question: "Funciona com acentos?", answer: "Sim, a conversão usa o método nativo toLowerCase() do JavaScript, que lida corretamente com letras acentuadas do português." },
        { question: "Para que serve converter para minúsculas?", answer: "É útil para normalizar dados, criar slugs de URL, padronizar e-mails e usernames, ou preparar texto para processamento em sistemas que fazem comparações case-sensitive." },
        { question: "Como usar para criar slugs de URL?", answer: "Converta o título para minúsculas, depois use uma ferramenta de remoção de acentos e substituição de espaços por hífens. O resultado é um slug válido para URLs amigáveis de SEO." },
        { question: "Posso usar para normalizar e-mails?", answer: "Sim. E-mails devem ser sempre armazenados em minúsculas para evitar duplicatas (ex: João@email.com e joao@email.com são o mesmo endereço). Esta ferramenta ajuda a normalizar a parte local do e-mail." },
        { question: "Números e símbolos são afetados?", answer: "Não. Apenas as letras são convertidas. Números, pontuação e outros caracteres especiais ficam inalterados." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            A conversão para minúsculas aplica o método <code className="rounded bg-muted px-1 font-mono text-xs">toLowerCase()</code> nativo
            do JavaScript em todo o texto. O processamento é instantâneo e preserva toda a pontuação,
            números e quebras de linha originais.
          </p>
          <p>
            É muito usada em desenvolvimento de software para normalizar entradas de usuário antes de
            comparações, buscas em banco de dados e geração de identificadores únicos. Também é o primeiro
            passo para criar slugs de URL amigáveis a partir de títulos.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Entrada</p>
            <p className="mt-1 font-mono text-sm text-muted-foreground">MARIA APARECIDA — RIO DE JANEIRO</p>
            <p className="mt-2 font-medium">Saída</p>
            <p className="mt-1 font-mono text-sm text-primary">maria aparecida — rio de janeiro</p>
          </div>
        </div>
      }
    />
  );
}

export function CapitalizarTexto() {
  return (
    <TextTransformer
      toolSlug="capitalizar-texto"
      category="texto"
      transform={(t) =>
        t.replace(/\b\w/g, (c) => c.toUpperCase())
      }
      placeholder="Digite o texto para capitalizar..."
      buttonLabel="Capitalizar Texto"
      faqs={[
        { question: "O que é Title Case?", answer: "Title Case (ou capitalização) é o estilo em que a primeira letra de cada palavra é maiúscula e as demais são minúsculas. É o padrão para títulos de livros, filmes, artigos e cabeçalhos." },
        { question: "Funciona com acentos?", answer: "Sim, a capitalização detecta corretamente os limites de palavras em textos com acentos e caracteres especiais do português." },
        { question: "Artigos e preposições devem ser capitalizados em títulos?", answer: "Em inglês, o Chicago Style e o APA Style recomendam não capitalizar artigos (a, the) e preposições curtas em títulos. Em português, a ABNT não tem regra rígida. Esta ferramenta capitaliza todas as palavras para simplicidade." },
        { question: "Para que uso isso no dia a dia?", answer: "Para padronizar nomes próprios, títulos de artigos ou produtos, cabeçalhos de relatórios, ou qualquer texto que deva estar em Title Case para apresentação formal." },
        { question: "Qual a diferença entre Title Case e Sentence case?", answer: "Title Case capitaliza a primeira letra de cada palavra. Sentence case (normal) capitaliza apenas a primeira letra da frase e nomes próprios. Este conversor usa Title Case." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            A capitalização usa uma expressão regular que encontra o primeiro caractere de cada palavra e
            o converte para maiúscula. O restante das letras é mantido como está no texto original. Isso
            significa que se você inserir "TÍTULO EM MAIÚSCULAS", cada palavra ficará com a primeira letra
            maiúscula e as demais permanecerão maiúsculas também.
          </p>
          <p>
            Para obter um Title Case perfeito a partir de texto em caixa alta, combine esta ferramenta com
            a conversão para minúsculas primeiro: converta para minúsculas, depois capitalize. O resultado
            será "Título Em Minúsculas Capitalizado".
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Entrada</p>
            <p className="mt-1 font-mono text-sm text-muted-foreground">como aprender programação em 2025</p>
            <p className="mt-2 font-medium">Saída</p>
            <p className="mt-1 font-mono text-sm text-primary">Como Aprender Programação Em 2025</p>
          </div>
        </div>
      }
    />
  );
}

export function InverterTexto() {
  return (
    <TextTransformer
      toolSlug="inverter-texto"
      category="texto"
      transform={(t) => t.split("").reverse().join("")}
      placeholder="Digite o texto para inverter..."
      buttonLabel="Inverter Texto"
      faqs={[
        { question: "O que significa inverter o texto?", answer: "Inverter o texto reverte a ordem de todos os caracteres: o último caractere vira o primeiro, o penúltimo vira o segundo, e assim por diante. 'olá' se torna 'álo'." },
        { question: "Para que serve inverter texto?", answer: "Além de ser uma ferramenta divertida, inverter texto é útil em desafios de programação, criação de palíndromos, efeitos visuais criativos e puzzles de linguagem." },
        { question: "Quebras de linha são mantidas?", answer: "As quebras de linha são tratadas como caracteres comuns e também são revertidas. Isso significa que a última linha do texto se torna a primeira no resultado." },
        { question: "Funciona com emojis?", answer: "Emojis podem apresentar comportamento inesperado ao serem invertidos, pois alguns emojis são representados por múltiplos codepoints Unicode. O resultado pode exibir caracteres incompletos." },
        { question: "Como verificar se uma palavra é palíndromo?", answer: "Cole a palavra nesta ferramenta. Se o resultado for idêntico à entrada, é um palíndromo. Exemplos: 'arara', 'reter', 'ovo'." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            A inversão divide o texto em um array de caracteres individuais e inverte a ordem do array usando
            o método <code className="rounded bg-muted px-1 font-mono text-xs">reverse()</code> do JavaScript,
            depois une tudo de volta em uma string. É uma operação simples e instantânea para qualquer tamanho de texto.
          </p>
          <p>
            Além de palíndromos e curiosidades linguísticas, inversão de texto é um exercício clássico em
            entrevistas técnicas de programação e um caso de uso comum em algoritmos de processamento de strings.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Verificando palíndromo</p>
            <p className="mt-1 text-sm text-muted-foreground">Entrada: <span className="font-mono">arara</span></p>
            <p className="mt-1 text-sm text-primary">Resultado: <span className="font-mono">arara</span> ✓ É um palíndromo!</p>
            <p className="mt-3 text-sm text-muted-foreground">Entrada: <span className="font-mono">MyCapy</span></p>
            <p className="mt-1 text-sm text-muted-foreground">Resultado: <span className="font-mono">ypaCyM</span></p>
          </div>
        </div>
      }
    />
  );
}

export function OrdenarLinhas() {
  return (
    <TextTransformer
      toolSlug="ordenar-linhas"
      category="texto"
      transform={(t) =>
        t
          .split("\n")
          .sort((a, b) => a.localeCompare(b, "pt-BR"))
          .join("\n")
      }
      placeholder="Uma linha por item para ordenar..."
      buttonLabel="Ordenar Linhas Alfabeticamente"
      faqs={[
        { question: "A ordenação considera acentos?", answer: "Sim. A ordenação usa o algoritmo de comparação de string pt-BR (localeCompare), que coloca corretamente 'ã' depois de 'a' e antes de 'b', respeitando o alfabeto português." },
        { question: "A ordenação é case-sensitive?", answer: "Por padrão, letras maiúsculas vêm antes das minúsculas na ordenação. Se precisar de ordenação case-insensitive, converta o texto para minúsculas primeiro, depois ordene." },
        { question: "Posso ordenar listas numeradas?", answer: "A ferramenta ordena alfabeticamente, não numericamente. '10' virá antes de '2' na ordenação alfabética. Para ordenação numérica, os números precisam ter o mesmo número de dígitos (01, 02, 10)." },
        { question: "Para que usar ordenação de linhas?", answer: "Muito útil para organizar listas de nomes, itens de menu, termos de glossário, países, ingredientes ou qualquer lista que seja mais fácil de usar em ordem alfabética." },
        { question: "A ordenação é crescente (A→Z) ou decrescente (Z→A)?", answer: "Esta ferramenta ordena em ordem crescente (A→Z). Para ordem decrescente, ordene e depois inverta o texto resultante." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            A ferramenta divide o texto em linhas e ordena usando o método{" "}
            <code className="rounded bg-muted px-1 font-mono text-xs">localeCompare</code> com o locale pt-BR,
            que garante ordenação correta para o português, incluindo letras acentuadas e o dígrafo {'"lh"'} e {'"nh"'}.
            A ordenação é estável — itens com o mesmo valor mantêm a ordem relativa original.
          </p>
          <p>
            É ideal para organizar listas copiadas de qualquer fonte: nomes de clientes, produtos de um catálogo,
            tags de conteúdo, países, cidades ou qualquer conjunto de itens que precise estar em ordem
            alfabética para apresentação ou indexação.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Entrada (desordenada)</p>
            <p className="mt-1 font-mono text-sm text-muted-foreground whitespace-pre">{"Zebra\nÁrvore\nCasa\nÁgua\nBola"}</p>
            <p className="mt-2 font-medium">Saída (ordenada)</p>
            <p className="mt-1 font-mono text-sm text-primary whitespace-pre">{"Água\nÁrvore\nBola\nCasa\nZebra"}</p>
          </div>
        </div>
      }
    />
  );
}

export function RemoverDuplicados() {
  return (
    <TextTransformer
      toolSlug="remover-duplicados"
      category="texto"
      transform={(t) => {
        const lines = t.split("\n");
        const seen = new Set<string>();
        return lines.filter((l) => {
          const trimmed = l.trim();
          if (seen.has(trimmed)) return false;
          seen.add(trimmed);
          return true;
        }).join("\n");
      }}
      placeholder="Cole uma lista com linhas duplicadas..."
      buttonLabel="Remover Linhas Duplicadas"
      faqs={[
        { question: "A comparação é case-sensitive?", answer: "Não. A remoção de duplicatas compara as linhas após remover espaços do início e fim (trim). 'Item', 'item' e '  ITEM  ' são tratados como iguais e apenas a primeira ocorrência é mantida." },
        { question: "Qual linha é mantida quando há duplicatas?", answer: "A primeira ocorrência de cada linha é mantida e todas as subsequentes são removidas, preservando a ordem original das linhas únicas." },
        { question: "Linhas vazias são consideradas duplicatas?", answer: "Sim. Se houver várias linhas em branco no texto, apenas a primeira será mantida. Use a ferramenta de remover linhas vazias para eliminar todas as linhas em branco." },
        { question: "Para que serve remover duplicados?", answer: "É útil para limpar listas de e-mails, SKUs de produtos, palavras-chave, IDs ou qualquer conjunto de dados onde cada item deve aparecer apenas uma vez." },
        { question: "Posso usar para encontrar quantas duplicatas existem?", answer: "Esta ferramenta remove as duplicatas mas não informa quantas foram removidas. Para contar, compare o número de linhas antes e depois usando o Contador de Palavras." },
      ]}
      explanation={
        <div className="space-y-3">
          <p>
            A ferramenta usa um <code className="rounded bg-muted px-1 font-mono text-xs">Set</code> para
            rastrear as linhas já vistas. Cada linha é normalizada (trim) antes de ser adicionada ao Set.
            Linhas duplicadas são descartadas e apenas a primeira ocorrência de cada linha única é mantida
            no resultado final.
          </p>
          <p>
            É uma operação indispensável ao trabalhar com dados coletados de múltiplas fontes, listas de
            e-mails de diferentes campanhas, palavras-chave exportadas de ferramentas SEO, ou qualquer
            situação onde itens duplicados precisam ser eliminados antes do processamento.
          </p>
        </div>
      }
      examples={
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <p className="font-medium">Entrada (com duplicatas)</p>
            <p className="mt-1 font-mono text-sm text-muted-foreground whitespace-pre">{"banana\nmaçã\nbanana\nuva\nmaçã\npêra"}</p>
            <p className="mt-2 font-medium">Saída (sem duplicatas)</p>
            <p className="mt-1 font-mono text-sm text-primary whitespace-pre">{"banana\nmaçã\nuva\npêra"}</p>
          </div>
        </div>
      }
    />
  );
}
