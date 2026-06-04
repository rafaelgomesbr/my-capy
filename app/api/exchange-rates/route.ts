import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hora

const FALLBACK_RATES: Record<string, number> = {
  USD: 5.05, EUR: 5.50, GBP: 6.40, ARS: 0.0057,
  CLP: 0.0055, MXN: 0.29, CAD: 3.70, AUD: 3.30,
  JPY: 0.034, CHF: 5.70, CNY: 0.70, PYG: 0.00069,
  UYU: 0.13, BOB: 0.73, PEN: 1.36, COP: 0.0013,
};

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/BRL", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("API unavailable");

    const data = await res.json();

    if (data.result !== "success" || !data.rates) throw new Error("Invalid response");

    const rates: Record<string, number> = {};
    const baseCurrencies = ["USD", "EUR", "GBP", "ARS", "CLP", "MXN", "CAD", "AUD", "JPY", "CHF", "CNY", "PYG", "UYU", "BOB", "PEN", "COP"];

    for (const currency of baseCurrencies) {
      if (data.rates[currency]) {
        rates[currency] = 1 / data.rates[currency];
      }
    }

    return NextResponse.json({
      base: "BRL",
      rates,
      updated: data.time_last_update_utc,
      source: "live",
    });
  } catch {
    return NextResponse.json({
      base: "BRL",
      rates: FALLBACK_RATES,
      updated: new Date().toISOString(),
      source: "fallback",
    });
  }
}
