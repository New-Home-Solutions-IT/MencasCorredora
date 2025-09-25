import React, { useMemo, useState, useEffect } from "react";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconFileTypePdf,
  IconSend,
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
} from "@tabler/icons-react";

const BRAND = "rgb(34,128,62)";
const METODOS = ["whatsapp", "email", "llamada"];
const SERVICIOS = ["Transporte", "Fumigación", "Riego", "Mantenimiento", "Asesoría"];
const MOCK = [
  {
    id: "Q-2025-001",
    cliente: "Pedro López",
    telefono: "+504 9876-1234",
    email: "p.lopez@gmail.hn",
    metodo: "whatsapp",
    servicio: "Seguro de Vida",
    pdfUrl: null,
  },
  {
    id: "Q-2025-002",
    cliente: "Mario Perez",
    telefono: "+504 9988-2211",
    email: "mario@hotmail.hn",
    metodo: "email",
    servicio: "Seguro de Maquinaria",
    pdfUrl: null,
  },
  {
    id: "Q-2025-003",
    cliente: "María García",
    telefono: "+504 9911-4433",
    email: "garica@dgmail.hn",
    metodo: "llamada",
    servicio: "Seguro de Propiedad",
    pdfUrl: null,
  },
  {
    id: "Q-2025-004",
    cliente: "Cooperativa Apaguiz",
    telefono: "+504 3300-1100",
    email: "cooperativa@gmail.hn",
    metodo: "whatsapp",
    servicio: "Seguro Colectivo Personas",
    pdfUrl: null,
  },
  {
    id: "Q-2025-005",
    cliente: "Carlos Martínez",
    telefono: "+504 3200-7788",
    email: "carlos@gmail.hn",
    metodo: "email",
    servicio: "Seguro de Vehiculo",
    pdfUrl: null,
  },
];

// ====== API base y endpoint ======
const API_BASE = (import.meta.env?.VITE_API_URL || "").replace(/\/+$/, ""); // ej: http://127.0.0.1:3000/dev/mencas
const QUOTES_PATH = "/adminQuotes/getPage?limit=200";

