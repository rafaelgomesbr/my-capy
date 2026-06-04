"use client";

import { useState, useCallback, useRef } from "react";

interface UseGeminiOptions {
  tool: string;
}

interface UseGeminiReturn {
  generate: (prompt: string) => Promise<string | null>;
  loading: boolean;
  error: string | null;
  retryCountdown: number | null;
  clearError: () => void;
}

export function useGemini({ tool }: UseGeminiOptions): UseGeminiReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback((seconds: number, prompt: string, retryFn: (p: string) => void) => {
    setRetryCountdown(seconds);
    let remaining = seconds;
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(countdownRef.current!);
        setRetryCountdown(null);
        retryFn(prompt);
      } else {
        setRetryCountdown(remaining);
      }
    }, 1000);
  }, []);

  const generate = useCallback(
    async (prompt: string): Promise<string | null> => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      setLoading(true);
      setError(null);
      setRetryCountdown(null);

      try {
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, tool }),
        });

        const data = await res.json();

        if (res.status === 429 && data.retryAfter) {
          setLoading(false);
          setError(data.error ?? "Limite atingido.");
          startCountdown(data.retryAfter, prompt, (p) => generate(p));
          return null;
        }

        if (!res.ok) {
          setError(data.error ?? "Erro ao gerar conteúdo.");
          return null;
        }

        return data.result as string;
      } catch {
        setError("Erro de conexão. Verifique sua internet e tente novamente.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [tool, startCountdown]
  );

  const clearError = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setError(null);
    setRetryCountdown(null);
  }, []);

  return { generate, loading, error, retryCountdown, clearError };
}
