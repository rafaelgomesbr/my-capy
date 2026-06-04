"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Loader2, ArrowLeftRight } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("conversores", "conversor-moedas")!;
const faqs = [
  { question: "As taxas são em tempo real?", answer: "As taxas são atualizadas a cada hora via API de câmbio. Para operações financeiras reais, consulte seu banco ou corretora autorizada pelo Banco Central." },
  { question: "Quais moedas estão disponíveis?", answer: "Cobrimos as principais moedas mundiais e latino-americanas: USD, EUR, GBP, ARS, CLP, MXN, CAD, AUD, JPY, CHF, CNY e mais." },
];

const CURRENCY_NAMES: Record<string, string> = {
  BRL: "Real Brasileiro",
  USD: "Dólar Americano",
  EUR: "Euro",
  GBP: "Libra Esterlina",
  ARS: "Peso Argentino",
  CLP: "Peso Chileno",
  MXN: "Peso Mexicano",
  CAD: "Dólar Canadense",
  AUD: "Dólar Australiano",
  JPY: "Iene Japonês",
  CHF: "Franco Suíço",
  CNY: "Yuan Chinês",
  PYG: "Guarani Paraguaio",
  UYU: "Peso Uruguaio",
  BOB: "Boliviano",
  PEN: "Sol Peruano",
  COP: "Peso Colombiano",
};

const FALLBACK: Record<string, number> = {
  USD: 5.05, EUR: 5.50, GBP: 6.40, ARS: 0.0057,
  CLP: 0.0055, MXN: 0.29, CAD: 3.70, AUD: 3.30,
  JPY: 0.034, CHF: 5.70, CNY: 0.70, PYG: 0.00069,
  UYU: 0.13, BOB: 0.73, PEN: 1.36, COP: 0.0013,
};

interface RatesData {
  rates: Record<string, number>;
  updated: string;
  source: "live" | "fallback";
}

export function ConversorMoedas() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("BRL");
  const [ratesData, setRatesData] = useState<RatesData | null>(null);
  const [loadingRates, setLoadingRates] = useState(true);

  const fetchRates = useCallback(async () => {
    setLoadingRates(true);
    try {
      const res = await fetch("/api/exchange-rates");
      const data = await res.json();
      setRatesData(data);
    } catch {
      setRatesData({ rates: FALLBACK, updated: new Date().toISOString(), source: "fallback" });
    } finally {
      setLoadingRates(false);
    }
  }, []);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const allRates: Record<string, number> = {
    BRL: 1,
    ...(ratesData?.rates ?? FALLBACK),
  };

  const currencies = Object.keys(CURRENCY_NAMES).filter((c) => c in allRates);

  const convert = () => {
    const A = parseFloat(amount);
    if (isNaN(A) || !allRates[from] || !allRates[to]) return null;
    const inBRL = A * allRates[from];
    return inBRL / allRates[to];
  };

  const swap = () => { setFrom(to); setTo(from); };

  const result = convert();
  const rate = allRates[from] && allRates[to] ? allRates[from] / allRates[to] : null;

  const fmt = (n: number, dec = 4) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: dec });

  const updatedTime = ratesData?.updated
    ? new Date(ratesData.updated).toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })
    : null;

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Status bar */}
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
            <div className="flex items-center gap-2">
              {loadingRates ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              ) : (
                <span className={`h-2 w-2 rounded-full ${ratesData?.source === "live" ? "bg-emerald-500" : "bg-amber-500"}`} />
              )}
              <span className="text-xs text-muted-foreground">
                {loadingRates
                  ? "Buscando cotações..."
                  : ratesData?.source === "live"
                  ? `Cotações ao vivo · ${updatedTime}`
                  : "Cotações de referência (offline)"}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={fetchRates} disabled={loadingRates} aria-label="Atualizar cotações">
              <RefreshCw className={`h-3.5 w-3.5 ${loadingRates ? "animate-spin" : ""}`} />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-2">
              <Label htmlFor="amt-mc">Valor</Label>
              <Input id="amt-mc" type="number" placeholder="Ex: 100" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" />
            </div>

            <div className="flex items-end pb-0.5">
              <Button variant="outline" size="icon" onClick={swap} className="h-10 w-10" aria-label="Inverter moedas">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Converter</Label>
              <div className="grid grid-cols-2 gap-2">
                <select value={from} onChange={(e) => setFrom(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={to} onChange={(e) => setTo(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {result !== null && amount && (
            <div className="rounded-xl bg-primary/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {amount} {CURRENCY_NAMES[from] || from} =
                  </p>
                  <p className="mt-1 text-3xl font-bold text-primary">
                    {fmt(result, 2)} <span className="text-xl">{to}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {CURRENCY_NAMES[to] || to}
                  </p>
                </div>
                {rate && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Taxa</p>
                    <p className="font-mono text-sm font-medium">1 {from} = {fmt(rate)} {to}</p>
                    <p className="font-mono text-xs text-muted-foreground">1 {to} = {fmt(1 / rate)} {from}</p>
                  </div>
                )}
              </div>
              {ratesData?.source === "fallback" && (
                <Badge variant="outline" className="mt-3 text-xs text-amber-600 border-amber-300">
                  ⚠ Taxa de referência — consulte seu banco para câmbio real
                </Badge>
              )}
            </div>
          )}

          {/* Quick reference */}
          {!loadingRates && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Cotações em relação ao Real (BRL)</p>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {["USD", "EUR", "GBP", "ARS", "JPY", "CNY"].map((c) => (
                  allRates[c] ? (
                    <button
                      key={c}
                      onClick={() => { setFrom(c); setTo("BRL"); }}
                      className="flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors hover:bg-accent"
                    >
                      <span className="font-medium">{c}</span>
                      <span className="text-muted-foreground">R$ {fmt(allRates[c], 2)}</span>
                    </button>
                  ) : null
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
