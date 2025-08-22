// src/App.jsx
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// Layout fijo (header/footer)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
// Páginas
import Hero from "./components/Hero";
import Alliances from "./components/Alliances";
import Services from "./components/Services";
import About from "./components/About";  
import Contact from "./components/Contact";
import Login from "./components/Login";
// import SeguroDetalle from "./components/seguros/SeguroDetalle"; 

// Admin
import AdminShell from "./components/admin/pages/AdminShell.jsx";
import Dashboard from "./components/admin/pages/Dashboard";
import Cotizaciones from "./components/admin/pages/Cotizaciones";
import Clientes from "./components/admin/pages/Clientes";
// import Perfil from "./components/admin/pages/Perfil";

// ---- Páginas compuestas ----
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
      <Outlet />         {/* renderiza cada página */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}

export default function App() {
  return (
    // <Routes>
    //   <Route element={<Layout />}>
    //     {/* Home */}
    //     <Route path="/" element={<HomePage />} />
    //     <Route path="/nosotros" element={<About />} />
    //      <Route path="/login" element={<Login />} />
    //     <Route path="/servicios" element={<Services />} />
    //     <Route path="/contacto" element={<Contact />} />

    //          {/* Admin con tabs (su propio header/footer) */}
    //   <Route path="/admin" element={<AdminShell />}>
    //     {/* <Route index element={<Dashboard />} /> */}
    //     {/* <Route path="cotizaciones" element={<Cotizaciones />} />
    //     <Route path="clientes" element={<Clientes />} />
    //     <Route path="usuarios" element={<Usuarios />} />
    //     <Route path="ajustes" element={<Ajustes />} /> */}
    //   </Route>

    //     {/* Fallback 404 */}
    //     <Route path="*" element={<div className="p-10">Página no encontrada</div>} />
    //   </Route>
    // </Routes>
    <Routes>
      {/* Rutas públicas: con header/footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/contacto" element={<Contact />} />
        {/* <Route path="/seguros/:slug" element={<SeguroDetalle />} /> */}
      </Route>

      {/* Rutas del portal admin: SIN header, con su propio footer dentro del AdminShell */}
      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<Dashboard />} />
       <Route path="cotizaciones" element={<Cotizaciones />} />
          <Route path="clientes" element={<Clientes />} />
        {/* <Route path="perfil" element={<Perfil />} /> */}
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="p-10">Página no encontrada</div>} />
    </Routes>
  );
}
