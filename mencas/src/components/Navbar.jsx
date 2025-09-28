import { useState, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "/mencasIcono.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  // alinear verticalmente TODOS los items del menú
  const linkBase =
    "inline-flex items-center align-middle h-10 leading-none hover:text-green-700 transition-colors";

  // Scroll suave a un id si existe
  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goToSection = (id) => {
    closeMenu();
    if (location.pathname !== "/") {
      navigate("/");
      requestAnimationFrame(() => setTimeout(() => scrollToId(id), 0));
    } else {
      scrollToId(id);
    }
  };

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <img src={logo} alt="Mencas Logo" className="h-10 w-auto" />
          <span className="font-bold text-lg text-green-700">
            MENCAS CORREDORES
          </span>
        </Link>

        {/* Menú desktop */}
        <nav className="hidden md:flex items-center gap-6 text-gray-800 font-medium">
          <button onClick={() => goToSection("inicio")} className={linkBase}>
            Inicio
          </button>

          <button onClick={() => goToSection("servicios")} className={linkBase}>
            Servicios
          </button>
          <NavLink
            to="/nosotros"
            onClick={closeMenu}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? "text-green-700 font-semibold" : "text-gray-800"
              }`
            }
          >
            Nosotros
          </NavLink>

          <button
             onClick={() =>
                window.open(
                  "https://wa.me/50432614605?text=Hola%20MencasCorredores,%20quiero%20cotizar%20acerca%20de:",
                  "_blank"
                )
              }
            className="inline-flex items-center align-middle h-10 leading-none bg-[rgb(34,128,62)] hover:bg-[rgb(30,110,55)] text-white px-6 rounded-md shadow-md transition hover:scale-105"
          >
            Cotízame
          </button>

          <button onClick={() => goToSection("contact")} className={linkBase}>
            Contacto
          </button>
          <button
            onClick={() =>
              window.open(
                "https://wa.me/50432614605?text=Hola%20MencasCorredores,%20quiero%20informaci%C3%B3n%20acerca%20de%20Bienes%20Ra%C3%ADces",
                "_blank"
              )
            }
            className="inline-flex items-center align-middle h-10 leading-none bg-[rgb(34,128,62)] hover:bg-[rgb(30,110,55)] text-white px-6 rounded-md shadow-md transition hover:scale-105"
          >
            Bienes Raíces
          </button>
        </nav>

        {/* Hamburguesa */}
        <button
          className="md:hidden text-gray-800"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="flex flex-col px-6 py-4 gap-4 text-gray-800 font-medium">
            <button onClick={() => goToSection("inicio")} className={linkBase}>
              Inicio
            </button>
            <button
              onClick={() => goToSection("servicios")}
              className={linkBase}
            >
              Servicios
            </button>

            <NavLink
              to="/nosotros"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive ? "text-green-700 font-semibold" : "text-gray-800"
                }`
              }
            >
              Nosotros
            </NavLink>

            <button onClick={() => goToSection("contact")} className={linkBase}>
              Contacto
            </button>

            <button
                onClick={() =>
                window.open(
                  "https://wa.me/50432614605?text=Hola%20MencasCorredores,%20quiero%20cotizar%20acerca%20de:",
                  "_blank"
                )
              }
              className="inline-flex items-center h-10 bg-[rgb(34,128,62)] hover:bg-[rgb(30,110,55)] text-white px-6 rounded-md shadow-md transition hover:scale-105 justify-center"
            >
              Cotízame
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://wa.me/50432614605?text=Hola%20MencasCorredores,%20quiero%20informaci%C3%B3n%20acerca%20de%20Bienes%20Ra%C3%ADces",
                  "_blank"
                )
              }
              className="inline-flex items-center align-middle h-10 bg-[rgb(34,128,62)] hover:bg-[rgb(30,110,55)] text-white px-6 rounded-md shadow-md transition hover:scale-105 justify-center"
            >
              Bienes Raíces
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
