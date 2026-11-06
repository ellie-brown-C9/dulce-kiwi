"use client";

import type { Ref } from "react";
import { ITEMS } from "./items.ts";
import { formatPrice, lineText, orderTotal, type OrderLine } from "./logic.ts";
import { whatsappLink } from "../data";

type Props = {
  lines: OrderLine[];
  /** The full WhatsApp message, built by the page with orderMessage(); only ever used as the link */
  message: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQty: (key: string, delta: number) => void;
  /** Measures the forest bar, so the page can pad its bottom by the same height */
  barRef?: Ref<HTMLDivElement>;
};

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function linePrice(line: OrderLine): number {
  const size = ITEMS.find((i) => i.id === line.itemId)?.sizes.find((s) => s.label === line.sizeLabel);
  return size ? size.price * line.qty : 0;
}

/**
 * Forest bar that slides up from the bottom once something is picked: count + total,
 * "Ver pedido" opens a cream list above it with −/+ per line, and the manteca button
 * opens WhatsApp with the order written in.
 */
export default function OrderBar({ lines, message, open, onOpenChange, onQty, barRef }: Props) {
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const show = lines.length > 0;
  const total = orderTotal(lines);

  return (
    <>
      {/* Announced politely as the order changes; kept outside the bar so it is heard even as the bar slides in */}
      <p aria-live="polite" className="sr-only">
        {show ? `Tu pedido: ${count} ${count === 1 ? "cosa" : "cosas"}, ${formatPrice(total)}` : ""}
      </p>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 transition-[translate,visibility] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${
          show ? "visible translate-y-0" : "pointer-events-none invisible translate-y-[110%]"
        }`}
        inert={!show}
      >
        <div className="mx-auto max-w-[720px] md:px-6">
          {show && open && (
            <div
              id="pedido-lista"
              className="max-h-[min(340px,55vh)] overflow-auto rounded-t-[22px] bg-sheet px-5 pt-4 pb-2 text-forest shadow-[0_-10px_30px_-12px_rgb(0_0_0/0.25)]"
            >
              <div className="eyebrow">Tu pedido</div>
              <ul>
                {lines.map((l) => (
                  <li
                    key={l.key}
                    className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-dashed border-[#e4d3b8] py-1.5 text-[14px]"
                  >
                    <span>
                      {capitalise(lineText(l))}
                      <small className="block text-[12.5px] text-ink-soft">{formatPrice(linePrice(l))}</small>
                    </span>
                    <span className="inline-flex items-center font-bold">
                      <button
                        type="button"
                        onClick={() => onQty(l.key, -1)}
                        aria-label={l.qty === 1 ? `Sacar ${lineText(l)}` : `Uno menos de ${lineText(l)}`}
                        className="grid size-11 place-items-center"
                      >
                        <span className="grid size-8 place-items-center rounded-full bg-manteca text-[17px] leading-none">
                          −
                        </span>
                      </button>
                      <span className="min-w-5 text-center tabular-nums">{l.qty}</span>
                      <button
                        type="button"
                        onClick={() => onQty(l.key, 1)}
                        aria-label={`Uno más de ${lineText(l)}`}
                        className="grid size-11 place-items-center"
                      >
                        <span className="grid size-8 place-items-center rounded-full bg-manteca text-[17px] leading-none">
                          +
                        </span>
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="py-2.5 text-center text-[12.5px] text-ink-soft">
                Las porciones y el total son aproximados. Lo confirmamos por WhatsApp.
              </p>
            </div>
          )}

          <div
            ref={barRef}
            className={`flex items-center justify-between gap-3 bg-forest py-3 pr-3 pl-5 max-[359px]:gap-2 max-[359px]:pl-4 text-sheet pb-[max(12px,env(safe-area-inset-bottom))] ${
              open ? "" : "rounded-t-[22px]"
            }`}
          >
            <button
              type="button"
              onClick={() => onOpenChange(!open)}
              aria-expanded={open}
              aria-controls="pedido-lista"
              className="min-h-11 min-w-0 text-left text-[13.5px] max-[359px]:text-[12.5px]"
            >
              <span>
                {count} {count === 1 ? "cosa" : "cosas"}
              </span>{" "}
              ·{" "}
              <span className="whitespace-nowrap underline decoration-manteca/70 underline-offset-[3px]">
                {open ? "Ocultar" : "Ver pedido"}
              </span>
              <span className="block font-display text-[21px] font-extrabold leading-tight text-manteca">
                {formatPrice(total)}
              </span>
            </button>
            <a
              href={whatsappLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 flex-none items-center rounded-full bg-manteca px-4 text-[14px] max-[359px]:px-3 max-[359px]:text-[13px] font-bold whitespace-nowrap text-forest transition-transform hover:-translate-y-px sm:px-5 sm:text-[15px]"
            >
              Pedir por WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
