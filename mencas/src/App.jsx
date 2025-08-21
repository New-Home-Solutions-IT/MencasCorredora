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

function Layout() {
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
    <Routes>
      <Route element={<Layout />}>
        {/* Home */}
        <Route path="/" element={<HomePage />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/contacto" element={<Contact />} />

        {/* Fallback 404 */}
        <Route path="*" element={<div className="p-10">Página no encontrada</div>} />
      </Route>
    </Routes>
  );
}
