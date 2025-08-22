import seguroAuto from "../assets/auto.png";
import seguroMedico from "../assets/medico.png";
import seguroPropiedad from "../assets/SeguroPropiedadMencas.png";
import seguroVida from "../assets/vida.png";
import seguroViaje from "../assets/viaje.png";
import seguroMencasTeAsiste from "../assets/asistencia.png";

export const services = [
  { title: "Vehículo", description: "Maneja tranquilo sabiendo que tu auto está asegurado.", image: seguroAuto },
  { title: "Médico", description: "Cuida tu salud física y financiera con protección completa.", image: seguroMedico },
  { title: "Propiedad", description: "Protege tu hogar y pertenencias valiosas.", image: seguroPropiedad },
  { title: "Vida", description: "Asegura el futuro de tus seres queridos con tranquilidad.", image: seguroVida },
  { title: "Viaje", description: "Disfruta sin estrés tus viajes, siempre protegido.", image: seguroViaje, badge: "Compra en línea" },
  { title: "Mencas T-Asiste", description: "Asistencia, protección y salud en todo momento.", image: seguroMencasTeAsiste, badge: "Compra en línea" },
];
