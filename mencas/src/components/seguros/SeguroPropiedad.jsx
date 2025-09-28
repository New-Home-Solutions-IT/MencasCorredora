import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconHome,
  IconBuildingSkyscraper,
  IconBriefcase,
  IconShieldCheck,
  IconFireHydrant,
  IconDroplet,
  IconBolt,
  IconLock,
} from "@tabler/icons-react";
import propiedadImg from "../../assets/logoheroMencas.png";
import logo from "../../assets/logoheroMencas.png";
import { FaWhatsapp } from "react-icons/fa";
const BRAND = "rgb(34,128,62)";

export default function SeguroPropiedad() {
  const navigate = useNavigate();

  return (
    <main className="w-full bg-white">
      {/* HERO */}
      <section id="inicio" className="overflow-hidden relative h-[60vh] min-h-[420px] bg-gradient-to-r from-emerald-700 to-emerald-500 text-white flex items-center pt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between p-10">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Protege tu hogar o negocio
            </h1>
            <p className="text-lg opacity-90">
              El seguro de propiedad resguarda tu vivienda, oficina o local ante
              incendios, robos, desastres naturales y más. Tu tranquilidad, en
              un solo plan.
            </p>
            <button
              onClick={() => navigate("/seguros/propiedad")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition"
                  style={{ backgroundColor: BRAND }}
            >
              Cotizar
            </button>
          </div>
          <img
            src={propiedadImg}
            alt="Seguro de Propiedad"
            className="mt-6 md:mt-0 w-64 md:w-80"
          />
        </div>
      </section>

      {/* COBERTURAS */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Coberturas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <CoverageCard
            Icon={IconFireHydrant}
            title="Incendio y explosiones"
            desc="Cubre daños ocasionados por incendios, explosiones accidentales y humo."
          />
          <CoverageCard
            Icon={IconDroplet}
            title="Daños por agua"
            desc="Protección frente a fugas, inundaciones y fenómenos naturales."
          />
          <CoverageCard
            Icon={IconBolt}
            title="Fenómenos naturales"
            desc="Cobertura por tormentas, huracanes, rayos, terremotos y más."
          />
          <CoverageCard
            Icon={IconShieldCheck}
            title="Robo y vandalismo"
            desc="Resguarda tu patrimonio frente a robos, saqueos o daños malintencionados."
          />
          <CoverageCard
            Icon={IconHome}
            title="Estructura"
            desc="Cubre daños en paredes, techos, pisos y demás infraestructura de tu propiedad."
          />
          <CoverageCard
            Icon={IconBriefcase}
            title="Contenido"
            desc="Protección para mobiliario, electrodomésticos, equipos y mercancías."
          />
        </div>
      </section>

      {/* ¿POR QUÉ ES NECESARIO? */}
      <section className="bg-emerald-50 py-12">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ¿Por qué es necesario?
          </h2>
          <p className="text-gray-600">
            Un seguro de propiedad te brinda tranquilidad financiera frente a
            desastres inesperados. Ya sea tu casa, apartamento o negocio, tu
            inversión estará siempre protegida.
          </p>
          <button
            onClick={() => navigate("/seguros/propiedad")}
            className="mt-6 inline-flex items-center rounded-lg bg-emerald-700 px-5 py-2.5 text-white font-medium shadow hover:bg-emerald-800 transition"
          >
            Cotizar
          </button>
        </div>
      </section>

      {/* REQUISITOS */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Requisitos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <RequirementCard
            number="01"
            text="Datos generales de la propiedad (dirección, tipo de construcción, etc.)"
          />
          <RequirementCard
            number="02"
            text="Documento de identidad del propietario o arrendatario."
          />
          <RequirementCard
            number="03"
            text="Valor estimado de la propiedad y su contenido."
          />
          <RequirementCard
            number="04"
            text="Inspección previa de la propiedad (según aplique)."
          />
        </div>
      </section>

      {/* GLOSARIO */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Glosario
        </h2>
        <details className="mb-3 rounded-lg border px-4 py-2">
          <summary className="cursor-pointer font-medium text-emerald-700">
            Prima asegurada
          </summary>
          <p className="mt-2 text-sm text-gray-600">
            Es el costo que debes pagar periódicamente para mantener activa tu
            cobertura.
          </p>
        </details>
        <details className="mb-3 rounded-lg border px-4 py-2">
          <summary className="cursor-pointer font-medium text-emerald-700">
            Deducible
          </summary>
          <p className="mt-2 text-sm text-gray-600">
            Es la cantidad que debes cubrir por tu cuenta antes de que el seguro
            cubra el resto.
          </p>
        </details>
        <details className="mb-3 rounded-lg border px-4 py-2">
          <summary className="cursor-pointer font-medium text-emerald-700">
            Cobertura estructural
          </summary>
          <p className="mt-2 text-sm text-gray-600">
            Se refiere a la protección de la infraestructura de tu propiedad.
          </p>
        </details>
      </section>
            {/* === Botones flotantes (WhatsApp + Volver arriba) === */}
            <div className="fixed right-6 bottom-4 sm:right-7 sm:bottom-7 md:right-8 md:bottom-8 z-[60] flex flex-col items-end gap-3">
              {/* WhatsApp */}
              <a
                href="https://wa.me/50432614605?text=Hola%20MencasCorredores,%20quiero%20informaci%C3%B3n%20acerca%20de%20:"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label="Chatea por WhatsApp"
                title="Abrir WhatsApp"
              >
                {/* Tooltip a la izquierda */}
                <div className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition duration-200">
                  <div className="bg-green-600 text-white text-xs px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap relative">
                    Escríbenos por WhatsApp
                    <span className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-green-600 rotate-45"></span>
                  </div>
                </div>
      
                {/* Botón redondo */}
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
                  <FaWhatsapp className="w-8 h-8" />
                </div>
              </a>
      
              {/* Volver arriba */}
              <a
                href="#inicio"
                className="group relative"
                aria-label="Ir al inicio Mencas"
                title="Ir al inicio"
              >
                {/* Tooltip a la izquierda */}
                <div className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition duration-200">
                  <div className="bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap relative">
                    Volver arriba • Inicio
                    <span className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 rotate-45"></span>
                  </div>
                </div>
      
                {/* Botón redondo */}
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
                  <img
                    src={logo}
                    alt="Logo Mencas"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </a>
            </div>
    </main>
  );
}

/* ==== Subcomponentes ==== */
function CoverageCard({ Icon, title, desc }) {
  return (
    <div className="p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition">
      <Icon className="h-8 w-8 text-emerald-600 mb-3" />
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
}

function RequirementCard({ number, text }) {
  return (
    <div className="p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition">
      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-700 text-white text-sm font-bold mb-3">
        {number}
      </span>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
    
  );
}
