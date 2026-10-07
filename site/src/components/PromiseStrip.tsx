import { Fragment } from "react";

const PROMISES = [
  "Ingredientes reales",
  "Hecho por mí",
  "A pedido, cada semana",
  "Sin nada refinado",
];

export default function PromiseStrip() {
  return (
    <div className="mx-auto flex max-w-[1232px] flex-wrap justify-center gap-x-10 gap-y-2.5 border-y border-rule px-6 py-[22px] font-serif text-[17px] text-ink-soft italic">
      {PROMISES.map((p, i) => (
        <Fragment key={p}>
          {i > 0 && (
            <span className="text-wheat" aria-hidden="true">
              ✳
            </span>
          )}
          <span>{p}</span>
        </Fragment>
      ))}
    </div>
  );
}