export default function Cotizaciones() {
  const [data, setData] = useState(MOCK);
  const [q, setQ] = useState("");
  const [metodo, setMetodo] = useState("todos");
  const [servicio, setServicio] = useState("todos");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // ===== Carga inicial desde API =====
  useEffect(() => {
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchQuotes() {
    if (!API_BASE) {
      console.warn("[Cotizaciones] VITE_API_URL vacío; usando MOCK.");
      return;
    }
    const url = `${API_BASE}${QUOTES_PATH}`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      const text = await res.text();
      const ct = (res.headers.get("content-type") || "").toLowerCase();

      if (!res.ok) {
        console.error(`[Cotizaciones] HTTP ${res.status} ${res.statusText} CT=${ct} Preview=${text.slice(0, 120)}`);
        return; 
      }
      if (!ct.includes("application/json")) {
        console.error(`[Cotizaciones] Esperaba JSON pero CT=${ct} Preview=${text.slice(0, 120)}`);
        return; 
      }

      const json = JSON.parse(text);
      // Estructura: { message, quotes: { items: [...], nextPageToken }, lastEvaluatedKey }
      const items = json?.quotes?.items ?? [];
      const normalized = items.map(mapQuoteToRow).filter(Boolean);

      if (normalized.length) {
        setData(normalized);
        setPage(1);
      } else {
        console.warn("[Cotizaciones] API respondió sin items. Mantengo MOCK.");
      }
    } catch (err) {
      console.error("[Cotizaciones] Error al cargar:", err);
      // Mantiene MOCK para no vaciar UI
    }
  }

  // ====== Mapper: API → shape de tabla (como MOCK) ======
  function mapQuoteToRow(it) {
    if (!it) return null;

    const snap = it.contactSnapshot || {};
    const fullName = (snap.fullName || "").trim();
    const cellphone = (snap.cellphone || "").trim();
    const email = (snap.email || "").trim();
    const metodo = normalizeMethod(snap.preferContact); // "whatsapp" | "email" | "llamada"

    // ID legible a partir de type "QUOTE#<uuid>"
    const rawType = String(it.type || "");
    const id =
      rawType.includes("#")
        ? `Q-${rawType.split("#")[1].slice(0, 8).toUpperCase()}`
        : `Q-${(snap.DNI || "XXXX").slice(-4)}-${(it.searchDate || "").slice(2, 4)}`;

    // Servicio amigable desde serviceData (vehículo / viaje / genérico)
    const servicio = guessServiceLabel(it.serviceData);

    return {
      id,
      cliente: fullName || "—",
      telefono: cellphone || "—",
      email: email || "—",
      metodo,
      servicio: servicio || "—",
      pdfUrl: null, // backend aún no entrega PDF
    };
  }

  function normalizeMethod(m) {
    if (!m) return "whatsapp";
    const s = String(m).toLowerCase();
    if (s.includes("whatsapp")) return "whatsapp";
    if (s.includes("email")) return "email";
    if (s.includes("llamada") || s.includes("phone") || s.includes("call")) return "llamada";
    return "whatsapp";
  }

  function guessServiceLabel(sd) {
    if (!sd || typeof sd !== "object") return "";
    // Viaje
    if ("tripType" in sd || "destinations" in sd) {
      const tt = sd.tripType ? ` (${capitalize(sd.tripType)})` : "";
      return `Seguro de Viaje${tt}`;
    }
    // Vehículo
    if ("vehicleBrand" in sd || "vehicleModel" in sd || "vehicleYear" in sd) {
      return "Seguro de Vehículo";
    }
    // Vida/Personas (heurística por estructura de titular/pareja)
    if ("titular" in sd || "pareja" in sd) {
      return "Seguro de Personas";
    }
    // Fallback: intenta desde searchKey
    return "";
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  // ===== Filtro + búsqueda =====
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.filter((row) => {
      const matchesSearch =
        !term ||
        row.id.toLowerCase().includes(term) ||
        row.cliente.toLowerCase().includes(term) ||
        row.telefono.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term);
      const matchesMetodo = metodo === "todos" || row.metodo === metodo;
      const matchesServicio = servicio === "todos" || row.servicio === servicio;
      return matchesSearch && matchesMetodo && matchesServicio;
    });
  }, [data, q, metodo, servicio]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function resetToFirstPage() {
    setPage(1);
  }

  // Subida de PDF
  function handleUploadPdf(rowId, file) {
    if (!file) return;
    setData((prev) =>
      prev.map((r) =>
        r.id === rowId ? { ...r, pdfFile: file, pdfName: file.name } : r
      )
    );
  }

  // Enviar según método preferido (valida PDF)
  function handleSend(row) {
    if (!row.pdfFile) {
      alert(`La cotización ${row.id} no tiene PDF cargado. Súbelo antes de enviar.`);
      return;
    }
    const mensaje =
      row.metodo === "whatsapp"
        ? `Enviar por WhatsApp a ${row.telefono}`
        : row.metodo === "email"
        ? `Enviar correo a ${row.email}`
        : `Realizar llamada a ${row.telefono}`;
    alert(`Cotización ${row.id}: ${mensaje}\nPDF adjunto: ${row.pdfName || "archivo.pdf"}`);
    // integrar backend para enviar realmente
  }

  return (
    <div className="space-y-4">
      {/* Header con acciones rápidas */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold">Cotizaciones</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchQuotes}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100"
            title="Refrescar desde el servidor"
          >
            Refrescar
          </button>
          {/* <button className="inline-flex items-center gap-2 rounded-lg bg-[rgb(34,128,62)] px-3 py-2 text-sm font-medium text-white hover:opacity-90">
            <IconPlus className="h-4 w-4" />
            Nueva cotización
          </button> */}
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-200 bg-white p-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <label className="mb-1 block text-xs text-neutral-500">Buscar</label>
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                resetToFirstPage();
              }}
              placeholder="Buscar por Cliente, teléfono o email"
              className="w-full rounded-lg border border-neutral-200 pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="mb-1 block text-xs text-neutral-500">Método preferido</label>
          <div className="relative">
            <IconFilter className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
            <select
              value={metodo}
              onChange={(e) => {
                setMetodo(e.target.value);
                resetToFirstPage();
              }}
              className="w-full rounded-lg border border-neutral-200 pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
            >
              <option value="todos">Todos</option>
              {METODOS.map((m) => (
                <option key={m} value={m}>
                  {capitalizar(m)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="mb-1 block text-xs text-neutral-500">Tipo de servicio</label>
          <div className="relative">
            <IconFilter className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
            <select
              value={servicio}
              onChange={(e) => {
                setServicio(e.target.value);
                resetToFirstPage();
              }}
              className="w-full rounded-lg border border-neutral-200 pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
            >
              <option value="todos">Todos</option>
              {SERVICIOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Page size */}
        <div className="md:col-span-1">
          <label className="mb-1 block text-xs text-neutral-500">Mostrar</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              resetToFirstPage();
            }}
            className="w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
          >
            {[5, 8, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              <Th>No. cotización</Th>
              <Th>Cliente</Th>
              <Th>Teléfono</Th>
              <Th>Email</Th>
              <Th>Método preferido</Th>
              <Th>Tipo de servicio</Th>
              <Th className="text-right pr-4">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-neutral-500">
                  No hay resultados con los filtros actuales.
                </td>
              </tr>
            )}

            {pageRows.map((row) => (
              <tr key={row.id} className="border-t">
                <Td>{row.id}</Td>
                <Td className="font-medium">{row.cliente}</Td>
                <Td>{row.telefono}</Td>
                <Td className="truncate">{row.email}</Td>
                <Td><MetodoBadge metodo={row.metodo} /></Td>
                <Td>{row.servicio}</Td>
                <Td className="pr-4">
                  <div className="flex justify-end gap-2">
                    {/* Subir PDF */}
                    <div>
                      <input
                        id={`pdf-${row.id}`}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => handleUploadPdf(row.id, e.target.files?.[0])}
                      />
                      <button
                        onClick={() => document.getElementById(`pdf-${row.id}`)?.click()}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 hover:bg-neutral-100"
                        title={row.pdfFile ? `PDF subido: ${row.pdfName}` : "Subir PDF"}
                      >
                        <IconFileTypePdf className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {row.pdfFile ? "Reemplazar PDF" : "Subir PDF"}
                        </span>
                        {row.pdfFile && <IconCheck className="h-4 w-4 text-[rgb(34,128,62)]" />}
                      </button>
                    </div>

                    {/* Enviar según método preferido */}
                    <button
                      onClick={() => handleSend(row)}
                      className="inline-flex items-center gap-1 rounded-lg bg-[rgb(34,128,62)] px-2 py-1 text-white hover:opacity-90"
                      title="Enviar según método preferido"
                    >
                      <IconSend className="h-4 w-4" />
                      <span className="hidden sm:inline">Enviar</span>
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-neutral-500">
          Mostrando{" "}
          <span className="font-medium">
            {total === 0 ? 0 : start + 1}–{Math.min(start + pageSize, total)}
          </span>{" "}
          de <span className="font-medium">{total}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 text-sm disabled:opacity-50"
          >
            <IconChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <span className="text-sm">
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 text-sm disabled:opacity-50"
          >
            Siguiente
            <IconChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th className={`px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return <td className={`px-3 py-2 align-middle ${className}`}>{children}</td>;
}

function MetodoBadge({ metodo }) {
  if (metodo === "whatsapp")
    return (
      <span className="rounded-full bg-[rgba(37,211,102,0.12)] px-2 py-0.5 text-xs font-medium text-[rgb(34,128,62)]">
        WhatsApp
      </span>
    );
  if (metodo === "email")
    return (
      <span className="rounded-full bg-[rgba(59,130,246,0.12)] px-2 py-0.5 text-xs font-medium text-[rgb(37,99,235)]">
        Email
      </span>
    );
  return (
    <span className="rounded-full bg-[rgba(245,158,11,0.12)] px-2 py-0.5 text-xs font-medium text-[rgb(217,119,6)]">
      Llamada
    </span>
  );
}

function capitalizar(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
