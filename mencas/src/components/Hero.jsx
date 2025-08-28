import React from "react";
import { DocumentTextIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import seguroAuto from "../assets/auto.png";
import seguroMedico from "../assets/medico.png";
import seguroPropiedad from "../assets/SeguroPropiedadMencas.png";
import seguroVida from "../assets/vida.png";
import seguroViaje from "../assets/viaje.png";
import seguroMencasTeAsiste from "../assets/asistencia.png";

const cards = [
  { title: "Seguro de Vehículo", slug: "vehiculo", description: "Protege tu auto ante cualquier eventualidad.", image: seguroAuto },
  { title: "Seguro Médico", slug: "medico", description: "Tu salud es prioridad. Cobertura médica amplia.", image: seguroMedico },
  { title: "Seguro de Propiedad", slug: "propiedad", description: "Protege tu hogar y pertenencias valiosas.", image: seguroPropiedad },
  { title: "Seguro de Vida", slug: "vida", description: "Tranquilidad para ti y tus seres queridos.", image: seguroVida },
  { title: "Seguro de Viaje", slug: "viaje", description: "Viaja con confianza y protección en todo momento.", image: seguroViaje },
  { title: "Seguro Asistencia", slug: "asistencia", description: "Asistencia 24/7 en carretera y emergencias.", image: seguroMencasTeAsiste },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="inicio"
      className="scroll-mt-24 relative w-full min-h-[90vh] bg-white text-gray-800 flex items-center justify-center px-6 py-20"
    >
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto w-full">
        {/* Texto principal */}
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Tu protección empieza <span className="text-[rgb(34,128,62)]">hoy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Cotiza tu seguro de forma rápida, segura y sin complicaciones.
          </p>
          <div className="flex justify-center md:justify-start gap-4 flex-wrap">
            <button className="group relative bg-[rgb(34,128,62)] hover:bg-[rgb(30,110,55)] text-white px-8 py-3 rounded-md transition duration-200 shadow-md hover:scale-105">
              <span className="inline-flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5" />
                Cotiza ahora
              </span>
            </button>
            <button className="group border border-[rgb(34,128,62)] text-[rgb(34,128,62)] hover:bg-[rgb(34,128,62)] hover:text-white px-8 py-3 rounded-md transition duration-200 shadow-md hover:scale-105">
              <a href="#servicios" className="inline-flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                Ver servicios
              </a>
            </button>
          </div>
        </div>

        {/* Tarjetas tipo Aceternity UI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((card) => (
            <button
              key={card.slug}
              onClick={() => navigate(`/seguros/${card.slug}`)}
              className="group relative h-60 w-full overflow-hidden rounded-lg border border-neutral-300 bg-neutral-900 text-left shadow-xl"
              style={{
                backgroundImage: `url(${card.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/50 transition-colors" />
              <div className="relative z-10 p-4 text-white">
                <h2 className="font-bold text-lg">{card.title}</h2>
                <p className="text-sm opacity-90">{card.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
