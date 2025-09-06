import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si venimos con #ancla: intenta llevar a ese id cuando exista en el DOM
    if (hash) {
      const id = hash.replace("#", "");
      // reintenta un par de veces por si el contenido tarda en montar
      let tries = 0;
      const tick = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (tries < 10) {
          tries += 1;
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
      return;
    }

    // Sin hash: sube al tope
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
