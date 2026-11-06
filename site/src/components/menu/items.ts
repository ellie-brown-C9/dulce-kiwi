export type Size = { label: string; serves: number; price: number };
export type Kind = "budin" | "scone" | "roll" | "cookie" | "rogel" | "minirogel" | "tarta";
export type MenuItem = {
  id: string;
  group: "merienda" | "tortas";
  kind: Kind;
  name: string;
  desc: string;
  photo: string | null; // "/menu/<id>.webp" or null (text-only card)
  photoAlt: string;
  unit?: "docena";
  sizes: Size[]; // first = default shown on the card
  choice?: { label: string; options: string[] };
};
export type OccasionId = "merienda" | "postre" | "juntada" | "cumple";

const budinSizes = (normal: number, mini: number): Size[] => [
  { label: "Normal", serves: 8, price: normal },
  { label: "Mini", serves: 5, price: mini },
];

export const ITEMS: MenuItem[] = [
  {
    id: "banana", group: "merienda", kind: "budin", name: "Budín de banana",
    desc: "Con frosting de queso crema, de chocolate o de vainilla.",
    photo: "/menu/banana.webp", photoAlt: "Budín de banana con frosting de queso crema sobre una tabla de madera",
    sizes: budinSizes(17000, 10000),
    choice: { label: "Frosting", options: ["Chocolate", "Vainilla"] },
  },
  {
    id: "limon", group: "merienda", kind: "budin", name: "Budín de limón",
    desc: "Con glaseado de limón.",
    photo: "/menu/limon.webp", photoAlt: "Budín de limón glaseado sobre una tabla de madera",
    sizes: budinSizes(17000, 10000),
  },
  {
    id: "brownie", group: "merienda", kind: "budin", name: "Budín brownie de chocolate amargo y nueces",
    desc: "Textura de brownie, con frosting de chocolate.",
    photo: "/menu/brownie.webp", photoAlt: "Budín brownie de chocolate amargo con nueces y frosting de chocolate",
    sizes: budinSizes(20000, 11000),
  },
  {
    id: "zanahoria", group: "merienda", kind: "budin", name: "Budín de zanahoria",
    desc: "Con frosting de queso crema y nueces arriba.",
    photo: "/menu/zanahoria.webp", photoAlt: "Budín de zanahoria con frosting de queso crema y nueces",
    sizes: budinSizes(17000, 10000),
  },
  {
    id: "scones-queso", group: "merienda", kind: "scone", name: "Scones de queso",
    desc: "Bien queso, para comer calentitos con manteca.",
    photo: "/menu/scones-queso.webp", photoAlt: "Scones de queso recién horneados",
    unit: "docena", sizes: [{ label: "Docena", serves: 8, price: 15000 }],
  },
  {
    id: "scones-simples", group: "merienda", kind: "scone", name: "Scones simples",
    desc: "Como en Nueva Zelanda: para comer calentitos, con mermelada y crema.",
    photo: null, photoAlt: "Scones simples para comer con mermelada y crema",
    unit: "docena", sizes: [{ label: "Docena", serves: 8, price: 12000 }],
  },
  {
    id: "scones-datiles", group: "merienda", kind: "scone", name: "Scones de dátiles",
    desc: "Con dátiles, para comer calentitos con manteca.",
    photo: "/menu/scones-datiles.webp", photoAlt: "Scones de dátiles recién horneados",
    unit: "docena", sizes: [{ label: "Docena", serves: 8, price: 15000 }],
  },
  {
    id: "cinnamon-rolls", group: "merienda", kind: "roll", name: "Cinnamon rolls",
    desc: "Masa tierna, canela y glaseado.",
    photo: null, photoAlt: "Cinnamon rolls con glaseado",
    unit: "docena", sizes: [{ label: "Docena", serves: 12, price: 24000 }],
  },
  {
    id: "afghans", group: "merienda", kind: "cookie", name: "Afghans",
    desc: "Un clásico de Nueva Zelanda: galletitas de chocolate con copos de maíz, glaseado de chocolate y una nuez arriba. Nadie sabe bien de dónde viene el nombre, pero allá no falta en ninguna lata de galletitas.",
    photo: "/menu/afghans.webp", photoAlt: "Galletitas afghans con glaseado de chocolate y una nuez arriba",
    unit: "docena", sizes: [{ label: "Docena", serves: 8, price: 15000 }],
  },
  {
    id: "lamingtons", group: "merienda", kind: "cookie", name: "Lamingtons con dulce de leche",
    desc: "Casi una tortita: bizcochuelo relleno de dulce de leche, bañado y cubierto de coco. Un clásico de Nueva Zelanda y Australia, con un toque argentino.",
    photo: "/menu/lamingtons.webp", photoAlt: "Lamingtons cubiertos de coco, rellenos de dulce de leche",
    unit: "docena", sizes: [{ label: "Docena", serves: 12, price: 25000 }],
  },
  {
    id: "rogel", group: "tortas", kind: "rogel", name: "Rogel de 14 capas",
    desc: "Catorce capas finitas con dulce de leche y merengue.",
    photo: "/menu/rogel.webp", photoAlt: "Rogel de 14 capas con dulce de leche y merengue",
    sizes: [{ label: "Entero", serves: 15, price: 60000 }],
  },
  {
    id: "mini-rogel", group: "tortas", kind: "minirogel", name: "Mini rogel",
    desc: "Todo el rogel, en chiquito.",
    photo: "/menu/mini-rogel.webp", photoAlt: "Mini rogeles individuales con merengue",
    sizes: [
      { label: "2 unidades", serves: 2, price: 10000 },
      { label: "Caja de 12", serves: 12, price: 40000 },
    ],
  },
  {
    id: "lemon-pie", group: "tortas", kind: "tarta", name: "Lemon pie",
    desc: "Base crocante, crema de limón y merengue.",
    photo: "/menu/lemon-pie.webp", photoAlt: "Lemon pie con merengue dorado",
    sizes: [{ label: "Entera", serves: 10, price: 55000 }],
  },
  {
    id: "frutillas", group: "tortas", kind: "tarta", name: "Tarta de frutillas",
    desc: "Con frutillas frescas.",
    photo: "/menu/frutillas.webp", photoAlt: "Tarta de frutillas frescas",
    sizes: [{ label: "Entera", serves: 10, price: 50000 }],
  },
];

