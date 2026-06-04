"use client";

import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const IS_DEV = process.env.NODE_ENV === "development";
// Substitua pelo slot ID real gerado no painel do AdSense
const SLOT_ID = "0987654321";

export function AdMiddle() {
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT || ADSENSE_CLIENT.includes("XXXX")) return;
    if (pushed.current) return;
    pushed.current = true;
    try {
      ((window as unknown as Record<string, unknown[]>).adsbygoogle =
        (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push({});
    } catch {}
  }, []);

  if (IS_DEV) {
    return (
      <div className="my-8 flex h-[280px] w-full items-center justify-center rounded-lg border border-dashed border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20">
        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
          📢 AdMiddle — Retângulo 336×280 <span className="opacity-60">(apenas em dev)</span>
        </span>
      </div>
    );
  }

  if (!ADSENSE_CLIENT || ADSENSE_CLIENT.includes("XXXX")) return null;

  return (
    <div className="my-8 w-full overflow-hidden" aria-label="Anúncio">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
