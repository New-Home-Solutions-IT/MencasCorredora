import React from "react";
import { DocumentTextIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { BackgroundGradient } from "../components/ui/background-gradient";
import cr72 from "../assets/cr72.png";
const Contact = () => {
  return (
    <section
      id="contact" 
      className="relative w-full min-h-[90vh] bg-gray-100 text-gray-800 flex flex-col items-center justify-center px-6 py-20"
    >
      <div className="max-w-4xl w-full space-y-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Tu seguridad es nuestra misión.
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Simplificamos la contratación de seguros en Honduras para que estés
          protegido sin complicaciones.
        </p>
      </div>
      <br />
      <br />
{/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  <BackgroundGradient className="rounded-[16px] max-w-xs p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
    <img
      src={cr72}
      alt="Mauricio"
      height="300"
      width="300"
      className="object-contain mx-auto"
    />
    <p className="text-base sm:text-lg text-black mt-3 mb-1 dark:text-neutral-200">
      Mauricio Dubon
    </p>
    <p className="text-sm text-neutral-600 dark:text-neutral-400">
      Gerente de Mencas Corredora de Seguros.
    </p>
  </BackgroundGradient>

  <BackgroundGradient className="rounded-[16px] max-w-xs p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
    <img
      src={cr72}
      alt="Cristiano"
      height="300"
      width="300"
      className="object-contain mx-auto"
    />
    <p className="text-base sm:text-lg text-black mt-3 mb-1 dark:text-neutral-200">
      Cristiano Ronaldo
    </p>
    <p className="text-sm text-neutral-600 dark:text-neutral-400">
      Asesor de Seguros y embajador de Mencas Corredora de Seguros.
    </p>
  </BackgroundGradient>
</div> */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  <BackgroundGradient className="rounded-[16px] w-[220px] p-4 sm:p-5 bg-gray-50 dark:bg-gray-200">
    <img
      src={cr72}
      alt="Mauricio"
      height="250"
      width="250"
      className="object-contain mx-auto"
    />
    <p className="text-base sm:text-lg text-black mt-3 mb-1 dark:text-neutral-600">
      Mauricio Dubon
    </p>
    <p className="text-sm text-neutral-600 dark:text-neutral-600">
      Gerente de Mencas Corredora de Seguros y asesor de seguros.
    </p>
  </BackgroundGradient>

  <BackgroundGradient className="rounded-[16px] w-[220px] p-4 sm:p-5 bg-gray-50 dark:bg-gray-200">
    <img
      src={cr72}
      alt="Cristiano"
      height="250"
      width="250"
      className="object-contain mx-auto"
    />
    <p className="text-base sm:text-lg text-black mt-3 mb-1 dark:text-neutral-600">
      Cristiano Ronaldo
    </p>
    <p className="text-sm text-neutral-600 dark:text-neutral-600">
      Asesor de Seguros y embajador de Mencas Corredora de Seguros.
    </p>
  </BackgroundGradient>
</div>

    </section>
  );
};
export default Contact;
