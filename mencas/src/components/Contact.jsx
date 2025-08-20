import React from "react";
import { DocumentTextIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { BackgroundGradient } from "../components/ui/background-gradient";
import Mauricio_Mendoza from "../assets/Mauricio_Mendoza.png";
const Contact = () => {
  return (
    <section
      id="contact" 
      className="relative w-full min-h-[90vh] bg-gray-100 text-gray-800 flex flex-col items-center justify-center px-6 py-20"
    >
      <div className="max-w-4xl w-full space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Su Bienestar en Nuestros Servicios
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Simplificamos la contratación de seguros en Honduras para que estés
          protegido sin complicaciones.
        </p>
      </div>
      <br />
<div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
  <BackgroundGradient className="rounded-[16px] w-[220px] p-4 sm:p-5 bg-gray-50 dark:bg-gray-200">
    <img
      src={Mauricio_Mendoza}
      alt="Mauricio"
      height="300"
      width="300"
      className="object-contain mx-auto"
    />
    <p className="text-base sm:text-lg text-black mt-3 mb-1 dark:text-neutral-600">
      Mauricio Mendoza
    </p>
    <p className="text-sm text-neutral-600 dark:text-neutral-600">
      Gerente de Mencas Corredora de Seguros y asesor de seguros.
    </p>
  </BackgroundGradient>
</div>

    </section>
  );
};
export default Contact;
