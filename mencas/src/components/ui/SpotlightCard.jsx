// src/components/ui/SpotlightCard.jsx
import React, { useRef } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
const cn = (...i) => twMerge(clsx(i));

export default function SpotlightCard({
  image,
  title,
  description,
  badge,
  primaryAction,   // { label: "Cotizar", onClick: fn }
  secondaryAction, // { label: "Beneficios", onClick: fn }
  className,
}) {
  const ref = useRef(null);
  let raf = null;

  function handleMove(e) {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    });
  }

  return (
    <article
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm",
        "transition-transform duration-300 will-change-transform hover:scale-[1.02]",
        "[--x:50%] [--y:50%]",
        className
      )}
    >
      {/* Imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />

      {/* Spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(240px circle at var(--x) var(--y), rgba(255,255,255,0.18), transparent 45%)",
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 p-4 text-white h-full flex flex-col justify-end drop-shadow-md">
        {badge && (
          <span className="absolute top-3 left-3 rounded-full bg-[rgb(34,128,62)] text-white text-xs font-semibold px-2 py-1 shadow">
            {badge}
          </span>
        )}
        <div className="text-sm text-white/90">Seguro de</div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-white/90 line-clamp-2">{description}</p>

        {/* Botones */}
        <div className="mt-3 flex gap-2">
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-[rgb(34,128,62)] hover:bg-[rgb(30,110,55)] transition"
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-white/60 text-white hover:bg-white/10 transition"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
