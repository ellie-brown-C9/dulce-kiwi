import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

// Soft, slightly wonky display serif for headings (SOFT/WONK set in globals.css)
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

// Clean, friendly sans for body copy
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dulcekiwi.com"),
  title: "Dulce Kiwi — Repostería casera",
  description:
    "Repostería casera, como la de antes. Budines, tartas y scones con ingredientes de verdad, hechos a mano en Acassuso, Buenos Aires.",
  openGraph: {
    title: "Dulce Kiwi — Repostería casera",
    description: "Repostería casera, como la de antes. Acassuso, Buenos Aires.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="bg-cream font-sans text-forest antialiased">
        {children}
      </body>
    </html>
  );
}
