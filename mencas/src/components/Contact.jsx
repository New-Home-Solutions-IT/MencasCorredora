import React from "react";
import { BackgroundGradient } from "../components/ui/background-gradient";
import { FaWhatsapp } from "react-icons/fa";
import Mauricio_Mendoza from "../assets/Mauricio_Mendoza.png";
import logo from "../assets/logoheroMencas.png";

const Contact = () => {
  return (
    <section
      id="contact"
      className="relative w-full min-h-[90vh] bg-gray-100 text-gray-800 px-6 py-20 flex flex-col items-center justify-center"
    >
      {/* Encabezado */}
      <div className="max-w-4xl w-full space-y-6 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Su Bienestar en Nuestros Servicios
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Simplificamos la contratación de seguros en Honduras para que estés
          protegido sin complicaciones.
        </p>
      </div>
      <div className="flex justify-center w-full">
        <BackgroundGradient className="relative rounded-[16px] w-[260px] p-4 sm:p-5 bg-white text-center">
          <img
            src={Mauricio_Mendoza}
            alt="Mauricio"
            height="300"
            width="300"
            className="object-contain mx-auto"
          />
          <p className="text-base sm:text-lg text-black mt-3 mb-1">
            Mauricio Mendoza
          </p>
          <p className="text-sm text-neutral-600 mb-4">
            Gerente de Mencas Corredora de Seguros y Asesor de Seguros.
          </p>

          {/* Botón WhatsApp */}
          <a
            href="https://wa.me/50432614605"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaWhatsapp className="w-5 h-5" />
            WhatsApp
          </a>
        </BackgroundGradient>
      </div>

      {/* Logo sticky con tooltip */}
      <a
        href="#inicio"
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="Ir al inicio Mencas"
        title="Ir al inicio" 
      >
        {/* Tooltip */}
        <div className="pointer-events-none absolute -top-2 right-0 translate-y-[-100%] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition duration-200">
          <div className="bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap relative">
            Volver arriba • Inicio
            {/* Flechita */}
            <span className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 rotate-45"></span>
          </div>
        </div>

        {/* Botón redondo */}
        <div className="rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-lg p-3 group-hover:shadow-xl transition transform hover:-translate-y-0.5">
          <img src={logo} alt="Logo Mencas" className="w-10 h-10 object-contain" />
        </div>
      </a>
    </section>
  );
};

export default Contact;
