// src/components/Services.jsx
import React from "react";
import SpotlightCard from "../../src/components/ui/SpotlightCard";

import seguroAuto from "../assets/auto.png";
import seguroMedico from "../assets/medico.png";
import seguroPropiedad from "../assets/SeguroPropiedadMencas.png";
import seguroVida from "../assets/vida.png";
import seguroViaje from "../assets/viaje.png";
import seguroMencasTeAsiste from "../assets/asistencia.png";

const cards = [
  {
    title: "Vehículo",
    description:
      "Maneja tranquilo sabiendo que tu auto está asegurado. Cobertura contra accidentes, robo y daños a terceros.",
    image: seguroAuto,
  },
  {
    title: "Médico",
    description: "Gastos médicos y hospitalización por enfermedad o accidente.",
    image: seguroMedico,
  },
  {
    title: "Propiedad",
    description: "Protege tu hogar y pertenencias valiosas.",
    image: seguroPropiedad,
  },
  {
    title: "Vida",
    description: "Cobertura personalizada en caso de fallecimiento.",
    image: seguroVida,
  },
  {
    title: "Viaje",
    description:
      "Asistencia médica y cobertura ante imprevistos durante viajes nacionales o internacionales.",
    image: seguroViaje,
    badge: "Compra en línea",
  },
  {
    title: "Asegurame T-Asiste",
    description: "Asistencia, protección y salud en todo momento.",
    image: seguroMencasTeAsiste,
    badge: "Compra en línea",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="w-full py-16 bg-gray-50 text-gray-800">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold  text-gray-800 ">
            Nuestros servicios
          </h2>
          <p className="mt-2 text-zinc-400">
            Soluciones en seguros con atención 24/7 y respaldo real.
          </p>
        </header>

        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <SpotlightCard
              key={i}
              image={c.image}
              title={c.title}
              description={c.description}
              content={c.content}
              badge={c.badge}
              ctaText="Cotizar"
              onClick={() => console.log("Ver/Cotizar:", c.title)} 
              className="h-60"
            />
          ))}
        </div> */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <SpotlightCard
              key={i}
              image={c.image}
              title={c.title}
              description={c.description}
              badge={c.badge}
              className="h-60"
              primaryAction={{
                label: "Cotizar",
                onClick: () => console.log("Cotizar:", c.title),
              }}
              secondaryAction={{
                label: "Beneficios",
                onClick: () => console.log("Beneficios:", c.title),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
