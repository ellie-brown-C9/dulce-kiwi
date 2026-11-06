"use client";

import { useEffect, useRef, useState } from "react";
import { GROUPS, ITEMS, OCCASIONS, PEOPLE_RANGES, type MenuItem, type OccasionId } from "./items.ts";
import {
  HELLO_MESSAGE,
  addOrToggle,
  changeQty,
  lineKey,
  orderMessage,
  planFor,
  quantityLabel,
  suggest,
  type OrderLine,
} from "./logic.ts";
import { whatsappLink } from "../data";
import Picker from "./Picker";
import MenuCard from "./MenuCard";
import OrderBar from "./OrderBar";

type Initial = { occasion: OccasionId; people: number; chosen: boolean };

const OCCASION_OPTIONS = (Object.keys(OCCASIONS) as OccasionId[]).map((id) => ({
  value: id,
  label: OCCASIONS[id].label,
}));

/** The /menu page body: the matchmaker sentence, three suggestions, the full menu and the order bar. */
export default function MenuClient({ initial }: { initial: Initial }) {
  const [occasion, setOccasion] = useState<OccasionId>(initial.occasion);
  const [people, setPeople] = useState(initial.people);
  // Whether the customer has told us what it's for (touched a select or came from the homepage teaser)
  const [chosen, setChosen] = useState(initial.chosen);
  const [lines, setLines] = useState<OrderLine[]>([]);
  // What each card currently shows: size (menu cards) and frosting (shared by an item's cards)
  const [sizeOf, setSizeOf] = useState<Record<string, string>>({});
  const [choiceOf, setChoiceOf] = useState<Record<string, string>>(() =>
    Object.fromEntries(ITEMS.filter((i) => i.choice).map((i) => [i.id, i.choice!.options[0]])),
  );
  const [open, setOpen] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  const count = lines.reduce((n, l) => n + l.qty, 0);

  // Tell the rest of the page (the floating WhatsApp pill) how much is in the order
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("dk:order", { detail: { count } }));
  }, [count]);

  // Pad the page by the bar's height while it shows, so it never covers the closing card
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBarHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const update = (next: OrderLine[]) => {
    setLines(next);
    if (next.length === 0) setOpen(false); // the list starts closed next time
  };
  const toggle = (item: MenuItem, sizeLabel: string, qty: number) => {
    const choice = item.choice ? choiceOf[item.id] : undefined;
    update(addOrToggle(lines, { itemId: item.id, sizeLabel, choice, qty }));
  };
  const isAdded = (item: MenuItem, sizeLabel: string) =>
    lines.some((l) => l.key === lineKey(item.id, sizeLabel, item.choice ? choiceOf[item.id] : undefined));
  const setChoice = (id: string) => (option: string) => setChoiceOf((c) => ({ ...c, [id]: option }));

  const message = orderMessage(lines, chosen ? { occasion, people } : null);
  const suggestions = suggest(occasion, people);

  return (
    <div style={{ paddingBottom: lines.length > 0 ? barHeight : 0 }} className="transition-[padding] duration-300">
      <main>
        {/* 1. The question */}
        <section className="px-5 pt-8 pb-2 text-center sm:px-6 md:pt-14">
          <div className="eyebrow">El menú</div>
          <h1 className="font-display mx-auto mt-3 max-w-[900px] text-[clamp(28px,8.2vw,62px)] leading-[1.18] font-black tracking-[-0.01em] text-balance">
            Es para {OCCASIONS[occasion].article}{" "}
            <Picker
              ariaLabel="Para qué es"
              value={occasion}
              options={OCCASION_OPTIONS}
              onChange={(v) => {
                setOccasion(v);
                setChosen(true);
              }}
            />{" "}
            de{" "}
            <Picker
              ariaLabel="Cuántas personas"
              value={people}
              options={PEOPLE_RANGES}
              onChange={(v) => {
                setPeople(v);
                setChosen(true);
              }}
            />
          </h1>
          <p className="mt-4 text-[15px] text-ink-soft md:text-[17px]">Contame y te digo qué llevar.</p>
        </section>

        {/* 2. Three suggestions */}
        <section aria-label="Sugerencias" className="mx-auto max-w-[1232px] px-5 pt-6 sm:px-6 md:pt-8">
          <div className="grid gap-4 sm:grid-cols-3 md:gap-5">
            {suggestions.map((item) => {
              const plan = planFor(item, people);
              return (
                <MenuCard
                  key={item.id}
                  variant="suggestion"
                  item={item}
                  size={plan.size}
                  price={plan.total}
                  qtyLabel={quantityLabel(item, plan.size, plan.qty)}
                  added={isAdded(item, plan.size.label)}
                  onToggle={() => toggle(item, plan.size.label, plan.qty)}
                  choice={choiceOf[item.id]}
                  onChoice={setChoice(item.id)}
                  eager
                />
              );
            })}
          </div>
          <p className="mt-6 text-center text-[14px] text-ink-soft md:text-[15px]">
            Agregá lo que te guste y pedilo todo junto por WhatsApp.
          </p>
          <a
            href="#todo"
            className="mx-auto mt-3 flex min-h-11 w-fit items-center font-bold underline decoration-manteca decoration-[3px] underline-offset-[6px]"
          >
            Ver todo el menú ↓
          </a>
        </section>

        {/* 3. The full menu */}
        <div id="todo" className="mx-auto max-w-[1232px] scroll-mt-4 px-5 sm:px-6">
          {GROUPS.map((group) => (
            <section key={group.id} aria-labelledby={`grupo-${group.id}`} className="mt-12 md:mt-16">
              <div className="eyebrow">{group.eyebrow}</div>
              <h2
                id={`grupo-${group.id}`}
                className="font-display mt-1 mb-5 text-[clamp(30px,7vw,44px)] leading-[1.05] font-black"
              >
                {group.title}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
                {ITEMS.filter((i) => i.group === group.id).map((item) => {
                  const size = item.sizes.find((s) => s.label === sizeOf[item.id]) ?? item.sizes[0];
                  return (
                    <MenuCard
                      key={item.id}
                      variant="menu"
                      item={item}
                      size={size}
                      price={size.price}
                      added={isAdded(item, size.label)}
                      onToggle={() => toggle(item, size.label, 1)}
                      onSize={(label) => setSizeOf((s) => ({ ...s, [item.id]: label }))}
                      choice={choiceOf[item.id]}
                      onChoice={setChoice(item.id)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* 4. Closing card */}
        <section className="mx-auto max-w-[1232px] px-5 pt-14 pb-14 sm:px-6 md:pt-20 md:pb-20">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-forest px-6 py-8 text-sheet md:px-10 md:py-10">
            <div className="max-w-[560px]">
              <h2 className="font-display text-[30px] leading-[1.05] font-extrabold md:text-[38px]">
                ¿No ves lo que buscás?
              </h2>
              <p className="mt-3 text-[15px] leading-[1.55] text-cream/85 md:text-[16px]">
                Este menú es para darte ideas. Puedo hacerte lo que se te antoje: escribime y lo armamos juntos.
              </p>
            </div>
            <a
              href={whatsappLink(HELLO_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pop inline-flex min-h-12 items-center rounded-full bg-manteca px-6 text-[15px] font-bold whitespace-nowrap max-[359px]:px-4 max-[359px]:text-[14px] text-forest [--btn-shadow:var(--color-sheet)]"
            >
              Escribime por WhatsApp →
            </a>
          </div>
        </section>
      </main>

      <OrderBar
        barRef={barRef}
        lines={lines}
        message={message}
        open={open}
        onOpenChange={setOpen}
        onQty={(key, delta) => update(changeQty(lines, key, delta))}
      />
    </div>
  );
}
