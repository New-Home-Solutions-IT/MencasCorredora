import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconCar,
  IconShieldCheck,
  IconAlertTriangle,
  IconFlame,
  IconTool,
  IconBandage,
  IconShieldHalf,
  IconSteeringWheel,
  IconLock,
  IconRoad,
  IconLifebuoy,
  IconChevronRight,
} from "@tabler/icons-react";

import seguroAuto from "../../assets/logoheroMencas.png";
const BRAND = "rgb(34,128,62)";

const COBERTURAS = [
  {
    icon: IconShieldCheck,
    title: "Daños a terceros",
    desc: "Responsabilidad civil por daños a personas y bienes de terceros.",
  },
  {
    icon: IconAlertTriangle,
    title: "Colisiones",
    desc: "Cobertura por choque y vuelco, con deducible preferente.",
  },
  {
    icon: IconFlame,
    title: "Incendio y robo",
    desc: "Ampara la pérdida por fuego, robo total y parcial.",
  },
  {
    icon: IconBandage,
    title: "Gastos médicos",
    desc: "Atención a ocupantes del vehículo por accidente.",
  },
  {
    icon: IconTool,
    title: "Asistencia vial",
    desc: "Grúa, cambio de llanta, paso de corriente y cerrajería.",
  },
  {
    icon: IconSteeringWheel,
    title: "Accidentes del conductor",
    desc: "Indemnización por muerte accidental o invalidez.",
  },
  {
    icon: IconShieldHalf,
    title: "Pérdida total",
    desc: "Protección ante siniestros que superen el % pactado.",
  },
  {
    icon: IconLock,
    title: "Accesorios",
    desc: "Cobertura opcional para rines, pantallas y más.",
  },
  {
    icon: IconRoad,
    title: "Daños por carretera",
    desc: "Baches, objetos en vía y eventos imprevistos.",
  },
  {
    icon: IconLifebuoy,
    title: "Extensión de asistencia",
    desc: "Atención 24/7 en todo el país.",
  },
];

export default function SeguroVehiculo() {
  const navigate = useNavigate();

  const goCotizar = () => navigate("/seguros/vehiculo");

  return (
    <main className="w-full bg-white">
      {/* HERO */}
      <section
        className="overflow-hidden relative h-[60vh] min-h-[420px] bg-gradient-to-r from-emerald-700 to-emerald-500 text-white flex items-center pt-20"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between p-10">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Asegura tu vehículo <br className="hidden md:block" />
              y maneja con tranquilidad
            </h1>
            <p className="mt-3 max-w-xl text-sm md:text-base opacity-90">
              Tu seguro protege a tu auto, a sus ocupantes y a terceros.
              Cotiza en minutos con opciones flexibles.
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
              src={seguroAuto}
              alt="Seguro de vehículo"
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
          Elige entre las siguientes coberturas y arma tu plan ideal.
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
              Un choque, un robo o imprevistos en carretera pueden afectar tu
              economía y tu movilidad. Con un seguro adecuado, te proteges de
              gastos inesperados y recibes asistencia inmediata 24/7.
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
              <IconCar className="h-16 w-16 md:h-20 md:w-20 text-cyan-700" />
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
              t: "Llena la solicitud",
              d: "Completa un formulario con los datos del vehículo y del titular.",
            },
            {
              n: "02",
              t: "Documentos personales",
              d: "Copia de identidad o RTN, y datos de contacto actualizados.",
            },
            {
              n: "03",
              t: "Documentos del vehículo",
              d: "Tarjeta de circulación y/o factura. Fotos si se requieren.",
            },
            {
              n: "04",
              t: "Inspección (si aplica)",
              d: "Revisión rápida del vehículo según el plan contratado.",
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

      {/* GLOSARIO (acordeón nativo) */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h3 className="text-2xl font-bold text-gray-900">Glosario</h3>
        <div className="mt-4 divide-y rounded-2xl border border-gray-200 bg-white">
          {[
            {
              q: "Suma asegurada",
              a: "Monto máximo que pagará la aseguradora por un siniestro cubierto.",
            },
            {
              q: "Deducible",
              a: "Porcentaje o monto fijo que asumes en cada siniestro antes de que aplique la póliza.",
            },
            {
              q: "Asistencia vial",
              a: "Servicios como grúa, cerrajería, cambio de llanta o paso de corriente.",
            },
            {
              q: "Pérdida total",
              a: "Cuando el costo de reparación supera el porcentaje acordado del valor del vehículo.",
            },
            {
              q: "Prima",
              a: "Precio del seguro que pagas de forma mensual, trimestral o anual.",
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
              Te guiamos paso a paso para armar la cobertura adecuada.
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
