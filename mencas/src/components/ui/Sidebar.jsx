"use client";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const BRAND_GREEN = "rgb(34,128,62)";

// sidebar está abierto desde cualquier subcomponente
const SidebarCtx = React.createContext({ open: true });

export function Sidebar({ open, setOpen, children }) {
  return (
    <div
      className={cn(
        "relative z-40 flex",
        "h-full w-auto flex-col border-r border-neutral-200 bg-white",
        open ? "w-64" : "w-[70px]"
      )}
    >
      {/* Botón de colapsar/expandir (visible en desktop y móvil) */}
      <button
        type="button"
        aria-label={open ? "Colapsar menú" : "Expandir menú"}
        onClick={() => setOpen?.(!open)}
        className={cn(
          "absolute -right-3 top-4 z-50 rounded-full border border-neutral-200 bg-white p-1 shadow-sm hover:bg-neutral-50",
          "focus:outline-none"
        )}
      >
        {/* Flecha simple hecha con CSS */}
        <span
          className={cn(
            "block h-4 w-4 transition-transform",
            open ? "rotate-180" : "rotate-0"
          )}
          style={{
            clipPath: "polygon(30% 0, 100% 50%, 30% 100%, 0 100%, 70% 50%, 0 0)",
            background: BRAND_GREEN,
          }}
        />
      </button>

      <AnimatePresence initial={false}>
        <motion.div
          key={open ? "open" : "closed"}
          initial={{ width: open ? 70 : 256 }}
          animate={{ width: open ? 256 : 70 }}
          exit={{ width: open ? 256 : 70 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="relative flex h-full flex-col overflow-hidden"
        >
          <SidebarCtx.Provider value={{ open }}>
            {children}
          </SidebarCtx.Provider>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function SidebarBody({ children, className }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col px-2 py-4 text-sm text-neutral-700",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * SidebarLink:
 * - Activo: verde (bg + texto blanco)
 * - Hover (no activo): gris suave
 * - Colapsado: muestra tooltip con el label al hover
 * link: { label, href, icon }  // icon debe ser un elemento React (<Icon .../>)
 */
export function SidebarLink({ link }) {
  const { label, href, icon } = link;
  const { open } = React.useContext(SidebarCtx);

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-[rgb(34,128,62)] text-white"
            : "text-neutral-700 hover:bg-neutral-100"
        )
      }
    >
      {React.isValidElement(icon) ? icon : null}

      {/* Cuando está abierto, mostramos el label normal */}
      {open && <span className="truncate">{label}</span>}

      {/* Tooltip cuando está colapsado */}
      {!open && (
        <span
          className={cn(
            "pointer-events-none absolute left-full top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-md",
            "bg-neutral-900 px-2 py-1 text-xs text-white shadow-md",
            "ml-2 group-hover:block"
          )}
        >
          {label}
        </span>
      )}
    </NavLink>
  );
}
