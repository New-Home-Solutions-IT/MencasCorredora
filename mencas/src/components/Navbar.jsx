import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "/mencasIcono.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Mencas Logo" className="h-10 w-auto" />
          <span className="font-bold text-lg text-green-700">
            Mencas Corredores
          </span>
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex items-center gap-6 text-gray-800 font-medium">
          <a href="#inicio" className="hover:text-green-700">
            Inicio
          </a>
          <a href="#servicios" className="hover:text-green-700">
            Servicios
          </a>
          <a href="#nosotros" className="hover:text-green-700">
            Nosotros
          </a>
          {/* Botón para cotizame */}
          <a
            href="#cotizame"
            className="bg-[rgb(34,128,62)] hover:bg-[rgb(30,110,55)] text-white px-6 py-2 rounded-md shadow-md transition hover:scale-105"
          >
            Cotízame
          </a>
          <a href="#contact" className="hover:text-green-700">
            Contacto
          </a>
        </nav>

        {/* Hamburguesa */}
        <button className="md:hidden text-gray-800" onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="flex flex-col px-6 py-4 gap-4 text-gray-800 font-medium">
            <a href="#inicio" onClick={toggleMenu}>
              Inicio
            </a>
            <a href="#servicios" onClick={toggleMenu}>
              Servicios
            </a>
            <a href="#nosotros" onClick={toggleMenu}>
              Nosotros
            </a>
            <a href="#contact" onClick={toggleMenu}>
              Contacto
            </a>
            {/* Botón en móvil */}
            <a
              href="#cotizame"
              onClick={toggleMenu}
              className="bg-[rgb(34,128,62)] hover:bg-[rgb(30,110,55)] text-white px-6 py-2 rounded-md shadow-md transition hover:scale-105 text-center"
            >
              Cotízame
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
