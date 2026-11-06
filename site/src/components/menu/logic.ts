import { ITEMS, OCCASIONS, PEOPLE, type MenuItem, type OccasionId, type Size } from "./items.ts";

export const HELLO_MESSAGE = "¡Hola Ellie! Me gustaría hacerte un pedido.";

export function formatPrice(n: number): string {
  return "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function planFor(item: MenuItem, people: number): { size: Size; qty: number; total: number } {
  const sorted = [...item.sizes].sort((a, b) => a.serves - b.serves);
  const fit = sorted.find((s) => s.serves >= people);
  const size = fit ?? sorted[sorted.length - 1];
  const qty = fit ? 1 : Math.ceil(people / size.serves);
  return { size, qty, total: size.price * qty };
}

export function suggest(occasion: OccasionId, people: number): MenuItem[] {
  void people;
  const out: MenuItem[] = [];
  const kinds = new Set<string>();
  for (const id of OCCASIONS[occasion].order) {
    const item = ITEMS.find((i) => i.id === id);
    if (!item || kinds.has(item.kind)) continue;
    kinds.add(item.kind);
    out.push(item);
    if (out.length === 3) break;
  }
  return out;
}

const plural = (qty: number, one: string, many: string) => `${qty} ${qty === 1 ? one : many}`;

export function quantityLabel(item: MenuItem, size: Size, qty: number): string {
  if (item.kind === "budin") {
    const mini = size.label === "Mini";
    return plural(qty, `budín ${size.label.toLowerCase()}`, `budines ${mini ? "mini" : size.label.toLowerCase() === "normal" ? "normales" : size.label.toLowerCase()}`);
  }
  if (size.label === "Docena") return plural(qty, "docena", "docenas");
  if (size.label === "2 unidades") return `${qty * 2} unidades`;
  if (size.label === "Caja de 12") return plural(qty, "caja de 12", "cajas de 12");
  if (size.label === "Entero") return plural(qty, "entero", "enteros");
  if (size.label === "Entera") return plural(qty, "entera", "enteras");
  return `${qty} ${size.label.toLowerCase()}`;
}

export type OrderLine = { key: string; itemId: string; sizeLabel: string; choice?: string; qty: number };

export function lineKey(itemId: string, sizeLabel: string, choice?: string): string {
  return [itemId, sizeLabel, choice ?? ""].join("|");
}

export function addOrToggle(lines: OrderLine[], line: Omit<OrderLine, "key">): OrderLine[] {
  const key = lineKey(line.itemId, line.sizeLabel, line.choice);
  if (lines.some((l) => l.key === key)) return lines.filter((l) => l.key !== key);
  return [...lines, { ...line, key }];
}

export function changeQty(lines: OrderLine[], key: string, delta: number): OrderLine[] {
  return lines
    .map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l))
    .filter((l) => l.qty > 0);
}

function findItem(id: string): MenuItem {
  const item = ITEMS.find((i) => i.id === id);
  if (!item) throw new Error(`Unknown menu item: ${id}`);
  return item;
}

export function orderTotal(lines: OrderLine[]): number {
  return lines.reduce((sum, l) => {
    const size = findItem(l.itemId).sizes.find((s) => s.label === l.sizeLabel);
    return sum + (size ? size.price * l.qty : 0);
  }, 0);
}

export function lineText(line: OrderLine): string {
  const item = findItem(line.itemId);
  const q = line.qty;
  const s = line.sizeLabel;
  switch (item.kind) {
    case "budin": {
      const base = item.name.replace(/^Budín /, "");
      const extra = line.choice ? `, frosting de ${line.choice.toLowerCase()}` : "";
      return `${q} ${q === 1 ? "budín" : "budines"} ${base} (${s.toLowerCase()}${extra})`;
    }
    case "minirogel":
      if (s === "Caja de 12") return `${q} ${q === 1 ? "caja" : "cajas"} de 12 mini rogels`;
      return `${q * 2} mini rogels`;
    case "rogel":
      return `${q} ${q === 1 ? "rogel" : "rogels"} de 14 capas`;
    case "tarta":
      if (item.id === "lemon-pie") return `${q} ${q === 1 ? "lemon pie" : "lemon pies"}`;
      return `${q} ${q === 1 ? "tarta" : "tartas"} de frutillas`;
    default:
      return `${q} ${q === 1 ? "docena" : "docenas"} de ${item.name.toLowerCase()}`;
  }
}

export function orderMessage(lines: OrderLine[], context: { occasion: OccasionId; people: number } | null): string {
  if (lines.length === 0) return HELLO_MESSAGE;
  const parts = ["¡Hola Ellie! Vi el menú y quiero pedirte:", ...lines.map((l) => `• ${lineText(l)}`)];
  if (context) {
    const o = OCCASIONS[context.occasion];
    parts.push(`Es para ${o.article} ${o.label} de unas ${context.people} personas. ¿Lo coordinamos?`);
  } else {
    parts.push("¿Lo coordinamos?");
  }
  return parts.join("\n");
}

export function parseMatchQuery(q: { ocasion?: string; personas?: string }): { occasion: OccasionId; people: number; chosen: boolean } {
  const occ = q.ocasion !== undefined && Object.prototype.hasOwnProperty.call(OCCASIONS, q.ocasion) ? (q.ocasion as OccasionId) : null;
  const n = Number(q.personas);
  const ppl = q.personas !== undefined && PEOPLE.includes(n) ? n : null;
  return { occasion: occ ?? "merienda", people: ppl ?? 6, chosen: occ !== null && ppl !== null };
}
