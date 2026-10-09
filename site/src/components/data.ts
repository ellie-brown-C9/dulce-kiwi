export const CONTACT = {
  whatsapp: "5491122411701",
  whatsappLabel: "+54 9 11 2241-1701",
  instagram: "dulce__kiwi",
  email: "hola@dulcekiwi.com",
};

export const whatsappLink = (text: string) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const WA_HELLO = whatsappLink(
  "¡Hola Ellie! Vi tu página y quería encargarte algo.",
);
export const WA_SPECIAL = whatsappLink(
  "¡Hola Ellie! Quería consultarte por un pedido especial.",
);

export type Promo = {
  id: string;
  name: string;
  nameHighlight?: string; // part of `name` set in italic highlight colour
  stripLine: string; // short line for the top strip, e.g. "solo 20 cajas"
  startDate: string; // YYYY-MM-DD, inclusive
  endDate: string; // YYYY-MM-DD, inclusive
  tagline: string;
  items: string[];
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
      "Mini budín de zanahoria",
      "2 scones de queso",
      "2 rodajas de budín de limón",
      "2 Afghans (galletitas neozelandesas con ganache de chocolate)",
      "2 lamingtons (bizcocho neozelandés bañado en chocolate y coco rallado, con dulce de leche)",
      "2 mini rogels",
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

export type Bake = {
  name: string;
  detail: string;
  note: string;
  img: string;
  alt: string;
};

export const BAKES: Bake[] = [
  {
    name: "Budín de zanahoria y nueces",
    detail: "Húmedo, especiado, con nueces tostadas arriba.",
    note: "un clásico de casa",
    img: "/home/bake-carrot.webp",
    alt: "Dos budines de zanahoria con glaseado y nueces picadas sobre una tabla de madera",
  },
  {
    name: "Tarteletas de ruibarbo y frutilla",
    detail: "Masa casera, ruibarbo asado y frutillas de estación.",
    note: "un poquito de Nueva Zelanda",
    img: "/home/bake-rhubarb.webp",
    alt: "Bandeja de tarteletas de ruibarbo con frutillas frescas",
  },
  {
    name: "Scones de dátiles",
    detail: "Para abrir tibios, con manteca, y compartir con el mate.",
    note: "la hora del mate",
    img: "/home/bake-scones.webp",
    alt: "Scones de dátiles recién horneados sobre papel manteca",
  },
  {
    name: "Tarta de lima",
    detail: "Fresca y ácida lo justo, sobre una base crocante.",
    note: "algo fresco",
    img: "/home/bake-lime.webp",
    alt: "Tarta de lima con rodajas de lima sobre una mesa rústica",
  },
  {
    name: "Rogel",
    detail: "Capa por capa, con dulce de leche y merengue tostado.",
    note: "el plato estrella",
    img: "/home/bake-crepe.webp",
    alt: "Rogel casero, capa por capa, con dulce de leche y merengue tostado",
  },
];
