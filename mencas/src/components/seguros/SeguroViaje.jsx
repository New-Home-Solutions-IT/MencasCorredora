import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconPlane,
  IconLuggage,
  IconCalendarCancel,
  IconClockHour3,
  IconDental,
  IconAmbulance,
  IconStethoscope,
  IconActivity,
  IconShieldCheck,
  IconLifebuoy,
  IconChevronRight,
  IconWorld,
} from "@tabler/icons-react";

import seguroViaje from "../../assets/viajermb.png"; 
const BRAND = "rgb(34,128,62)";

const COBERTURAS = [
  {
    icon: IconStethoscope,
    title: "Asistencia médica",
    desc: "Atención por enfermedad o accidente durante el viaje.",
  },
  {
    icon: IconLuggage,
    title: "Pérdida de equipaje",
    desc: "Indemnización por pérdida o daño del equipaje registrado.",
  },
  {
    icon: IconCalendarCancel,
    title: "Cancelación de viaje",
    desc: "Reembolso de gastos no reembolsables por eventos cubiertos.",
  },
  {
    icon: IconClockHour3,
    title: "Demoras y conexiones",
    desc: "Cobertura por retrasos, conexiones perdidas y gastos extra.",
  },
  {
    icon: IconDental,
    title: "Emergencias odontológicas",
    desc: "Tratamientos de urgencia por dolor o infección.",
  },
  {
    icon: IconAmbulance,
    title: "Repatriación y traslado",
    desc: "Traslado sanitario y repatriación médica o funeraria.",
  },
  {
    icon: IconActivity,
    title: "Deportes y aventura",
    desc: "Opción para actividades recreativas de riesgo moderado.",
  },
  {
    icon: IconShieldCheck,
    title: "Responsabilidad civil",
    desc: "Daños involuntarios a terceros durante el viaje.",
  },
  {
    icon: IconLifebuoy,
    title: "Asistencia 24/7",
    desc: "Central de ayuda multilingüe en cualquier zona horaria.",
  },
];

export default function SeguroViaje() {
  const navigate = useNavigate();
  const goCotizar = () => navigate("/seguros/viaje");

  return (
    <main className="w-full bg-white text-gray-800">
      {/* HERO */}
      <section className="overflow-hidden relative h-[60vh] min-h-[420px] bg-gradient-to-r from-emerald-700 to-emerald-500 text-white flex items-center pt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between p-10">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Seguro de viaje <br className="hidden md:block" />
              viaja tranquilo, nosotros te respaldamos
            </h1>
            <p className="mt-3 max-w-xl text-sm md:text-base opacity-90">
              Asistencia médica, pérdida de equipaje, cancelaciones y más.
              Cotiza en minutos y elige la cobertura ideal para tu destino.
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
              src={seguroViaje}
              alt="Seguro de viaje"
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
              Una emergencia médica, un vuelo retrasado o el extravío de tu
              equipaje pueden arruinar el viaje y tu presupuesto. El seguro de
              viaje te protege con asistencia 24/7, coberturas médicas y apoyo
              ante imprevistos en cualquier parte del mundo.
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
              <IconWorld className="h-16 w-16 md:h-20 md:w-20 text-cyan-700" />
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
              t: "Datos del viajero",
              d: "Nombre completo, fecha de nacimiento y contacto.",
            },
            {
              n: "02",
              t: "Itinerario",
              d: "Fechas de salida y regreso, y país(es) de destino.",
            },
            {
              n: "03",
              t: "Documentos",
              d: "Pasaporte vigente y, si aplica, visado.",
            },
            {
              n: "04",
              t: "Declaraciones",
              d: "Condiciones preexistentes y actividades a realizar.",
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
              q: "Suma asegurada",
              a: "Monto máximo que pagará la aseguradora por un evento cubierto.",
            },
            {
              q: "Deducible",
              a: "Parte del siniestro que corre por tu cuenta antes de aplicar la póliza.",
            },
            {
              q: "Preexistencias",
              a: "Condiciones médicas anteriores al viaje; su cobertura depende del plan.",
            },
            {
              q: "Repatriación",
              a: "Traslado del asegurado a su país de origen por motivos médicos o fallecimiento.",
            },
            {
              q: "Asistencia 24/7",
              a: "Línea de ayuda disponible todo el tiempo, en tu idioma.",
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
            <h4 className="text-xl font-bold">¿Listo para tu próximo destino?</h4>
            <p className="opacity-90 text-sm">
              Te ayudamos a elegir el plan ideal según tu ruta y actividades.
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
