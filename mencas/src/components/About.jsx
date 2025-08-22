"use client";
import React from "react";
import { motion } from "framer-motion";
import aboutHero from "../assets/historiaMencas.png";

const timelineData = [
  {
    title: "1972",
    content: (
      <p className="text-gray-700 text-base md:text-lg">
        Los señores <span className="font-semibold">Wilfredo Mendoza</span> y{" "}
        <span className="font-semibold">Elisa Castillo</span> emprenden un
        negocio de abarrotería en Danlí, Honduras, bajo el nombre{" "}
        <span className="text-green-700 font-semibold">Bodega Mencas</span>.
      </p>
    ),
  },
  {
    title: "1990s",
    content: (
      <p className="text-gray-700 text-base md:text-lg">
        Se expande al área de{" "}
        <span className="font-semibold">asesoría en seguros</span>. Nace{" "}
        <span className="text-green-700 font-semibold">Mencas Corredores</span>,
        conservando el nombre familiar como símbolo de legado.
      </p>
    ),
  },
  {
    title: "Hoy",
    content: (
      <p className="text-gray-700 text-base md:text-lg">
        Más de <span className="font-semibold">30 años</span> en el mercado,
        ofreciendo servicios de seguros e inmobiliarios, evolucionando con
        tecnología y compromiso a nuestros clientes.
      </p>
    ),
  },
];

export default function About() {
  return (
    <section id="nosotros" className="w-full bg-white">
      {/* 🔹 Imagen Aboout */}
      <div
        className="relative w-full h-72 md:h-[35rem] bg-cover bg-center"
        style={{ backgroundImage: `url(${aboutHero})` }}
      >
        <div className="absolute inset-0 bg-green-900/40" />{" "}
        {/* overlay cálido verde */}
        <div className="relative flex items-center justify-center h-full">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-6xl font-bold text-white drop-shadow-lg text-center"
          >
            Nuestra Historia
          </motion.h2>
        </div>
      </div>

      {/* 🔹 Contenido */}
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-12 lg:px-16">
        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center text-gray-700 max-w-3xl mx-auto mb-12 text-lg"
        >
          Desde nuestros inicios en 1972 hemos evolucionado, creciendo con
          nuestros clientes y manteniendo vivo el legado de la familia Mendoza
          Castillo.
        </motion.p>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-600 via-green-400 to-transparent rounded-full" />

          <div className="space-y-16">
            {timelineData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row items-start ${
                  index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                }`}
              >
                {/* Punto */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 bg-green-600 w-6 h-6 rounded-full border-4 border-white shadow-lg" />

                {/* Caja */}
                <div
                  className={`bg-white p-6 rounded-xl shadow-md w-full md:w-5/12 border border-green-100 ${
                    index % 2 === 0 ? "md:ml-12" : "md:mr-12"
                  }`}
                >
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    {item.title}
                  </h3>
                  {item.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="mt-20 grid md:grid-cols-2 gap-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-green-50 p-8 rounded-xl shadow-md border border-green-100"
          >
            <h3 className="text-2xl font-bold text-green-700 mb-4">Misión</h3>
            <p className="text-gray-700 text-justify">
              Desde 1991, en Mencas Corredores nos hemos consolidado como
              una empresa comprometida con el bienestar de nuestros clientes,
              ya sean personas, familias o empresas. Ofrecemos asesoría integral
              en el ámbito de seguros, brindando soluciones personalizadas y
              respaldo en todo momento. En el sector de bienes raíces,
              proporcionamos asesoría especializada y oportunidades de
              inversión rentables, promoviendo una rápida plusvalía y
              contribuyendo al desarrollo económico y social de la Zona Oriental
              del país.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-green-50 p-8 rounded-xl shadow-md border border-green-100"
          >
            <h3 className="text-2xl font-bold text-green-700 mb-4">Visión</h3>
            <p className="text-gray-700 text-justify">
              Ser la opción líder y preferida en asesoría de seguros y bienes
              raíces en la Zona Oriental del país. Con más de 30 años de
              experiencia en el rubro de seguros y en el sector inmobiliario, y con
              el respaldo de la tecnología actual, buscamos trasladar nuestros
              servicios al entorno digital sin perder la calidez y el enfoque
              personalizado que nos caracteriza. Nuestro objetivo es
              proporcionar bienestar y tranquilidad a nuestros clientes de
              manera continua, adaptándonos a sus necesidades en un mundo en
              constante evolución, para llegar a más empresas, familias e
              instituciones, protegiendo lo que más valoran mediante el análisis y
              la gestión profesional de los riesgos que enfrentan, tanto a nivel
              personal como corporativo.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
