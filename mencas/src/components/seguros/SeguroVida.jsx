import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconHeart,
  IconShieldCheck,
  IconUsersGroup,
  IconLifebuoy,
  IconStethoscope,
  IconChevronRight,
  IconUser,
  IconAmbulance,
  IconActivity,
  IconHomeDollar,
  IconCreditCard,
  IconPlane,
} from "@tabler/icons-react";

import heroVida from "../../assets/vidarmb.png";
import vidaPng from "../../assets/logoheroMencas.png";
const BRAND = "rgb(34,128,62)";

const BENEFICIOS = [
  {
    icon: IconShieldCheck,
    title: "Protección económica",
    desc: "Suma asegurada para respaldar a tu familia ante fallecimiento.",
  },
  {
    icon: IconUsersGroup,
    title: "Amparo a beneficiarios",
    desc: "Flexibilidad para designar y actualizar beneficiarios.",
  },
  {
    icon: IconLifebuoy,
    title: "Adelanto por diagnóstico",
    desc: "Anticipo por enfermedades graves según condiciones.",
  },
  {
    icon: IconStethoscope,
    title: "Asistencia y checkups",
    desc: "Accesos preferentes a servicios médicos preventivos.",
  },
  {
    icon: IconHeart,
    title: "Coberturas adicionales",
    desc: "Invalidez, muerte accidental y doble indemnización.",
  },
];
const COBERTURAS = [
  {
    icon: IconUser,
    title: "Vida Individual ",
    desc: "Cobertura personalizada en caso de fallecimiento",
  },
  {
    icon: IconUsersGroup,
    title: "Vida Colectivo",
    desc: "Protección para grupos, empleados o asociaciones.",
  },
  {
    icon: IconStethoscope,
    title: "Médico Hospitalario",
    desc: "Gastos médicos y hospitalización por enfermedad o accidente.",
  },
  {
    icon: IconAmbulance,
    title: "Accidentes Personales",
    desc: "Indemnización por lesiones o muerte accidental.",
  },
  {
    icon: IconActivity,
    title: "Riesgos Profesionales",
    desc: "Cobertura para ocupaciones de alto riesgo.",
  },
  {
    icon: IconHomeDollar,
    title: "Desgravamen Hipotecario ",
    desc: "Liquida el saldo de un préstamo hipotecario en caso de fallecimiento.",
  },
  {
    icon: IconCreditCard,
    title: "Saldo Deuda",
    desc: "Cancela deudas pendientes en caso de muerte o incapacidad.",
  },
  {
    icon: IconPlane,
    title: "Seguro de Viajero",
    desc: "Asistencia médica y cobertura ante imprevistos durante viajes nacionales o internacionales.",
  },
];
export default function SeguroVida() {
  const navigate = useNavigate();
  const goCotizar = () => navigate("/seguros/vida");

  return (
    <main className="w-full bg-white text-gray-800">
      {/* HERO */}
      <section className="overflow-hidden relative h-[60vh] min-h-[420px] bg-gradient-to-r from-emerald-700 to-emerald-500 text-white flex items-center pt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between p-10">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Protege a quienes más amas
              <br className="hidden md:block" />
              con un Seguro de Vida
            </h1>
            <p className="mt-3 max-w-xl text-sm md:text-base opacity-90">
              Diseñado para brindar estabilidad financiera a tus seres queridos
              ante cualquier imprevisto. Elige la cobertura y la suma asegurada
              que mejor se adapte a tus objetivos.
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
              src={heroVida}
              alt="Seguro de vida"
              className="h-44 md:h-56 lg:h-64 object-contain drop-shadow-2xl translate-y-2"
            />
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900">
          Beneficios y coberturas
        </h2>
        <p className="mt-2 text-center text-gray-500">
          Arma tu plan de protección con las opciones que más valor te brindan.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFICIOS.map(({ icon: Icon, title, desc }) => (
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
      {/* SEGUROS Y SERVICIOS QUE SE OFRECEN */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900">
          Seguros y servicios que se ofrecen
        </h2>
        <p className="mt-2 text-center text-gray-500">
          Elije el que más te guste y se adapte a tus necesidades.
        </p>

        {/* layout con imagen */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Imagen */}
          <div className="order-first lg:order-none lg:col-span-5">
            <div className="relative rounded-3xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
              <img
                src={vidaPng}
                alt="Seguro de vida"
                className="w-full h-[340px] md:h-[420px] object-contain drop-shadow"
              />
              <div
                className="pointer-events-none absolute -z-10 inset-0 rounded-3xl blur-2xl opacity-40"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, rgba(34,128,62,.15), transparent 60%)",
                }}
              />
            </div>
          </div>

          {/* Lista de coberturas */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {COBERTURAS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow"
                    style={{ backgroundColor: "rgb(34,128,62)" }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ¿POR QUÉ CONTRATARLO? */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="rounded-3xl border border-gray-200 bg-gradient-to-r from-cyan-50 to-white p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              ¿Por qué contratarlo?
            </h3>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              Un seguro de vida asegura el futuro de tu familia. Cubre deudas,
              educación, gastos del hogar y otros compromisos en caso de
              fallecimiento o invalidez según las coberturas seleccionadas.
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
              <IconHeart className="h-16 w-16 md:h-20 md:w-20 text-cyan-700" />
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
              d: "Completa el formulario con tus datos personales y beneficiarios.",
            },
            {
              n: "02",
              t: "Identificación",
              d: "Copia de identidad o RTN y datos de contacto vigentes.",
            },
            {
              n: "03",
              t: "Evaluación",
              d: "Cuestionario de salud y, si aplica, exámenes médicos.",
            },
            {
              n: "04",
              t: "Emisión",
              d: "Aprobación de la compañía y pago de tu primera prima.",
            },
          ].map((it) => (
            <div
              key={it.n}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="text-cyan-700 font-extrabold text-xl">{it.n}</div>
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
              a: "Monto máximo que pagará la aseguradora conforme a la póliza.",
            },
            {
              q: "Beneficiarios",
              a: "Personas que recibirán la indemnización según tu designación.",
            },
            {
              q: "Prima",
              a: "Precio del seguro, que puedes pagar de forma mensual o anual.",
            },
            {
              q: "Periodo de carencia",
              a: "Tiempo mínimo desde el inicio de la póliza para usar ciertas coberturas.",
            },
            {
              q: "Exclusiones",
              a: "Situaciones no cubiertas, detalladas en las condiciones de la póliza.",
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
            <h4 className="text-xl font-bold">
              ¿Listo para proteger tu futuro?
            </h4>
            <p className="opacity-90 text-sm">
              Te ayudamos a elegir el plan ideal según tus metas y presupuesto.
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
