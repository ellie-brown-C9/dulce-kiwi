import Image from "next/image";
import type { MenuItem, Size } from "./items.ts";
import { formatPrice, servingsNote } from "./logic.ts";

type Props = {
  item: MenuItem;
  /** "suggestion" = the three big cards under the sentence; "menu" = the full-menu grid */
  variant: "suggestion" | "menu";
  size: Size;
  price: number;
  /** Suggestion cards: the quantity pill, e.g. "2 docenas" */
  qtyLabel?: string;
  added: boolean;
  onToggle: () => void;
  /** Menu cards with more than one size: Normal / Mini, 2 unidades / Caja de 12 */
  onSize?: (label: string) => void;
  choice?: string;
  onChoice?: (option: string) => void;
  eager?: boolean;
};

/** Small segmented toggle (sizes, frosting), as in the mockup. Each button gets a 44px-tall hit area. */
function Toggle({
  options,
  value,
  onChange,
  label,
  fill,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  label: string;
  /** Narrow cards: split the full width evenly instead of sizing to the words */
  fill?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`max-w-full rounded-[16px] border border-[#e4d3b8] bg-white p-[3px] ${
        fill
          ? "grid w-full grid-cols-[auto_auto] max-[359px]:grid-cols-1 sm:inline-flex sm:w-auto"
          : "inline-flex flex-wrap"
      }`}
    >
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o)}
            className={`relative min-h-[30px] rounded-full px-2.5 text-[12px] font-bold ${fill ? "leading-[1.1] max-sm:px-1 max-sm:text-[11px]" : "whitespace-nowrap"} transition-colors after:absolute after:inset-x-0 after:-inset-y-[7px] after:content-[''] max-[359px]:px-2 max-[359px]:text-[11.5px] sm:px-3 sm:text-[12.5px] ${
              on ? "bg-forest text-sheet" : "text-forest hover:bg-forest/10"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export default function MenuCard({
  item,
  variant,
  size,
  price,
  qtyLabel,
  added,
  onToggle,
  onSize,
  choice,
  onChoice,
  eager,
}: Props) {
  const big = variant === "suggestion";
  const note = servingsNote(item, size);

  return (
    <article
      className={`flex min-w-0 flex-col rounded-[24px] bg-sheet transition-shadow md:rounded-[28px] ${
        big ? "p-4 text-center md:p-5" : "p-2.5 sm:p-3.5"
      } ${added ? "shadow-[inset_0_0_0_2.5px_var(--color-forest)]" : ""}`}
    >
      {/* Full photo with its real background, or a text-only panel the same size (it may grow to fit the words) */}
      {item.photo ? (
        <div className={`relative aspect-square overflow-hidden bg-cream ${big ? "rounded-[18px]" : "rounded-[16px]"}`}>
          <Image
            src={item.photo}
            alt={item.photoAlt}
            fill
            sizes={big ? "(min-width: 768px) 400px, 90vw" : "(min-width: 768px) 400px, 50vw"}
            loading={eager ? "eager" : "lazy"}
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className={`flex aspect-square flex-col items-center justify-center bg-cream text-center ${
            big ? "rounded-[18px] px-6 py-6" : "rounded-[16px] px-2.5 py-4 sm:px-5"
          }`}
        >
          <h3
            className={`max-w-full break-words hyphens-auto font-display font-black leading-[0.95] tracking-[-0.01em] text-forest ${
              big ? "text-[34px] min-[390px]:text-[46px]" : "text-[20px] min-[390px]:text-[25px] sm:text-[40px]"
            }`}
          >
            {item.name}
          </h3>
          <p
            className={`text-ink-soft ${big ? "mt-4 max-w-[24ch] text-[15px] leading-[1.5]" : "mt-2.5 max-w-[24ch] text-[12.5px] leading-[1.4] sm:mt-4 sm:text-[14px]"}`}
          >
            {item.desc}
          </p>
        </div>
      )}

      <div className={`flex flex-1 flex-col ${big ? "items-center px-1 pt-4" : "px-1 pt-3"}`}>
        {item.photo && (
          <>
            <h3
              className={`font-display font-extrabold leading-[1.1] ${big ? "text-[24px]" : "text-[17px] sm:text-[20px]"}`}
            >
              {item.name}
            </h3>
            <p
              className={`mt-1.5 text-ink-soft ${big ? "text-[14px] leading-[1.5]" : "text-[12.5px] leading-[1.45] sm:text-[13.5px]"}`}
            >
              {item.desc}
            </p>
          </>
        )}

        {big && qtyLabel && (
          <span className="mt-3 inline-block rounded-full bg-manteca px-3.5 py-1 text-[13px] font-bold">
            {qtyLabel}
          </span>
        )}

        <div className={`mt-auto w-full ${item.photo ? "pt-3" : ""}`}>
          <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${big ? "justify-center" : ""}`}>
            <span className={`font-display font-extrabold ${big ? "text-[24px]" : "text-[18px] sm:text-[20px]"}`}>
              {formatPrice(price)}
            </span>
            {!big && onSize && item.sizes.length > 1 && (
              <Toggle
                fill
                label={`Tamaño de ${item.name}`}
                options={item.sizes.map((s) => s.label)}
                value={size.label}
                onChange={onSize}
              />
            )}
          </div>
          {note && <p className="mt-1 text-[12px] text-ink-soft">{note}</p>}

          {item.choice && choice && onChoice && (
            <div
              className={`mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[12.5px] font-bold text-ink-soft ${
                big ? "justify-center" : ""
              }`}
            >
              <span className={big ? "" : "w-full"}>{item.choice.label}:</span>
              <Toggle
                fill={!big}
                label={`${item.choice.label} de ${item.name}`}
                options={item.choice.options}
                value={choice}
                onChange={onChoice}
              />
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            aria-pressed={added}
            className={`mt-3.5 inline-flex min-h-11 w-full items-center justify-center rounded-full border-[1.5px] border-forest px-2 text-[14px] font-bold whitespace-nowrap max-[359px]:text-[13px] transition-colors ${
              added ? "bg-forest text-sheet" : "text-forest hover:bg-forest/5"
            }`}
          >
            {added ? "✓ Agregado" : "+ Agregar"}
            <span className="sr-only"> {item.name}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
