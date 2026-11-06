/**
 * A yellow (manteca) pill that reads as part of the sentence, with a small round forest chevron.
 * The real control is a native <select> stretched invisibly over the pill, so phones open
 * their own picker and screen readers get a proper combobox.
 */
export default function Picker<T extends string | number>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  const current = options.find((o) => o.value === value)?.label ?? String(value);
  // "postre para un almuerzo" is too long for one line on a phone at headline size: shrink just that pill
  const long = current.length > 14;

  return (
    <span
      className={`relative inline-flex max-w-full items-center gap-[0.22em] rounded-[0.7em] bg-manteca py-[0.02em] pr-[0.32em] pl-[0.45em] align-baseline italic font-extrabold text-forest shadow-[0_3px_0_rgb(52_80_63/0.18)] transition-shadow focus-within:shadow-[0_3px_0_rgb(52_80_63/0.18),0_0_0_3px_var(--color-forest)] hover:shadow-[0_4px_0_rgb(52_80_63/0.28)] ${
        long ? "max-sm:text-[0.72em]" : ""
      }`}
    >
      <span>{current}</span>
      <span
        aria-hidden="true"
        className="inline-grid size-[0.62em] flex-none place-items-center self-center rounded-full bg-forest text-sheet"
      >
        <svg viewBox="0 0 10 10" className="size-[70%]">
          <path d="M2.5 4l2.5 2.5L7.5 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <select
        aria-label={ariaLabel}
        value={String(value)}
        onChange={(e) => {
          const picked = options.find((o) => String(o.value) === e.target.value);
          if (picked) onChange(picked.value);
        }}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none text-base opacity-0"
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </span>
  );
}
