import type { Metadata } from "next";
import Header from "@/components/Header";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import MenuClient from "@/components/menu/MenuClient";
import { parseMatchQuery } from "@/components/menu/logic";

export const metadata: Metadata = {
  title: "Menú — Dulce Kiwi",
  description:
    "Budines, scones, rogel de 14 capas, lemon pie y más, con precios. Contame para qué es y cuántos son, y te digo qué llevar.",
};

type Search = { [key: string]: string | string[] | undefined };

// A query value can repeat (?personas=6&personas=8): use the first one
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function MenuPage({ searchParams }: { searchParams: Promise<Search> }) {
  const q = await searchParams;
  const initial = parseMatchQuery({ ocasion: first(q.ocasion), personas: first(q.personas) });

  return (
    <>
      <Header />
      <MenuClient initial={initial} />
      <FloatingWhatsApp />
    </>
  );
}
