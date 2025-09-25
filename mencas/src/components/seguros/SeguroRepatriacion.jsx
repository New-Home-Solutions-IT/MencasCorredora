import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconPlane,
  IconScale,
  IconFileCertificate,
  IconFlower,
  IconBuildingBank,
  IconId,
  IconClock,
  IconUsersGroup,
  IconChevronRight,
} from "@tabler/icons-react";

import imgHero from "../../assets/asistenciarmb.png";
const BRAND = "rgb(34,128,62)";

const COBERTURAS = [
  {
    icon: IconScale,
    title: "Trámites legales",
    desc: "Gestión documental y coordinación de aduana para la entrega en aeropuerto.",
  },
  {
    icon: IconPlane,
    title: "Traslado internacional",
    desc: "Repatriación aérea desde el país de fallecimiento al de origen.",
  },
  {
    icon: IconFileCertificate,
    title: "Féretro y embalaje especial",
    desc: "Féretro hermético, refuerzo y funda protectora para transporte internacional.",
  },
  {
    icon: IconBuildingBank,
    title: "Coordinación con embajadas",
    desc: "Vínculo con consulados, aerolíneas y autoridades competentes.",
  },
  {
    icon: IconId,
    title: "Custodia y documentación",
    desc: "Revisión de permisos, certificados y documentación requerida.",
  },
  {
    icon: IconClock,
    title: "Atención 24/7 a la familia",
    desc: "Acompañamiento y actualizaciones constantes durante el proceso.",
  },
  {
    icon: IconUsersGroup,
    title: "Asistencia a la familia en origen",
    desc: "Orientación al recibir el cuerpo y coordinación con funerarias locales.",
  },
  {
    icon: IconFlower,
    title: "Opcionales ceremoniales",
    desc: "Arreglos florales y ceremoniales según preferencias.",
  },
];

export default function SeguroRepatriacion() {
  const navigate = useNavigate();
  const goCotizar = () => navigate("/seguros/asistencia");

  return (
    <main className="w-full bg-white text-gray-800">
      {/* HERO */}
      <section className="overflow-hidden relative h-[60vh] min-h-[420px] bg-gradient-to-r from-emerald-700 to-emerald-500 text-white flex items-center pt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between p-10">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Seguro de Repatriación y Asistencia
            </h1>
            <p className="mt-3 max-w-xl text-sm md:text-base opacity-90">
              Cerca de los tuyos, sin importar la distancia. Nos encargamos de
              la gestión completa para la repatriación con apoyo humano 24/7.
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
              src={imgHero}
              alt="Seguro de Repatriación"
              className="h-44 md:h-56 lg:h-64 object-contain drop-shadow-2xl translate-y-2"
            />
          </div>
        </div>
      </section>

      {/* COBERTURAS */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900">
          ¿Qué incluye?
        </h2>
        <p className="mt-2 text-center text-gray-500">
          Acompañamiento integral y coordinación logística en cada etapa.
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
              En momentos sensibles, coordinar trámites internacionales puede
              ser abrumador. Te apoyamos con logística, documentación y
              acompañamiento humano para que la familia se concentre en lo que
              importa.
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
              <IconUsersGroup className="h-16 w-16 md:h-20 md:w-20 text-cyan-700" />
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
              t: "Datos del migrante",
              d: "Nombre completo, país de residencia y documento de identidad.",
            },
            {
              n: "02",
              t: "Contacto en Honduras",
              d: "Nombre y teléfono del familiar responsable en el país.",
            },
            {
              n: "03",
              t: "Documentación",
              d: "Certificados y permisos según el país y aerolínea.",
            },
            {
              n: "04",
              t: "Coordinación logística",
              d: "Autorizaciones para traslado y recepción en aeropuerto.",
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
              q: "Repatriación",
              a: "Traslado del cuerpo al país de origen cumpliendo requisitos sanitarios y legales.",
            },
            {
              q: "Ataúd hermético",
              a: "Contenedor especial que garantiza las condiciones sanitarias del transporte internacional.",
            },
            {
              q: "Cadena de custodia",
              a: "Proceso documentado de entrega y recepción entre autoridades, aerolíneas y funerarias.",
            },
            {
              q: "Permisos consulares",
              a: "Autorizaciones emitidas por embajadas/consulados para permitir el traslado.",
            },
            {
              q: "Acompañamiento familiar",
              a: "Atención y asesoría continua a la familia durante todo el proceso.",
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
            <h4 className="text-xl font-bold">¿Necesitas apoyo ahora?</h4>
            <p className="opacity-90 text-sm">
              Estamos disponibles 24/7 para ayudarte con cada gestión.
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
