import React, { useEffect, useRef, useState } from "react";

const TABS = [
  { key: "mision",  label: "Misión"  },
  { key: "vision",  label: "Visión"  },
  { key: "historia", label: "Historia" },
];

export default function About() {
  const [active, setActive] = useState("mision");
  const sectionRef = useRef(null);

  // Si llegan con hash (#nosotros o #vision, etc.), selecciona tab y hace scroll suave
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "nosotros") {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const match = TABS.find(t => t.key === hash);
    if (match) setActive(match.key);
  }, []);

  return (
    <section id="nosotros" ref={sectionRef} className="w-full py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Nosotros</h2>
          <p className="mt-2 text-gray-600">
            Conoce nuestra misión, visión e historia.
          </p>
        </header>

        {/* Tabs (desktop) */}
        <div className="hidden md:flex items-center justify-center gap-2 mb-8">
          {TABS.map(tab => {
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={[
                  "px-4 py-2 rounded-full text-sm font-medium transition border",
                  isActive
                    ? "bg-[rgb(34,128,62)] text-white border-[rgb(34,128,62)]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                ].join(" ")}
                aria-pressed={isActive}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Acordeón (mobile) */}
        <div className="md:hidden divide-y rounded-xl border border-gray-200 overflow-hidden mb-8">
          {TABS.map(tab => {
            const isOpen = active === tab.key;
            return (
              <div key={tab.key}>
                <button
                  onClick={() => setActive(isOpen ? "" : tab.key)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-gray-900">{tab.label}</span>
                  <span className="text-gray-500">{isOpen ? "—" : "+"}</span>
                </button>
                <div
                  className={[
                    "px-4 overflow-hidden transition-[max-height] duration-300",
                    isOpen ? "max-h-[400px] pb-4" : "max-h-0"
                  ].join(" ")}
                >
                  {tab.key === "mision"   && <Mission />}
                  {tab.key === "vision"   && <Vision />}
                  {tab.key === "historia" && <History />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contenido (desktop) */}
        <div className="hidden md:block">
          <div className="relative rounded-xl border border-gray-200 p-6 bg-white shadow-sm">
            {/* animación simple */}
            <div className="animate-fade">
              {active === "mision"   && <Mission />}
              {active === "vision"   && <Vision />}
              {active === "historia" && <History />}
            </div>
          </div>
        </div>
      </div>

      {/* Animación util */}
      <style>{`
        .animate-fade { animation: fade .25s ease; }
        @keyframes fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      `}</style>
    </section>
  );
}

function Mission() {
  return (
    <div className="prose prose-zinc max-w-none">
      <h3 className="text-2xl font-bold text-gray-900">Misión</h3>
      <p className="text-gray-700">
        Brindar soluciones integrales de seguros con un servicio humano y ágil,
        protegiendo lo que más valoran nuestros clientes: su salud, su patrimonio y su futuro.
      </p>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Atención 24/7 y soporte cercano.</li>
        <li>Procesos claros y simples.</li>
        <li>Productos flexibles que se adaptan a cada persona.</li>
      </ul>
    </div>
  );
}

function Vision() {
  return (
    <div className="prose prose-zinc max-w-none">
      <h3 className="text-2xl font-bold text-gray-900">Visión</h3>
      <p className="text-gray-700">
        Ser la empresa de seguros más confiable y recomendada por su innovación,
        excelencia en el servicio y resultados que generan tranquilidad.
      </p>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Experiencia digital de clase mundial.</li>
        <li>Alianzas estratégicas que suman valor real.</li>
        <li>Impacto positivo y sostenible en la comunidad.</li>
      </ul>
    </div>
  );
}

function History() {
  return (
    <div className="prose prose-zinc max-w-none">
      <h3 className="text-2xl font-bold text-gray-900">Historia</h3>
      <p className="text-gray-700">
        Nacimos con el propósito de hacer los seguros más simples y cercanos.
        Con el tiempo, ampliamos nuestra oferta y consolidamos un equipo experto
        que acompaña a nuestros clientes en cada etapa.
      </p>
      <p className="text-gray-700">
        Hoy evolucionamos con tecnología, sin perder lo más importante:
        la confianza y el trato humano.
      </p>
    </div>
  );
}
