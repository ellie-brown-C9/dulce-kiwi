import Wave from "./Wave";

const PROMISES = [
  "Ingredientes reales",
  "Hecho por mí",
  "A pedido, cada semana",
  "Sin nada refinado",
];

// Four copies: the band slides by half its width, and each half must be wider than any screen
const LOOP = [...PROMISES, ...PROMISES, ...PROMISES, ...PROMISES];

/** Green band with wavy edges and the promises scrolling across in butter. */
export default function Ticker() {
  return (
    <div className="text-forest">
      <Wave className="-mb-px" />
      <div className="overflow-hidden bg-forest py-3 md:py-4">
        <p className="sr-only">{PROMISES.join(" · ")}</p>
        <div
          aria-hidden="true"
          className="flex w-max animate-tick font-display text-[clamp(22px,3vw,36px)] font-bold whitespace-nowrap text-butter italic"
        >
          {LOOP.map((p, i) => (
            <span key={i} className="px-5">
              {p} <span className="text-cream not-italic">✺</span>
            </span>
          ))}
        </div>
      </div>
      <Wave flip className="-mt-px" />
    </div>
  );
}
