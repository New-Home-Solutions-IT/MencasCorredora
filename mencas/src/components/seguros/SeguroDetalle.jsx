// src/components/seguros/SeguroDetalle.jsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconArrowLeft, IconPhone, IconMail, IconBrandWhatsapp, IconChevronLeft, IconChevronRight, IconSend } from "@tabler/icons-react";

import seguroAuto from "../../assets/auto.png";
import seguroMedico from "../../assets/medico.png";
import seguroPropiedad from "../../assets/SeguroPropiedadMencas.png";
import seguroVida from "../../assets/vida.png";
import seguroViaje from "../../assets/viaje.png";
import seguroMencasTeAsiste from "../../assets/asistencia.png";

const BRAND = "rgb(34,128,62)";

// ================== Config por seguro ==================
const SEGUROS = {
  vehiculo: {
    title: "Seguro de Bienes",
    heroImage: seguroAuto,
    heroText: "Protegen el patrimonio material contra pérdidas, daños o robos.",
    variants: [
      { title: "Automóvil", subtitle: "Cobertura contra accidentes, robo y daños a terceros.", image: seguroAuto, href: "#" },
      { title: "Incendio", subtitle: "Protección contra daños ocasionados por fuego.", image: seguroAuto, href: "#" },
      { title: "Transporte", subtitle: "Cobertura para mercancías en tránsito.", image: seguroAuto, href: "#" },
      { title: "Responsabilidad Civil", subtitle: "Ampara daños ocasionados a terceros.", image: seguroAuto, href: "#" },
      { title: "Equipo Electrónico", subtitle: "Protege equipos y sistemas electrónicos.", image: seguroAuto, href: "#" },
      { title: "Montaje", subtitle: "Cobertura durante el ensamblaje de maquinaria/estructuras.", image: seguroAuto, href: "#" },
      { title: "Maquinaria Contratista", subtitle: "Ampara equipos de construcción.", image: seguroAuto, href: "#" },
    ],
    // Campos dinámicos del paso 2
    dynamic: {
      selectLabel: "Tipo de bien a asegurar",
      options: [
        { value: "auto", label: "Automóvil" },
        { value: "equipo", label: "Equipo electrónico" },
        { value: "rc", label: "Responsabilidad civil" },
        { value: "incendio", label: "Incendio" },
      ],
      // campos por opción
      fieldsByOption: {
        auto: [
          { key: "marca", label: "Marca", type: "text", required: true },
          { key: "modelo", label: "Modelo", type: "text", required: true },
          { key: "anio", label: "Año", type: "number", min: 1900, max: new Date().getFullYear() },
          { key: "valor", label: "Valor estimado (L)", type: "number", min: 0 },
        ],
        equipo: [
          { key: "descripcion", label: "Descripción del equipo", type: "text", required: true },
          { key: "valor", label: "Valor asegurado (L)", type: "number", min: 0, required: true },
          { key: "ubicacion", label: "Ubicación", type: "text" },
        ],
        rc: [
          { key: "actividad", label: "Actividad/Negocio", type: "text", required: true },
          { key: "limite", label: "Límite deseado (L)", type: "number", min: 0, required: true },
        ],
        incendio: [
          { key: "tipo_inmueble", label: "Tipo de inmueble", type: "text", required: true },
          { key: "area", label: "Área (m²)", type: "number", min: 0 },
          { key: "valor_contenido", label: "Valor contenido (L)", type: "number", min: 0 },
        ],
      },
    },
  },
  medico: {
    title: "Seguro Médico",
    heroImage: seguroMedico,
    heroText: "Tu salud primero: hospitalización, emergencias y consultas.",
    variants: [
      { title: "Ambulatorio", subtitle: "Consultas y exámenes", image: seguroMedico, href: "#" },
      { title: "Hospitalario", subtitle: "Internación y cirugías", image: seguroMedico, href: "#" },
      { title: "Integral", subtitle: "Ambulatorio + hospitalario", image: seguroMedico, href: "#" },
    ],
    dynamic: {
      selectLabel: "Tipo de plan médico",
      options: [
        { value: "ambulatorio", label: "Ambulatorio" },
        { value: "hospitalario", label: "Hospitalario" },
        { value: "integral", label: "Integral" },
      ],
      fieldsByOption: {
        ambulatorio: [
          { key: "edad", label: "Edad", type: "number", min: 0, max: 120, required: true },
          { key: "preexistencias", label: "¿Tiene preexistencias?", type: "select", choices: ["No", "Sí"] },
        ],
        hospitalario: [
          { key: "edad", label: "Edad", type: "number", min: 0, max: 120, required: true },
          { key: "habitacion", label: "Tipo de habitación", type: "select", choices: ["Compartida", "Privada"] },
        ],
        integral: [
          { key: "edad", label: "Edad", type: "number", min: 0, max: 120, required: true },
          { key: "fumador", label: "¿Fumador?", type: "select", choices: ["No", "Sí"] },
        ],
      },
    },
  },
  propiedad: {
    title: "Seguro de Propiedad",
    heroImage: seguroPropiedad,
    heroText: "Protege tu hogar ante incendio, robo y desastres naturales.",
    variants: [
      { title: "Hogar Básico", subtitle: "Estructura", image: seguroPropiedad, href: "#" },
      { title: "Hogar Plus", subtitle: "Estructura + contenido", image: seguroPropiedad, href: "#" },
      { title: "Hogar Premium", subtitle: "Todo riesgo + asistencia", image: seguroPropiedad, href: "#" },
    ],
    dynamic: {
      selectLabel: "Tipo de propiedad",
      options: [
        { value: "casa", label: "Casa" },
        { value: "apartamento", label: "Apartamento" },
        { value: "comercial", label: "Local comercial" },
      ],
      fieldsByOption: {
        casa: [
          { key: "area", label: "Área (m²)", type: "number", min: 0 },
          { key: "ubicacion", label: "Ubicación", type: "text" },
          { key: "valor", label: "Valor de reconstrucción (L)", type: "number", min: 0 },
        ],
        apartamento: [
          { key: "nivel", label: "Nivel/Piso", type: "number", min: 0 },
          { key: "area", label: "Área (m²)", type: "number", min: 0 },
          { key: "contenido", label: "Valor de contenido (L)", type: "number", min: 0 },
        ],
        comercial: [
          { key: "giro", label: "Giro de negocio", type: "text", required: true },
          { key: "valor", label: "Valor asegurado (L)", type: "number", min: 0 },
        ],
      },
    },
  },
  vida: {
    title: "Seguro de Personas",
    heroImage: seguroVida,
    heroText: "Tranquilidad financiera para tu familia cuando más importa.",
    variants: [
      { title: "Vida Individual", subtitle: "Cobertura personalizada en caso de fallecimiento.", image: seguroVida, href: "#" },
      { title: "Vida Colectivo", subtitle: "Protección para grupos, empleados o asociaciones.", image: seguroVida, href: "#" },
      { title: "Médico Hospitalario", subtitle: "Gastos médicos y hospitalización por enfermedad o accidente.", image: seguroVida, href: "#" },
      { title: "Accidentes Personales", subtitle: "Indemnización por lesiones o muerte accidental.", image: seguroVida, href: "#" },
      { title: "Riesgos Profesionales", subtitle: "Cobertura para ocupaciones de alto riesgo.", image: seguroVida, href: "#" },
      { title: "Desgravamen Hipotecario", subtitle: "Liquida saldo del préstamo en caso de fallecimiento.", image: seguroVida, href: "#" },
      { title: "Saldo Deuda", subtitle: "Cancela deudas en caso de muerte o incapacidad.", image: seguroVida, href: "#" },
      { title: "Seguro de Viajero", subtitle: "Asistencia médica y ante imprevistos en viajes.", image: seguroVida, href: "#" },
    ],
    dynamic: {
      selectLabel: "Tipo de cobertura",
      options: [
        { value: "temporal", label: "Vida temporal" },
        { value: "vitalicio", label: "Vida vitalicio" },
        { value: "ahorro", label: "Vida con ahorro" },
      ],
      fieldsByOption: {
        temporal: [
          { key: "edad", label: "Edad", type: "number", min: 18, max: 70, required: true },
          { key: "suma", label: "Suma asegurada (L)", type: "number", min: 0, required: true },
          { key: "fumador", label: "¿Fumador?", type: "select", choices: ["No", "Sí"] },
        ],
        vitalicio: [
          { key: "edad", label: "Edad", type: "number", min: 18, max: 65, required: true },
          { key: "suma", label: "Suma asegurada (L)", type: "number", min: 0, required: true },
        ],
        ahorro: [
          { key: "edad", label: "Edad", type: "number", min: 18, max: 60, required: true },
          { key: "aporte", label: "Aporte mensual (L)", type: "number", min: 0, required: true },
        ],
      },
    },
  },
  viaje: {
    title: "Seguro de Viaje",
    heroImage: seguroViaje,
    heroText: "Viaja con asistencia médica, equipaje y retrasos cubiertos.",
    variants: [
      { title: "Turista", subtitle: "Viajes cortos", image: seguroViaje, href: "#" },
      { title: "Negocios", subtitle: "Frecuentes", image: seguroViaje, href: "#" },
      { title: "Familiar", subtitle: "Multi-persona", image: seguroViaje, href: "#" },
    ],
    dynamic: {
      selectLabel: "Tipo de viaje",
      options: [
        { value: "turista", label: "Turista" },
        { value: "negocios", label: "Negocios" },
        { value: "familiar", label: "Familiar" },
      ],
      fieldsByOption: {
        turista: [
          { key: "destino", label: "Destino", type: "text", required: true },
          { key: "dias", label: "Días de viaje", type: "number", min: 1, required: true },
          { key: "viajeros", label: "N° de viajeros", type: "number", min: 1 },
        ],
        negocios: [
          { key: "destino", label: "Destino", type: "text", required: true },
          { key: "frecuencia", label: "Viajes por año", type: "number", min: 1 },
        ],
        familiar: [
          { key: "destino", label: "Destino", type: "text", required: true },
          { key: "integrantes", label: "Integrantes", type: "number", min: 1, required: true },
        ],
      },
    },
  },
  asistencia: {
    title: "Seguro Asistencia",
    heroImage: seguroMencasTeAsiste,
    heroText: "Ayuda inmediata en carretera y emergencias del hogar.",
    variants: [
      { title: "Carretera", subtitle: "Vehículos", image: seguroMencasTeAsiste, href: "#" },
      { title: "Hogar", subtitle: "Servicios domésticos", image: seguroMencasTeAsiste, href: "#" },
      { title: "Integral", subtitle: "Carretera + hogar", image: seguroMencasTeAsiste, href: "#" },
    ],
    dynamic: {
      selectLabel: "Tipo de asistencia",
      options: [
        { value: "carretera", label: "Carretera" },
        { value: "hogar", label: "Hogar" },
        { value: "integral", label: "Integral" },
      ],
      fieldsByOption: {
        carretera: [
          { key: "vehiculo", label: "Vehículo", type: "text", required: true },
          { key: "placa", label: "Placa", type: "text" },
        ],
        hogar: [
          { key: "domicilio", label: "Dirección del domicilio", type: "text", required: true },
        ],
        integral: [
          { key: "observaciones", label: "Observaciones", type: "text" },
        ],
      },
    },
  },
};

