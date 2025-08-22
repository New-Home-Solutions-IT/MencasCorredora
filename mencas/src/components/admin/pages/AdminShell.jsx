// src/components/admin/pages/AdminShell.jsx
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarBody } from "../../ui/Sidebar";
import {
  IconLayoutDashboard,
  IconUsersGroup,
  IconFileDollar,
  IconUserCog,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { cn } from "../../../lib/utils";
import logoIcon from "../../../assets/mencasIcono.png";

export default function AdminShell() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) setOpen(false);
  }, [location.pathname]);

  const links = [
    { label: "Dashboard", to: "/admin", icon: IconLayoutDashboard },
    { label: "Cotizaciones", to: "/admin/cotizaciones", icon: IconFileDollar },
    { label: "Clientes", to: "/admin/clientes", icon: IconUsersGroup },
  ];

  return (
    <div className="h-screen w-screen bg-gray-50 text-neutral-900 flex flex-col">
      <div className="flex h-full w-full overflow-hidden bg-white">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-6">
            <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}

              <nav className="mt-6 flex flex-col gap-1">
                {links.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    Icon={item.icon}
                    open={open}
                    onNavigate={() => {
                      if (typeof window !== "undefined" && window.innerWidth < 768) setOpen(false);
                    }}
                  />
                ))}
              </nav>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <button
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                <div className="relative flex items-center gap-3 rounded-xl px-3 py-2 text-left text-neutral-700 transition-colors hover:bg-neutral-100">
                  <IconLogout className="h-5 w-5" />
                  {open && <span className="truncate text-sm font-medium">Cerrar sesión</span>}
                </div>
              </button>
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Área principal */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200 bg-white px-3 py-2 md:px-6">
            <button
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="inline-flex items-center rounded-xl p-2 hover:bg-neutral-100 md:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <span className="hidden md:inline">Portal Administrativo</span>
            </div>
          </div>

          <main className="min-h-0 flex-1 overflow-auto bg-white p-3 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, label, Icon, open, onNavigate }) {
  const isRootAdmin = to === "/admin"; // solo el dashboard exacto
  return (
    <NavLink
      to={to}
      end={isRootAdmin}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group block",
          isActive && "[&_.navbtn]:bg-[rgb(34,128,62)] [&_.navbtn]:text-white"
        )
      }
    >
      <div className="navbtn relative flex items-center gap-3 rounded-xl px-3 py-2 text-neutral-700 transition-colors hover:bg-neutral-100">
        <Icon className="h-5 w-5 shrink-0" />
        {open && <span className="truncate text-sm font-medium">{label}</span>}
        {!open && (
          <span className="pointer-events-none absolute left-full ml-2 hidden rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-md group-hover:block">
            {label}
          </span>
        )}
      </div>
    </NavLink>
  );
}

const Logo = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-semibold text-neutral-900">
    <img src={logoIcon} alt="Logo" className="h-6 w-6 shrink-0 rounded" />
    <span className="whitespace-pre">MENCAS ADMIN</span>
  </a>
);

const LogoIcon = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm text-neutral-900">
    <img src={logoIcon} alt="Logo" className="h-6 w-6 shrink-0 rounded" />
  </a>
);
