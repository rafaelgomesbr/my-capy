import { NextRequest, NextResponse } from "next/server";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "";

export async function POST(req: NextRequest) {
  let body: { name: string; email: string; category: string; message: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const { name, email, category, message } = body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  if (!CONTACT_EMAIL) {
    console.log("[Contact] CONTACT_EMAIL não configurado — simulando envio:", { name, email, category });
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        _subject: `[MyCapy] ${category} — ${name}`,
        message: `Assunto: ${category}\nRemetente: ${name} <${email}>\n\n${message}`,
        _template: "box",
        _captcha: "false",
      }),
    });

    if (!res.ok) {
      throw new Error(`FormSubmit status ${res.status}`);
    }

    console.log(`[Contact] OK — de: ${email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Contact] Erro:", err);
    return NextResponse.json(
      { error: "Não foi possível enviar a mensagem. Tente novamente." },
      { status: 500 }
    );
  }
}
