import React from "react";
import { DocumentTextIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { cn } from "../lib/utils";
import seguroAuto from "../assets/auto.png";
import seguroMedico from "../assets/medico.png";
import seguroPropiedad from "../assets/casa.png";
import seguroVida from "../assets/vida.png";
import seguroViaje from "../assets/viaje.png";
import seguroMencasTeAsiste from "../assets/asistencia3.png";
const cards = [
  {
    title: "Seguro Vehículo",
    description: "Protege tu auto ante cualquier eventualidad.",
    image: seguroAuto,
  },
  {
    title: "Seguro Médico",
    description: "Tu salud es prioridad. Cobertura médica amplia.",
    image: seguroMedico,
  },
   {
    title: "Seguro de Propiedad",
    description: "Protege tu hogar y pertenencias valiosas.",
    image: seguroPropiedad,
  },
  {
    title: "Seguro de Vida",
    description: "Tranquilidad para ti y tus seres queridos.",
    image: seguroVida,
  },
    {
    title: "Seguro de Viaje",
    description: "Viaja con confianza y protección en todo momento.",
    image: seguroViaje,
  },
      {
    title: "Seguro MencasTeAsiste",
    description: "Asistencia 24/7 en carretera y emergencias.",
    image: seguroMencasTeAsiste,
  },
];

const Hero = () => {
  return (
    <section id="inicio" className="relative w-full min-h-[90vh] bg-white text-gray-800 flex items-center justify-center px-6 py-20">
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
              <span className="inline-flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                Ver servicios
              </span>
            </button>
          </div>
        </div>

        {/* Tarjetas tipo Aceternity UI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              style={{ backgroundImage: `url(${card.image})` }}
              className={cn(
                "group cursor-pointer overflow-hidden relative h-60 shadow-xl border border-neutral-200 bg-cover bg-center bg-no-repeat",
                "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black/50",
                "transition-all duration-500 flex flex-col justify-end p-4"
              )}
            >
              <div className="z-10 relative text-white">
                <h2 className="font-bold text-xl">{card.title}</h2>
                <p className="text-sm">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
