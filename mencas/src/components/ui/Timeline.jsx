import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/** Timeline sticky con barra animada al hacer scroll (estilo Aceternity) */
export default function Timeline({ data }) {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-white font-sans" ref={containerRef}>
      <div className="max-w-7xl mx-auto pb-20">
        <div ref={ref} className="relative max-w-7xl mx-auto">
          {data.map((item, index) => (
            <div key={index} className="flex justify-start pt-10 md:pt-40 md:gap-10">
              {/* Columna izquierda (punto + título sticky en desktop) */}
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-[rgb(34,128,62)]/15 border border-[rgb(34,128,62)]" />
                </div>
                <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500">
                  {item.title}
                </h3>
              </div>

              {/* Contenido derecha */}
              <div className="relative pl-20 pr-4 md:pl-4 w-full">
                <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500">
                  {item.title}
                </h3>
                {item.content}
              </div>
            </div>
          ))}

          {/* Barra vertical con progreso animado */}
          <div
            style={{ height: height + "px" }}
            className="absolute left-8 md:left-8 top-0 overflow-hidden w-[2px]
                       bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))]
                       from-transparent via-neutral-200 to-transparent
                       from-[0%] via-[50%] to-[99%]
                       [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]">
            <motion.div
              style={{ height: heightTransform, opacity: opacityTransform }}
              className="absolute inset-x-0 top-0 w-[2px]
                         bg-gradient-to-t from-[rgb(34,128,62)] via-[rgb(34,128,62)]/70 to-transparent
                         rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
