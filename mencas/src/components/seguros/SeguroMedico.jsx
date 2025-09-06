
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconStethoscope,
  IconHeartbeat,
  IconAmbulance,
  IconVaccine,
  IconPill,
  IconReportMedical,
  // IconShieldCross,
  IconBed,
  IconDental,
  IconLifebuoy,
  IconChevronRight,
} from "@tabler/icons-react";

import seguroMedico from "../../assets/logoheroMencas.png";; 

const BRAND = "rgb(34,128,62)";

const COBERTURAS = [
  {
    icon: IconStethoscope,
    title: "Consultas y exámenes",
    desc: "Atención médica primaria, chequeos y laboratorio.",
  },
  {
    icon: IconBed,
    title: "Hospitalización",
    desc: "Habitación, quirófano, honorarios y medicinas intrahospitalarias.",
  },
  {
    icon: IconAmbulance,
    title: "Emergencias",
    desc: "Traslado en ambulancia y atención de urgencias 24/7.",
  },
  {
    icon: IconPill,
    title: "Medicamentos",
    desc: "Cobertura en recetas y tratamientos ambulatorios.",
  },
  {
    icon: IconVaccine,
    title: "Vacunas y prevención",
    desc: "Esquemas preventivos y medicina preventiva.",
  },
  {
    icon: IconReportMedical,
    title: "Maternidad (opcional)",
    desc: "Controles, parto/cesárea según plan y carencias.",
  },
  // {
  //   icon: IconShieldCross,
  //   title: "Enfermedades graves",
  //   desc: "Coberturas para diagnósticos de alto costo.",
  // },
  {
    icon: IconDental,
    title: "Odontología (opcional)",
    desc: "Limpiezas, extracciones y tratamientos básicos.",
  },
  {
    icon: IconHeartbeat,
    title: "Telemedicina",
    desc: "Consultas virtuales sin salir de casa.",
  },
  {
    icon: IconLifebuoy,
    title: "Asistencia internacional",
    desc: "Soporte médico en viajes (según plan).",
  },
];

export default function SeguroMedico() {
  const navigate = useNavigate();
  const goCotizar = () => navigate("/seguros/medico");

  return (
    <main className="w-full bg-white text-gray-800">
      {/* HERO */}
      <section className="overflow-hidden relative h-[60vh] min-h-[420px] bg-gradient-to-r from-emerald-700 to-emerald-500 text-white flex items-center pt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between p-10">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Cuida tu salud <br className="hidden md:block" />
              con un seguro médico a tu medida
            </h1>
            <p className="mt-3 max-w-xl text-sm md:text-base opacity-90">
              Acceso a consultas, emergencias y hospitalización con respaldo
              24/7. Elige un plan que se adapte a ti y a tu familia.
            </p>

            <button
              onClick={goCotizar}
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition"
              style={{ backgroundColor: BRAND }}
            >
              Cotizar ahora <IconChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex justify-center md:justify-end">
            <img
              src={seguroMedico}
              alt="Seguro médico"
              className="h-44 md:h-56 lg:h-64 object-contain drop-shadow-2xl translate-y-2"
            />
          </div>
        </div>
      </section>

      {/* COBERTURAS */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900">
          Coberturas
        </h2>
        <p className="mt-2 text-center text-gray-500">
          Arma tu plan con estas coberturas base y opciones adicionales.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COBERTURAS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(34,128,62,0.12)" }}
                >
                  <Icon className="h-6 w-6" style={{ color: BRAND }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ¿POR QUÉ ES NECESARIO? */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="rounded-3xl border border-gray-200 bg-gradient-to-r from-cyan-50 to-white p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              ¿Por qué es necesario?
            </h3>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              La salud no puede esperar. Un seguro médico te brinda acceso a
              atención oportuna, controla tus gastos y te respalda ante
              imprevistos como cirugías o emergencias.
            </p>
            <button
              onClick={goCotizar}
              className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: BRAND }}
            >
              Cotizar
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="shrink-0">
            <div className="rounded-2xl bg-white/60 backdrop-blur p-4 border border-cyan-100">
              <IconStethoscope className="h-16 w-16 md:h-20 md:w-20 text-cyan-700" />
            </div>
          </div>
        </div>
      </section>

      {/* REQUISITOS */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h3 className="text-center text-2xl font-bold text-gray-900">
          Requisitos
        </h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              n: "01",
              t: "Solicitud",
              d: "Formulario de asegurado titular y dependientes (si aplica).",
            },
            {
              n: "02",
              t: "Identificación",
              d: "Copia de identidad / pasaporte y datos de contacto.",
            },
            {
              n: "03",
              t: "Declaración de salud",
              d: "Cuestionario médico y, de ser necesario, exámenes.",
            },
            {
              n: "04",
              t: "Periodo de carencia",
              d: "Aplican tiempos de espera según coberturas contratadas.",
            },
          ].map((it) => (
            <div
              key={it.n}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="text-cyan-700 font-extrabold text-xl">
                {it.n}
              </div>
              <h4 className="mt-2 font-semibold text-gray-900">{it.t}</h4>
              <p className="mt-1 text-sm text-gray-600">{it.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GLOSARIO */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h3 className="text-2xl font-bold text-gray-900">Glosario</h3>
        <div className="mt-4 divide-y rounded-2xl border border-gray-200 bg-white">
          {[
            {
              q: "Copago",
              a: "Monto fijo que pagas en cada servicio (consulta, examen, etc.).",
            },
            {
              q: "Deducible",
              a: "Parte del gasto anual que asumes antes de activar la cobertura.",
            },
            {
              q: "Red médica",
              a: "Hospitales, laboratorios y doctores con convenio.",
            },
            {
              q: "Preexistencia",
              a: "Condición de salud diagnosticada antes de contratar la póliza.",
            },
            {
              q: "Carencia",
              a: "Tiempo mínimo desde el inicio de la póliza para usar ciertas coberturas.",
            },
          ].map((item, idx) => (
            <details key={idx} className="group px-5 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-gray-900">
                <span className="font-semibold">{item.q}</span>
                <span className="text-gray-400 group-open:rotate-180 transition">
                  ▾
                </span>
              </summary>
              <p className="pb-3 text-sm text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div
          className="rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ backgroundColor: BRAND }}
        >
          <div>
            <h4 className="text-xl font-bold">¿Necesitas ayuda para elegir?</h4>
            <p className="opacity-90 text-sm">
              Te acompañamos para armar el plan que mejor se adapte a ti.
            </p>
          </div>
          <button
            onClick={goCotizar}
            className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/20 transition"
          >
            Comenzar cotización
          </button>
        </div>
      </section>
    </main>
  );
}