// Priority lists per occasion: easy to tune.
export const OCCASIONS: Record<OccasionId, { label: string; article: "una" | "un"; order: string[] }> = {
  merienda: {
    label: "merienda", article: "una",
    order: ["banana", "scones-queso", "limon", "cinnamon-rolls", "afghans", "zanahoria", "lamingtons", "brownie"],
  },
  postre: {
    label: "postre para un almuerzo", article: "un",
    order: ["lemon-pie", "frutillas", "rogel", "brownie", "mini-rogel"],
  },
  juntada: {
    label: "juntada", article: "una",
    order: ["lamingtons", "brownie", "mini-rogel", "cinnamon-rolls", "scones-queso", "afghans"],
  },
  cumple: {
    label: "cumple", article: "un",
    order: ["rogel", "lemon-pie", "mini-rogel", "frutillas", "lamingtons"],
  },
};

/** The four "how many" ranges shared by the homepage teaser and the /menu picker; value is the headcount used for planning. */
export const PEOPLE_RANGES: { label: string; value: number }[] = [
  { label: "2 a 4 personas", value: 4 },
  { label: "5 a 8 personas", value: 8 },
  { label: "9 a 15 personas", value: 15 },
  { label: "16 o más personas", value: 20 },
];
export const DEFAULT_PEOPLE = 8;

export const GROUPS: { id: "merienda" | "tortas"; title: string; eyebrow: string }[] = [
  { id: "merienda", title: "Para la merienda", eyebrow: "Lo más pedido" },
  { id: "tortas", title: "Tortas y tartas", eyebrow: "Para la mesa grande" },
];
