import React from "react";
import {
  IconUsers,
  IconFileDollar,
  IconMail,
  IconTrendingUp,
} from "@tabler/icons-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Mensaje de bienvenida */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">¡Bienvenida, Mariel! 👋</h1>
        <p className="mt-2 text-gray-600">
          Este es tu panel administrativo de Mencas. Aquí tienes un resumen rápido de tus métricas y accesos directos a las funciones principales.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Clientes" value="120" icon={<IconUsers className="h-6 w-6 text-[rgb(34,128,62)]" />} />
        <KpiCard title="Cotizaciones activas" value="45" icon={<IconFileDollar className="h-6 w-6 text-[rgb(34,128,62)]" />} />
        <KpiCard title="Cotizaciones sin leer" value="8" icon={<IconMail className="h-6 w-6 text-[rgb(34,128,62)]" />} />
      </div>

      {/* Tabla de cotizaciones recientes */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Cotizaciones recientes</h2>
        <table className="mt-4 w-full text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="pb-2">#</th>
              <th className="pb-2">Cliente</th>
              <th className="pb-2">Fecha</th>
              <th className="pb-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-2">001</td>
              <td>Juan Pérez</td>
              <td>22/08/2025</td>
              <td className="text-[rgb(34,128,62)] font-medium">Aprobada</td>
            </tr>
            <tr className="border-t">
              <td className="py-2">002</td>
              <td>Ana López</td>
              <td>21/08/2025</td>
              <td className="text-yellow-600 font-medium">En revisión</td>
            </tr>
            <tr className="border-t">
              <td className="py-2">003</td>
              <td>Carlos Gómez</td>
              <td>20/08/2025</td>
              <td className="text-red-600 font-medium">Rechazada</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgb(34,128,62,0.1)]">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
