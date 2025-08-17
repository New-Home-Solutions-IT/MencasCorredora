import SpotlightCard from "./ui/SpotlightCard.jsx";
import seguroAuto from "../assets/auto.png";
import seguroMedico from "../assets/medico.png";
import seguroPropiedad from "../assets/casa.png";
import seguroVida from "../assets/vida.png";
import seguroViaje from "../assets/viaje.png";
import seguroMencasTeAsiste from "../assets/asistencia3.png";
const cards = [
  { title: "Vehículo", description: "Maneja tranquilo sabiendo que tu auto está asegurado.", image: seguroAuto },
  { title: "Médico", description: "Cuida tu salud física y financiera con protección completa.", image: seguroMedico },
  { title: "Propiedad", description: "Protege tu hogar y pertenencias valiosas.", image: seguroPropiedad },
  { title: "Vida", description: "Asegura el futuro de tus seres queridos con tranquilidad.", image: seguroVida },
  { title: "Viaje", description: "Disfruta sin estrés tus viajes, siempre protegido.", image: seguroViaje, badge: "Compra en línea" },
  { title: "Asegurame T-Asiste", description: "Asistencia, protección y salud en todo momento.", image: seguroMencasTeAsiste, badge: "Compra en línea" },
];

export default function Services() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 bg-white">
      <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 text-center">
        Cotiza y compara seguros
      </h2>
      <p className="mt-2 text-center text-slate-500">
        Selecciona una opción de seguro para comparar.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <SpotlightCard
            key={i}
            image={c.image}
            title={c.title}
            description={c.description}
            badge={c.badge}
            onClick={() => console.log("Ver", c.title)}
          />
        ))}
      </div>
    </section>
  );
}