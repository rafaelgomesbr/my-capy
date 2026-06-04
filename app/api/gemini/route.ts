import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-2.5-flash";

const RATE_LIMIT_MAP = new Map<string, { count: number; reset: number }>();
const LIMIT = process.env.NODE_ENV === "development" ? 200 : 10;
const WINDOW_MS = 60_000;

function getRateLimitKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(key);
  if (!entry || now > entry.reset) {
    RATE_LIMIT_MAP.set(key, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

function extractRetryDelay(message: string): number {
  const match = message.match(/retry[^0-9]*(\d+(?:\.\d+)?)\s*s/i);
  return match ? Math.ceil(parseFloat(match[1])) : 30;
}

const SYSTEM_INSTRUCTION =
  "Você é um assistente especializado em criação de conteúdo para o mercado brasileiro. " +
  "Responda SEMPRE em português do Brasil. Seja criativo, direto e profissional. " +
  "Formate a resposta como lista de itens separados por quebras de linha quando houver múltiplos resultados. " +
  "Nunca adicione introduções, explicações ou conclusões — apenas os resultados solicitados.";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "sua-chave-aqui") {
    return NextResponse.json(
      { error: "Gemini API key não configurada." },
      { status: 503 }
    );
  }

  const ip = getRateLimitKey(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Muitas requisições. Aguarde um momento e tente novamente." },
      { status: 429 }
    );
  }

  let body: { prompt: string; tool: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const { prompt, tool } = body;
  if (!prompt?.trim() || !tool?.trim()) {
    return NextResponse.json({ error: "prompt e tool são obrigatórios." }, { status: 400 });
  }
  if (prompt.length > 1000) {
    return NextResponse.json({ error: "Prompt muito longo (máximo 1000 caracteres)." }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log(`[Gemini] OK — tool: ${tool}`);
    return NextResponse.json({ result: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    // Google API rate limit — return 429 immediately, client retries
    if (message.includes("429") || message.toLowerCase().includes("quota")) {
      const retryIn = extractRetryDelay(message);
      console.warn(`[Gemini] Rate limit — tool: ${tool} — retry in ${retryIn}s`);
      return NextResponse.json(
        { error: `Limite atingido. Aguarde ${retryIn} segundos e tente novamente.`, retryAfter: retryIn },
        {
          status: 429,
          headers: { "Retry-After": String(retryIn) },
        }
      );
    }

    console.error(`[Gemini] ERROR — tool: ${tool} — ${message}`);
    return NextResponse.json(
      {
        error: "Erro ao processar com IA. Tente novamente.",
        ...(process.env.NODE_ENV === "development" && { debug: message }),
      },
      { status: 500 }
    );
  }
}
