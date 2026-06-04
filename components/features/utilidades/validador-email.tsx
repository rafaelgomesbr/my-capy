"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("utilidades", "validador-email")!;
const faqs = [{ question: "O que torna um e-mail válido?", answer: "Um e-mail válido tem: local part (antes do @), símbolo @, domínio com pelo menos um ponto, e extensão com 2-6 caracteres. Ex: usuario@dominio.com.br" }];

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const DISPOSABLE = ["mailinator.com", "guerrillamail.com", "trashmail.com", "throwam.com", "temp-mail.org"];
const POPULAR = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com"];

function analyzeEmail(email: string) {
  const valid = EMAIL_REGEX.test(email);
  const parts = email.split("@");
  const domain = parts[1]?.toLowerCase() || "";
  const isDisposable = DISPOSABLE.some((d) => domain.includes(d));
  const isPopular = POPULAR.includes(domain);
  const hasPlus = parts[0]?.includes("+");
  const hasDots = parts[0]?.includes(".");
  return { valid, domain, isDisposable, isPopular, hasPlus, hasDots };
}

export function ValidadorEmail() {
  const [email, setEmail] = useState("");
  const analysis = email.trim() ? analyzeEmail(email.trim()) : null;

  return (
    <ToolLayout tool={tool} faqs={faqs}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-val">E-mail para validar</Label>
            <div className="relative">
              <Input
                id="email-val"
                type="email"
                placeholder="usuario@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={analysis ? (analysis.valid ? "border-emerald-500" : "border-red-500") : ""}
              />
              {analysis && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {analysis.valid
                    ? <CheckCircle className="h-5 w-5 text-emerald-500" />
                    : <XCircle className="h-5 w-5 text-red-500" />}
                </div>
              )}
            </div>
          </div>
          {analysis && (
            <div className="space-y-3">
              <div className={`flex items-center gap-3 rounded-lg p-4 ${analysis.valid ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-red-50 dark:bg-red-950/40"}`}>
                {analysis.valid
                  ? <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  : <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                <p className={`font-medium ${analysis.valid ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                  {analysis.valid ? "E-mail com formato válido" : "Formato de e-mail inválido"}
                </p>
              </div>
              {analysis.valid && (
                <div className="space-y-2">
                  {analysis.isDisposable && (
                    <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/40">
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm text-amber-700 dark:text-amber-300">E-mail descartável detectado</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-muted/50 p-2.5">
                      <p className="text-xs text-muted-foreground">Domínio</p>
                      <p className="font-medium">{analysis.domain}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2.5">
                      <p className="text-xs text-muted-foreground">Popular</p>
                      <p className="font-medium">{analysis.isPopular ? "Sim" : "Não"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
