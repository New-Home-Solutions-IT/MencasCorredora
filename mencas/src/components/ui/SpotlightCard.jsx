import React, { useRef, useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...i) => twMerge(clsx(i));

export default function SpotlightCard({
  image,
  title,
  description,
  badge,            // opcional: "Compra en línea", etc.
  onClick,          // opcional
  className,
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 }); // porcentajes

  function handleMove(e) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setPos({ x, y });
  }

  return (
    <article
      ref={ref}
      onMouseMove={handleMove}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "border border-gray-200 bg-white shadow-sm transition",
        "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-200",
        className
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => onClick && (e.key === "Enter" || e.key === " ") && onClick()}
    >
      {/* Spotlight (ligero y elegante) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at ${pos.x}% ${pos.y}%, rgba(99,102,241,0.15), transparent 40%)`,
        }}
      />

      {/* Imagen top */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="h-40 w-full object-cover"
          draggable="false"
        />
        {badge ? (
          <span className="absolute top-3 right-3 rounded-full bg-pink-600 text-white text-xs font-semibold px-2 py-1 shadow-md">
            {badge}
          </span>
        ) : null}
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-2 p-4">
        <div className="text-sm text-gray-500">Seguro de</div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

        <div className="mt-3">
          <button
            className={cn(
              "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
              "bg-cyan-700 text-white hover:bg-cyan-800 transition"
            )}
          >
            Cotizar
          </button>
        </div>
      </div>
    </article>
  );
}