// Util
const channelChips = [
  { key: "whatsapp", label: "WhatsApp", Icon: IconBrandWhatsapp, color: "bg-[#25D366]" },
  { key: "llamada", label: "Llamada", Icon: IconPhone, color: "bg-[#1F2937]" },
  { key: "email", label: "Email", Icon: IconMail, color: "bg-[#2563EB]" },
];

export default function SeguroDetalle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const conf = useMemo(() => SEGUROS[slug], [slug]);

  // ======= State del wizard =======
  const [step, setStep] = useState(1);

  const [personal, setPersonal] = useState({
    nombre: "",
    telefono: "",
    email: "",
    canal: "whatsapp",
  });

  const dyn = conf?.dynamic;
  const [tipo, setTipo] = useState(dyn?.options?.[0]?.value ?? "");
  const [dynFields, setDynFields] = useState({}); // valores de campos dinámicos

  if (!conf) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black">
          <IconArrowLeft className="h-4 w-4" /> Volver
        </button>
        <h1 className="mt-4 text-xl font-semibold">Seguro no encontrado</h1>
      </div>
    );
  }

  // ======= Validaciones rápidas =======
  function validateStep1() {
    if (!personal.nombre.trim()) return "El nombre es obligatorio.";
    if (!/^\+?\d[\d\s\-()]{6,}$/.test(personal.telefono.trim())) return "Teléfono inválido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email.trim())) return "Email inválido.";
    return null;
  }
  function validateStep2() {
    if (!tipo) return "Selecciona un tipo.";
    const fields = dyn?.fieldsByOption?.[tipo] || [];
    for (const f of fields) {
      if (f.required && !String(dynFields[f.key] ?? "").trim()) {
        return `Completa: ${f.label}.`;
      }
      if (f.type === "number") {
        const v = Number(dynFields[f.key]);
        if (Number.isNaN(v)) continue;
        if (f.min != null && v < f.min) return `${f.label}: mínimo ${f.min}.`;
        if (f.max != null && v > f.max) return `${f.label}: máximo ${f.max}.`;
      }
    }
    return null;
  }

  function next() {
    const err = step === 1 ? validateStep1() : step === 2 ? validateStep2() : null;
    if (err) return alert(err);
    setStep((s) => Math.min(3, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  // ======= Render =======
  return (
    <div className="w-full bg-white">
      {/* HERO con overlay */}
      <section
        className="relative h-[48vh] min-h-[360px] w-full overflow-hidden"
        style={{
          backgroundImage: `url(${conf.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto h-full flex items-end p-6 md:p-10">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow">{conf.title}</h1>
            <p className="mt-2 max-w-2xl text-sm md:text-base opacity-90">{conf.heroText}</p>
            <button
              onClick={() => document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-4 inline-flex items-center rounded-md bg-[rgb(34,128,62)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Quiero cotizar
            </button>
          </div>
        </div>
      </section>

      {/* ======= WIZARD con miga de pan ======= */}
      <section id="wizard" className="max-w-6xl mx-auto p-6 md:p-10">
        <Stepper step={step} />

        {/* Paso 1: datos personales */}
        {step === 1 && (
          <div className="text-black mt-6 rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
            <h3 className="mb-4 text-base font-semibold text-neutral-800">Datos de contacto</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field
                label="Nombre *"
                value={personal.nombre}
                onChange={(v) => setPersonal((p) => ({ ...p, nombre: v }))}
                placeholder="Tu nombre completo"
              />
              <Field
                label="Teléfono *"
                value={personal.telefono}
                onChange={(v) => setPersonal((p) => ({ ...p, telefono: v }))}
                placeholder="+504 9xxx-xxxx"
              />
              <Field
                label="Email *"
                value={personal.email}
                onChange={(v) => setPersonal((p) => ({ ...p, email: v }))}
                placeholder="tu@correo.com"
              />
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs text-neutral-500">Canal preferido</p>
              <div className="flex flex-wrap gap-2">
                {channelChips.map(({ key, label, Icon, color }) => {
                  const active = personal.canal === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPersonal((p) => ({ ...p, canal: key }))}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border transition
                        ${active ? "text-white" : "text-neutral-700"}
                        ${active ? color : "bg-white border-neutral-200 hover:bg-neutral-50"}`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={next}
                className="inline-flex items-center rounded-lg bg-[rgb(34,128,62)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Siguiente <IconChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: tipo + campos dinámicos */}
        {step === 2 && (
          <div className="text-black mt-6 rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
            <h3 className="mb-4 text-base font-semibold text-neutral-800">Detalles del seguro</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <SelectField
                label={dyn?.selectLabel || "Tipo"}
                value={tipo}
                onChange={(v) => {
                  setTipo(v);
                  setDynFields({});
                }}
                options={(dyn?.options || []).map((o) => ({ value: o.value, label: o.label }))}
              />

              {/* Render dinámico de campos según opción */}
              {(dyn?.fieldsByOption?.[tipo] || []).map((f) => (
                <DynamicField
                  key={f.key}
                  field={f}
                  value={dynFields[f.key] ?? ""}
                  onChange={(v) => setDynFields((prev) => ({ ...prev, [f.key]: v }))}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-2">
              <button
                onClick={back}
                className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-100"
              >
                <IconChevronLeft className="mr-1 h-4 w-4" />
                Atrás
              </button>
              <button
                onClick={next}
                className="inline-flex items-center rounded-lg bg-[rgb(34,128,62)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Siguiente <IconChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Resultado */}
        {step === 3 && (
          <div className="text-black mt-6 rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
            <h3 className="mb-4 text-base font-semibold text-neutral-800">Resumen</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <ReadOnly label="Nombre" value={personal.nombre} />
              <ReadOnly label="Teléfono" value={personal.telefono} />
              <ReadOnly label="Email" value={personal.email} />
              <ReadOnly label="Canal" value={personal.canal} />
              <ReadOnly label={dyn?.selectLabel || "Tipo"} value={displayOptionLabel(dyn, tipo)} />
              {(dyn?.fieldsByOption?.[tipo] || []).map((f) => (
                <ReadOnly key={f.key} label={f.label} value={String(dynFields[f.key] ?? "—")} />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={back}
                className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-100"
              >
                <IconChevronLeft className="mr-1 h-4 w-4" />
                Atrás
              </button>
              <button
                onClick={() => {
                  // Aquí llamarías tu backend o abrirías WhatsApp/email según canal.
                  alert("¡Enviado! Te contactaremos pronto.");
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[rgb(34,128,62)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                <IconSend className="h-4 w-4" />
                Enviar solicitud
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ======= Apple Cards style (Planes relacionados) ======= */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-neutral-900 text-lg font-semibold mb-4">Planes relacionados</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {conf.variants.map((v, i) => (
              <a
                key={i}
                href={v.href}
                className="group relative h-64 w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${v.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.9)",
                  }}
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/30 transition-colors" />
                <div className="relative z-10 h-full p-4 flex flex-col justify-end text-white">
                  <div className="transform-gpu transition duration-300 group-hover:-translate-y-1">
                    <p className="text-xs opacity-80">{v.subtitle}</p>
                    <h4 className="text-lg font-semibold">{v.title}</h4>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={() => navigate("/contacto")}
              className="inline-flex items-center rounded-md bg-[rgb(34,128,62)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Solicitar información
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================== Subcomponentes ================== */

function Stepper({ step }) {
  // visual estilo "miga de pan" de 1 → 2 → 3
  const items = [
    { n: 1, label: "Seguro" },
    { n: 2, label: "Personal" },
    { n: 3, label: "Resultado" },
  ];
  return (
    <div className="flex items-center justify-center gap-6">
      {items.map((it, idx) => {
        const active = step >= it.n;
        const current = step === it.n;
        return (
          <div key={it.n} className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold
                ${current ? "bg-cyan-700 text-white"
                : active ? "bg-cyan-600 text-white"
                : "bg-cyan-100 text-cyan-700"}`}
            >
              {it.n}
            </span>
            <span className={`text-base font-semibold ${active ? "text-cyan-700" : "text-neutral-500"}`}>{it.label}</span>
            {idx < items.length - 1 && (
              <span className={`mx-2 h-px w-24 ${active && step > it.n ? "bg-cyan-600" : "bg-neutral-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-neutral-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-neutral-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function DynamicField({ field, value, onChange }) {
  if (field.type === "select") {
    return (
      <SelectField
        label={field.label + (field.required ? " *" : "")}
        value={value}
        onChange={onChange}
        options={(field.choices || []).map((c) => ({ value: c, label: c }))}
      />
    );
  }
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-neutral-500">{field.label}{field.required ? " *" : ""}</span>
      <input
        type={field.type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={field.min}
        max={field.max}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
      />
    </label>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-sm font-medium text-neutral-800">{value || "—"}</p>
    </div>
  );
}

function displayOptionLabel(dyn, val) {
  return (dyn?.options || []).find((o) => o.value === val)?.label || val || "—";
}
