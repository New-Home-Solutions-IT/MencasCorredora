import { Phone, Mail } from "lucide-react";
import { useLocation, useNavigate, Link, NavLink } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useCallback } from "react";
import logo from "/mencasIcono.png";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goToSection = async (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      requestAnimationFrame(() => setTimeout(() => scrollToId(id), 0));
    } else {
      scrollToId(id);
    }
  };

  return (
    <footer className="bg-gray-200 text-gray-700 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Logo" className="h-10" />
            <span className="text-lg font-semibold text-[rgb(34,128,62)]">
              MENCAS CORREDORES
            </span>
          </Link>
          <p className="text-sm text-gray-600">
            Expertos en seguros personales, médicos, de propiedad y asistencia.
            Tu tranquilidad en nuestros servicios.
          </p>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h3 className="text-md font-semibold mb-2 text-[rgb(34,128,62)]">
            Enlaces
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              <button onClick={() => goToSection("inicio")} className="hover:underline">
                Inicio
              </button>
            </li>
            <li>
              <button onClick={() => goToSection("servicios")} className="hover:underline">
                Servicios
              </button>
            </li>
            <li>
              <button onClick={() => goToSection("servicios")} className="hover:underline">
                Cotízame
              </button>
            </li>
            <li>
              <NavLink to="/nosotros" className="hover:underline">
                Nosotros
              </NavLink>
            </li>
            <li>
              <button onClick={() => goToSection("contact")} className="hover:underline">
                Contacto
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2 text-[rgb(34,128,62)]">
            Contáctanos
          </h3>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <Phone size={16} />
              <a href="tel:32614605" className="hover:underline">+504 3261-4605</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} />
              <a href="mailto:gerencia@mencasdn.com" className="hover:underline">gerencia@mencasdn.com</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} />
              <a href="mailto:mencascorredoresdn@gmail.com" className="hover:underline">mencascorredoresdn@gmail.com</a>
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
              href="https://www.facebook.com/profile.php?id=61567184361657"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook className="w-6 h-6 hover:text-blue-600 transition" />
            </a>
            <a
              href="https://www.instagram.com/mencascorredores/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="w-6 h-6 hover:text-pink-500 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Sección inferior con "Desarrollado por" */}
      <div className="mt-10 border-t border-gray-300 pt-4">
        <div className="max-w-7xl mx-auto px-1 text-center text-xs text-gray-600 space-y-1">
          <div>&copy; {new Date().getFullYear()} Mencas Corredores. Todos los derechos reservados.</div>
          <div>
            Desarrollado por{" "}
            <a
              href="https://newhomesolutionshn.com/"
              target="_blank"
              rel="noopener noreferrer author"
              className="font-medium text-[rgb(34,128,62)] hover:underline"
            >
              newHomeSolutions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
