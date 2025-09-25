import React, { useEffect, useMemo, useState } from "react";
import { IconUsers, IconFileDollar, IconMail } from "@tabler/icons-react";

/* ====== Config ====== */
const API_BASE = (import.meta.env?.VITE_API_URL || "").replace(/\/+$/, "");
const CONTACTS_PATH = "/contacts/getAll";
const QUOTES_PAGE_PATH = "/adminQuotes/getPage";

function getIdToken() {
  return (
    localStorage.getItem("IdToken") ||
    localStorage.getItem("idToken") ||
    localStorage.getItem("auth.idToken") ||
    ""
  );
}

function decodeJwtEmail(idToken) {
  try {
    const base64Url = idToken.split(".")[1];
    if (!base64Url) return "";
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    return payload?.email || payload?.["cognito:username"] || "";
  } catch {
    return "";
  }
}

function fmtDate(s) {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-HN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabelAndClass(status) {
  const s = String(status || "").toUpperCase();
  if (s === "SENT") return { label: "Enviada", className: "text-green-700 bg-green-50" };
  if (s === "PENDING") return { label: "Pendiente", className: "text-yellow-700 bg-yellow-50" };
  if (s === "APPROVED") return { label: "Aprobada", className: "text-emerald-700 bg-emerald-50" };
  if (s === "REJECTED" || s === "FAILED")
    return { label: "Rechazada", className: "text-red-700 bg-red-50" };
  return { label: s || "—", className: "text-gray-700 bg-gray-50" };
}

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState("");

  // Clientes (KPI)
  const [clientsCount, setClientsCount] = useState(0);
  const [loadingClients, setLoadingClients] = useState(false);

  // Cotizaciones (tabla)
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotesTable, setLoadingQuotesTable] = useState(false);

  // Cotizaciones PENDING (KPI global)
  const [pendingTotal, setPendingTotal] = useState(0);
  const [loadingPendingTotal, setLoadingPendingTotal] = useState(false);

  // UI
  const [statusFilter, setStatusFilter] = useState("ALL");

  // email desde token
  useEffect(() => {
    const token = getIdToken();
    const email = decodeJwtEmail(token);
    setUserEmail(email || "Usuario");
  }, []);

  // contar clientes (recorre todas las páginas)
  useEffect(() => {
    const token = getIdToken();
    if (!API_BASE || !token) return;

    let cancelled = false;
    async function fetchClientsCount() {
      setLoadingClients(true);
      let total = 0;
      let lastKey = null;
      const LIMIT = 1000;

      try {
        for (let i = 0; i < 50; i++) {
          const params = new URLSearchParams();
          params.set("limit", String(LIMIT));
          if (lastKey) {
            params.set("lastKey", encodeURIComponent(JSON.stringify(lastKey)));
          }
          const url = `${API_BASE}${CONTACTS_PATH}?${params.toString()}`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          });
          const json = await res.json();
          const items = json?.contacts?.items ?? [];
          total += items.length;
          lastKey = json?.contacts?.lastKey ?? null;
          if (!lastKey) break;
        }
        if (!cancelled) setClientsCount(total);
      } catch {
        if (!cancelled) setClientsCount(0);
      } finally {
        if (!cancelled) setLoadingClients(false);
      }
    }
    fetchClientsCount();
    return () => {
      cancelled = true;
    };
  }, []);

  // traer cotizaciones para la tabla (solo 5 últimas)
  useEffect(() => {
    const token = getIdToken();
    if (!API_BASE || !token) return;

    let cancelled = false;
    async function fetchQuotesTable() {
      setLoadingQuotesTable(true);
      try {
        const params = new URLSearchParams();
        params.set("limit", "5");
        params.set("order", "desc");
        const url = `${API_BASE}${QUOTES_PAGE_PATH}?${params.toString()}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const json = await res.json();
        if (!cancelled) setQuotes(json?.quotes?.items ?? []);
      } catch {
        if (!cancelled) setQuotes([]);
      } finally {
        if (!cancelled) setLoadingQuotesTable(false);
      }
    }
    fetchQuotesTable();
    return () => {
      cancelled = true;
    };
  }, []);

  // contar todas las PENDING para KPI (paginado completo, independiente del limit de la tabla)
  useEffect(() => {
    const token = getIdToken();
    if (!API_BASE || !token) return;

    let cancelled = false;
    async function fetchPendingTotal() {
      setLoadingPendingTotal(true);
      let totalPending = 0;
      let lastKey = null;
      const LIMIT = 1000;

      try {
        for (let i = 0; i < 50; i++) {
          const params = new URLSearchParams();
          params.set("limit", String(LIMIT));
          params.set("order", "desc");
          if (lastKey) {
            params.set("lastKey", encodeURIComponent(JSON.stringify(lastKey)));
          }
          const url = `${API_BASE}${QUOTES_PAGE_PATH}?${params.toString()}`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          });
          const json = await res.json();
          const items = json?.quotes?.items ?? [];

          totalPending += items.filter(
            (q) => String(q?.status).toUpperCase() === "PENDING"
          ).length;

          lastKey = json?.quotes?.nextPageToken ?? null;
          if (!lastKey) break;
        }
        if (!cancelled) setPendingTotal(totalPending);
      } catch {
        if (!cancelled) setPendingTotal(0);
      } finally {
        if (!cancelled) setLoadingPendingTotal(false);
      }
    }
    fetchPendingTotal();
    return () => {
      cancelled = true;
    };
  }, []);

  const clientesLabel = useMemo(() => {
    if (loadingClients) return "Cargando…";
    return clientsCount.toLocaleString("es-HN");
  }, [loadingClients, clientsCount]);

  const filteredQuotes = useMemo(() => {
    const arr = [...quotes];
    arr.sort(
      (a, b) =>
        new Date(b?.sentAt || b?.updatedAt || b?.searchDate) -
        new Date(a?.sentAt || a?.updatedAt || a?.searchDate)
    );
    if (statusFilter === "ALL") return arr;
    return arr.filter((q) => String(q?.status).toUpperCase() === statusFilter);
  }, [quotes, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Mensaje de bienvenida */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">¡Bienvenido (a), {userEmail}! 👋</h1>
        <p className="mt-2 text-gray-600">
          Este es tu panel administrativo de Mencas. Aquí tienes un resumen rápido de tus métricas.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Clientes"
          value={clientesLabel}
          icon={<IconUsers className="h-6 w-6 text-[rgb(34,128,62)]" />}
        />
        <KpiCard
          title="Cotizaciones activas"
          value={loadingPendingTotal ? "…" : pendingTotal.toLocaleString("es-HN")}
          icon={<IconFileDollar className="h-6 w-6 text-[rgb(34,128,62)]" />}
        />
        {/* <KpiCard
          title="Cotizaciones sin leer"
          value="8"
          icon={<IconMail className="h-6 w-6 text-[rgb(34,128,62)]" />}
        /> */}
      </div>

      {/* Tabla de cotizaciones recientes */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Cotizaciones recientes</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="ALL">Todos</option>
            <option value="SENT">Enviadas</option>
            <option value="PENDING">Pendientes</option>
            <option value="APPROVED">Aprobadas</option>
            <option value="REJECTED">Rechazadas</option>
          </select>
        </div>

        <table className="mt-4 w-full text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="pb-2">#</th>
              <th className="pb-2">Cliente</th>
              <th className="pb-2">Servicio</th>
              <th className="pb-2">Fecha</th>
              <th className="pb-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loadingQuotesTable ? (
              <tr>
                <td colSpan={5} className="py-6 text-center">Cargando…</td>
              </tr>
            ) : filteredQuotes.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">Sin resultados</td>
              </tr>
            ) : (
              filteredQuotes.map((q, i) => {
                const { label, className } = statusLabelAndClass(q?.status);
                const service =
                  q?.serviceType === "AUTO"
                    ? `${q?.serviceData?.vehicleBrand || ""} ${q?.serviceData?.vehicleModel || ""} ${q?.serviceData?.vehicleYear || ""}`.trim()
                    : q?.serviceType || "—";
                const when = fmtDate(q?.sentAt || q?.updatedAt || q?.searchDate);
                return (
                  <tr key={q?.type || i} className="border-t">
                    <td className="py-2">{i + 1}</td>
                    <td>{q?.contactSnapshot?.fullName || "—"}</td>
                    <td>{service || "—"}</td>
                    <td>{when}</td>
                    <td>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
                        {label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgba(34,128,62,0.1)]">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
