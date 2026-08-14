import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og.png`;

  return {
    title: "Nexo — Suas finanças em equilíbrio",
    description: "Dashboard financeiro pessoal para acompanhar saldo, receitas, despesas e metas.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title: "Nexo — Suas finanças em equilíbrio", description: "Clareza para cuidar melhor do seu dinheiro.", images: [socialImage], locale: "pt_BR", type: "website" },
    twitter: { card: "summary_large_image", title: "Nexo — Suas finanças em equilíbrio", description: "Clareza para cuidar melhor do seu dinheiro.", images: [socialImage] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
