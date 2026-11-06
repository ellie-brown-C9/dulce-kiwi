import { HELLO_MESSAGE } from "./menu/logic.ts";

export const CONTACT = {
  whatsapp: "5491122411701",
  whatsappLabel: "+54 9 11 2241-1701",
  instagram: "dulce__kiwi",
  email: "hola@dulcekiwi.com",
};

export const whatsappLink = (text: string) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const WA_HELLO = whatsappLink(HELLO_MESSAGE);
export const WA_SPECIAL = whatsappLink(
  "¡Hola Ellie! Quería consultarte por un pedido especial.",
);

/** One thing in the box. `detail` explains an unfamiliar name (shown smaller on phones). */
export type PromoItem = { name: string; detail?: string };

export type Promo = {
  id: string;
  name: string;
  nameHighlight?: string; // part of `name` set in italic highlight colour
  stripLine: string; // short line for the top strip, e.g. "solo 20 cajas"
  startDate: string; // YYYY-MM-DD, inclusive
  endDate: string; // YYYY-MM-DD, inclusive
  tagline: string;
  items: PromoItem[];
  price: number;
  scarcityLine: string;
  photoSrc: string;
  photoAlt: string;
  whatsappMessage: string;
};

export const PROMOS: Promo[] = [
  {
    id: "dia-de-la-madre-2026",
    name: "Caja Día de la Madre",
    nameHighlight: "de la Madre",
    stripLine: "solo 20 cajas",
    startDate: "2026-10-07",
    endDate: "2026-10-15",
    tagline: "un poquito de acá, un poquito de allá — para regalar",
    items: [
      { name: "Mini budín de zanahoria" },
      { name: "2 scones de queso" },
      { name: "2 rodajas de budín de limón" },
      { name: "2 Afghans", detail: "galletitas neozelandesas con ganache de chocolate" },
      {
        name: "2 lamingtons",
        detail: "bizcocho neozelandés bañado en chocolate y coco rallado, con dulce de leche",
      },
      { name: "2 mini rogels" },
    ],
    price: 40000,
    scarcityLine: "Hago todo a mano, así que son solo 20 cajas.",
    // TODO: placeholder (AI-generated) — swap for a real photo of the box
    photoSrc: "/home/promo-dia-de-la-madre-v3.jpg",
    photoAlt: "Caja Día de la Madre con budín de zanahoria, scones, budín de limón, Afghans, lamingtons y mini rogels",
    whatsappMessage: "¡Hola Ellie! Quiero encargar la Caja Día de la Madre.",
  },
];

const buenosAiresToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());

export const getActivePromo = (today: string = buenosAiresToday()): Promo | undefined =>
  PROMOS.find((p) => today >= p.startDate && today <= p.endDate);

/** "2026-10-15" → "15 de octubre" */
export const formatPromoEnd = (endDate: string) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${endDate}T12:00:00Z`));
