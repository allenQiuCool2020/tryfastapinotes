import type { Metadata } from "next";
import type React from "react";
import { Manrope, Merriweather } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Providers } from "@/app/providers";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Field Notes",
  description: "A warm, public notes app powered by FastAPI and Next.js.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${merriweather.variable}`}>
        <Providers>
          <div className="min-h-screen bg-paper text-ink">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
