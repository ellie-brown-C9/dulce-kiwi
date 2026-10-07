// TODO: replace with Ellie's real number, Instagram and email
export const CONTACT = {
  whatsapp: "5491100000000",
  whatsappLabel: "+54 9 11 [NÚMERO]",
  instagram: "dulcekiwi",
  email: "hola@dulcekiwi.com.ar",
};

export const whatsappLink = (text: string) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const WA_HELLO = whatsappLink(
  "¡Hola Ellie! Vi tu página y quería encargarte algo.",
);
export const WA_SPECIAL = whatsappLink(
  "¡Hola Ellie! Quería consultarte por un pedido especial.",
);

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
    name: "Torta de panqueques",
    detail: "Capa por capa, con dulce de leche y merengue tostado.",
    note: "mis dos mundos",
    img: "/home/bake-crepe.webp",
    alt: "Torta alta de panqueques con dulce de leche y merengue tostado",
  },
];
