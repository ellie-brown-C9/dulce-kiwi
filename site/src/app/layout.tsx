import type { Metadata } from "next";
import { DM_Sans, Kalam, Lora } from "next/font/google";
import "./globals.css";

// Editorial serif for headings
const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

// Clean, friendly sans for body copy
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Handwriting, used sparingly for notes
const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kalam",
  display: "swap",
});

export const metadata: Metadata = {
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
    <html
      lang="es"
      className={`${lora.variable} ${dmSans.variable} ${kalam.variable}`}
    >
      <body className="bg-paper font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
