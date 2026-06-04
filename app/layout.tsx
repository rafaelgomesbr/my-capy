import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mycapy.app"),
  title: {
    default: "MyCapy — Ferramentas Gratuitas Online",
    template: "%s | MyCapy",
  },
  description:
    "Mais de 90 ferramentas gratuitas online: calculadoras financeiras, conversores, ferramentas de texto, estudos e muito mais. Sem cadastro, sem complicação.",
  keywords: [
    "ferramentas online gratuitas",
    "calculadora financeira",
    "conversor de unidades",
    "ferramentas de texto",
    "calculadora online",
  ],
  authors: [{ name: "MyCapy" }],
  creator: "MyCapy",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MyCapy",
    title: "MyCapy — Ferramentas Gratuitas Online",
    description:
      "Mais de 90 ferramentas gratuitas online: calculadoras financeiras, conversores, ferramentas de texto, estudos e muito mais.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyCapy — Ferramentas Gratuitas Online",
    description: "Mais de 90 ferramentas gratuitas online. Sem cadastro.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${plusJakartaSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2569605614210933"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <Header />
          <div id="main-content" className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
