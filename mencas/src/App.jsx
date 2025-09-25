import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Hero from "./components/Hero";
import Alliances from "./components/Alliances";
import Services from "./components/Services";
import About from "./components/About";  
import Contact from "./components/Contact";
import Login from "./components/Login";
import UpdatePassword from "./components/UpdatePassword.jsx";
import SeguroDetalle from "./components/seguros/SeguroDetalle";

import SeguroVehiculo from "./components/seguros/SeguroVehiculo.jsx";
import SeguroMedico from "./components/seguros/SeguroMedico";
import SeguroPropiedad from "./components/seguros/SeguroPropiedad";
import SeguroVida from "./components/seguros/SeguroVida";
import SeguroViaje from "./components/seguros/SeguroViaje";
import SeguroRepatriacion from "./components/seguros/SeguroRepatriacion";

// Admin
import AdminShell from "./components/admin/pages/AdminShell.jsx";
import Dashboard from "./components/admin/pages/Dashboard";
import Cotizaciones from "./components/admin/pages/Cotizaciones";
import Clientes from "./components/admin/pages/Clientes";
import PrivateRoute from "./components/PrivateRoute"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Scroll reset
import ScrollToTop from "./components/ui/ScrollToTop";

function HomePage() {
  return (
    <>
      <Hero />
      <Alliances />
      <Services />
      <Contact />
    </>
  );
}

function PublicLayout() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </main>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop /> {/* ← resetea el scroll en cada cambio de ruta */}
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/seguros/:slug" element={<SeguroDetalle />} />

          {/* Beneficios por seguro */}
          <Route path="/beneficios/vehiculo" element={<SeguroVehiculo />} />
          <Route path="/beneficios/medico" element={<SeguroMedico />} />
          <Route path="/beneficios/propiedad" element={<SeguroPropiedad />} />
          <Route path="/beneficios/vida" element={<SeguroVida />} />
          <Route path="/beneficios/viaje" element={<SeguroViaje />} />
          <Route path="/beneficios/repatriacion" element={<SeguroRepatriacion />} />
        </Route>

        {/* Rutas privadas (admin) */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin/*" element={<AdminShell />}>
            <Route index element={<Dashboard />} />
            <Route path="cotizaciones" element={<Cotizaciones />} />
            <Route path="clientes" element={<Clientes />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="p-10">Página no encontrada</div>} />
      </Routes>
    </>
  );
}
