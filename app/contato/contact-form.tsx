"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", category: "sugestao", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "E-mail inválido";
    if (!form.message.trim() || form.message.length < 20)
      e.message = "Mensagem deve ter pelo menos 20 caracteres";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const ne = { ...e }; delete ne[field]; return ne; });
  };

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
        <h2 className="mb-2 text-2xl font-bold">Mensagem enviada!</h2>
        <p className="text-muted-foreground">Obrigado pelo contato. Responderemos em breve.</p>
        <Button className="mt-6" onClick={() => setSubmitted(false)}>
          Enviar outra mensagem
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name-c">Nome *</Label>
            <Input
              id="name-c"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Seu nome completo"
              aria-describedby={errors.name ? "name-err" : undefined}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p id="name-err" className="text-xs text-red-500" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-c">E-mail *</Label>
            <Input
              id="email-c"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="seu@email.com"
              aria-describedby={errors.email ? "email-err" : undefined}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p id="email-err" className="text-xs text-red-500" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-c">Assunto</Label>
            <select
              id="cat-c"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="bug">🐛 Reportar Bug</option>
              <option value="sugestao">💡 Sugestão de Ferramenta</option>
              <option value="parceria">🤝 Parceria</option>
              <option value="outro">💬 Outro</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="msg-c">Mensagem *</Label>
            <textarea
              id="msg-c"
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="Descreva detalhadamente sua mensagem (mínimo 20 caracteres)..."
              aria-describedby={errors.message ? "msg-err" : undefined}
              className={`min-h-[140px] w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y bg-background ${
                errors.message ? "border-red-500" : "border-input"
              }`}
            />
            <div className="flex items-center justify-between">
              {errors.message ? (
                <p id="msg-err" className="text-xs text-red-500" role="alert">
                  {errors.message}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted-foreground">{form.message.length} caracteres</span>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Enviar Mensagem
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
