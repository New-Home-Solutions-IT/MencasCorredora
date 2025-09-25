import React from "react";
import davivienda from "../assets/alliances/daviviendaSeguros.png";
import grupoEPS from "../assets/alliances/grupoEPS.png";
import mawdy from "../assets/alliances/MAWDY.webp";
import PanAmericanLife from "../assets/alliances/PanAmericanLife.png";
import segurosContinental from "../assets/alliances/SegurosContinental.png";
import seguroCrefisa from "../assets/alliances/SeguroCrefisa.png";
import segurolafise from "../assets/alliances/SegurosLafise.png";

const alliances = [
  { name: "Davivienda Seguros", url: "", logo: davivienda },
  { name: "Grupo EPS", url: "", logo: grupoEPS },
  { name: "Mawdy", url: "", logo: mawdy },
  { name: "Pan American Life", url: "", logo: PanAmericanLife },
  { name: "Seguros Continental", url: "", logo: segurosContinental },
  { name: "Seguros Crefisa", url: "", logo: seguroCrefisa },
  { name: "Seguros Lafise", url: "", logo: segurolafise },
];

export default function Alliances() {
  // Duplicamos para loop continuo
  const items = [...alliances, ...alliances];

  return (
    <section className="w-full bg-white py-10">
      {/* Título centrado dentro de container */}
      <div className="mx-auto max-w-7xl px-6">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Alianzas estratégicas
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Trabajamos con compañías líderes para ofrecerte mejores coberturas.
        </p>
      </div>

      {/* Carrusel full-width pero visualmente centrado */}
      <div className="group relative overflow-hidden">
        {/* Gradientes laterales (se adaptan al fondo) */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 sm:w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 sm:w-16 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Pista */}
        <div className="animate-marquee will-change-transform py-6">
          <div className="flex items-center gap-6 sm:gap-10 md:gap-12 px-6 md:px-12">
            {items.map((a, i) => (
              <a
                key={`${a.name}-${i}`}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center opacity-80 hover:opacity-100 transition"
                title={a.name}
                style={{
                  width: "clamp(112px, 14vw, 180px)",  // ancho fluido
                  height: "clamp(40px, 7vw, 64px)",    // alto fluido
                }}
              >
                <img
                  src={a.logo}
                  alt={a.name}
                  className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition"
                  draggable="false"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Estilos del marquee + accesibilidad motion */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;         /* ancho según contenido */
          animation: marquee 22s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `}</style>
    </section>
  );
}
