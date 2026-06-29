"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("cookie-consent")) setVisible(true);
    } catch {
      // localStorage indisponível (SSR/private mode)
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem("cookie-consent", "1");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg"
    >
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm text-muted-foreground text-center sm:text-left leading-relaxed">
          Usamos cookies para analytics anônimos e exibição de anúncios (Google AdSense). Ao continuar
          navegando, você concorda com nossa{" "}
          <Link href="/privacidade" className="text-primary underline-offset-4 hover:underline font-medium">
            Política de Privacidade
          </Link>{" "}
          e com os{" "}
          <Link href="/termos" className="text-primary underline-offset-4 hover:underline font-medium">
            Termos de Uso
          </Link>
          .
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" onClick={accept}>
            Aceitar
          </Button>
          <Button size="sm" variant="ghost" onClick={accept} aria-label="Fechar aviso de cookies">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
