// Services.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import SpotlightCard from "../../src/components/ui/SpotlightCard";
import seguroAuto from "../assets/auto.png";
import seguroMedico from "../assets/medico.png";
import seguroPropiedad from "../assets/SeguroPropiedadMencas.png";
import seguroVida from "../assets/vida.png";
import seguroViaje from "../assets/viaje.png";
import seguroMencasTeAsiste from "../assets/asistencia.png";

const SLUGS = {
  "Vehículo": "vehiculo",
  "Médico": "medico",
  "Propiedad": "propiedad",
  "Vida": "vida",
  "Viaje": "viaje",
  "Seguro de Repatriación": "asistencia",
};

// NUEVO: rutas dedicadas para “Beneficios”
const BENEFICIOS_ROUTES = {
  "Vehículo": "/beneficios/vehiculo",
  "Médico": "/beneficios/medico",
  "Propiedad": "/beneficios/propiedad",
  "Vida": "/beneficios/vida",
  "Viaje": "/beneficios/viaje",
  "Seguro de Repatriación": "/beneficios/repatriacion",
};

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
  },
  {
    title: "Seguro de Repatriación",
    description: "Cerca de los tuyos, sin importar la distancia",
    image: seguroMencasTeAsiste,
  },
];

export default function Services() {
  const navigate = useNavigate();

  const goToCotizar = (title) => {
    const slug = SLUGS[title];
    if (!slug) return;
    navigate(`/seguros/${slug}`); // abre el wizard
  };

  // ACTUALIZADO: beneficios van a su propia ruta por seguro
  const goToBeneficios = (title) => {
    const path = BENEFICIOS_ROUTES[title];
    if (!path) return;
    navigate(path);
  };

  // ACTUALIZADO: click en tarjeta ⇒ beneficios
  const onCardClick = (title) => goToBeneficios(title);

  return (
    <section id="servicios" className="w-full py-16 bg-gray-50 text-gray-800">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Nuestros servicios
          </h2>
          <p className="mt-2 text-zinc-400">
            Soluciones en seguros con atención 24/7 y respaldo real.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <SpotlightCard
              key={i}
              image={c.image}
              title={c.title}
              description={c.description}
              badge={c.badge}
              className="h-60"
              onClick={() => onCardClick(c.title)} // tarjeta ⇒ beneficios
              primaryAction={{
                label: "Cotizar",
                onClick: () => goToCotizar(c.title),
              }}
              secondaryAction={{
                label: "Beneficios",
                onClick: () => goToBeneficios(c.title),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
