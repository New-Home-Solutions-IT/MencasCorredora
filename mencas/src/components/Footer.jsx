// src/components/Footer.jsx
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import logo from "/mencasIcono.png";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-700 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Logo" className="h-10" />
            <span className="text-lg font-semibold text-[rgb(34,128,62)]">
              Mencas Corredores
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Expertos en seguros personales, médicos, de propiedad y asistencia.
            Tu tranquilidad es nuestra prioridad.
          </p>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h3 className="text-md font-semibold mb-2 text-[rgb(34,128,62)]">
            Enlaces
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#inicio" className="hover:underline">
                Inicio
              </a>
            </li>
            <li>
              <a href="#servicios" className="hover:underline">
                Servicios
              </a>
            </li>
            <li>
              <a href="#cotizame" className="hover:underline">
                Cotizame
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:underline">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-md font-semibold mb-2 text-[rgb(34,128,62)]">
            Contáctanos
          </h3>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <Phone size={16} /> +504 3261-4605
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> gerencia@mencasdn.com
            </li>
             <li className="flex items-center gap-2">
              <Mail size={16} /> mencascorredoresdn@gmail.com
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h3 className="text-md font-semibold mb-2 text-[rgb(34,128,62)]">
            Síguenos
          </h3>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61567184361657&mibextid=wwXIfr&rdid=z63nlWJJg5MQuAWW&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1EB2sRaZBy%2F%3Fmibextid%3DwwXIfr#"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebook className="w-6 h-6 hover:text-blue-600 transition" />
            </a>
            <a
              href="https://www.instagram.com/mencascorredores/?igsh=MXVsODkzN3V4N2V1cA%3D%3D#"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram className="w-6 h-6 hover:text-pink-500 transition" />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs mt-10 text-gray-500">
        &copy; {new Date().getFullYear()} Mencas Corredores. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
