import React, { useMemo, useState, useEffect } from "react";
import {
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
const SERVICIOS = [
  "Seguro de Vida",
  "Seguro Médico",
  "Seguro de Vehículo",
  "Seguro de Propiedad",
  "Seguro de Viaje",
  "Repatriación y Asistencia",
  "Otro",
];

// ====== API base y endpoints ======
const API_BASE = (import.meta.env?.VITE_API_URL || "").replace(/\/+$/, "");
const QUOTES_PAGE_PATH = "/adminQuotes/getPage?limit=200";
const QUOTE_BY_ID_PATH = "/adminQuotes/getById"; // GET ?type=...&contactDni=...
const S3_SIGNED_URL_PATH = "/s3_uploads/getSignedUrl"; 

// Token helper
function getAuthHeaders(extra = {}) {
  //token desde localStorage o env
  const token =
    (typeof window !== "undefined" && localStorage.getItem("token")) ||
    import.meta.env?.VITE_API_TOKEN ||
    "";
  const headers = {
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    ...extra,
  };
  return headers;
}

export default function Cotizaciones() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [metodo, setMetodo] = useState("todos");
  const [servicio, setServicio] = useState("todos");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchQuotes() {
    if (!API_BASE) {
      console.warn("[Cotizaciones] VITE_API_URL vacío.");
      setData([]);
      setPage(1);
      return;
    }
    const url = `${API_BASE}${QUOTES_PAGE_PATH}`;
    try {
      setLoading(true);
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const text = await res.text();
      const ct = (res.headers.get("content-type") || "").toLowerCase();

      if (!res.ok || !ct.includes("application/json")) {
        console.error(
          `[Cotizaciones] Respuesta inválida: ${res.status} CT=${ct} Preview=${text.slice(
            0,
            120
          )}`
        );
        setData([]);
        setPage(1);
        return;
      }

      const json = JSON.parse(text);
      const items = json?.quotes?.items ?? [];
      const normalized = items.map(mapQuoteToRow).filter(Boolean);

      setData(normalized);
      setPage(1);
    } catch (err) {
      console.error("[Cotizaciones] Error al cargar:", err);
      setData([]);
      setPage(1);
    } finally {
      setLoading(false);
    }
  }

  // ====== API → fila de tabla ======
  function mapQuoteToRow(it) {
    if (!it) return null;

    const snap = it.contactSnapshot || {};
    const dni = (snap.DNI || "").trim();
    const fullName = (snap.fullName || "").trim();
    const cellphone = (snap.cellphone || "").trim();
    const email = (snap.email || "").trim();
    const metodo = normalizeMethod(snap.preferContact);

    const rawType = String(it.type || ""); // ej. "QUOTE#e2d9b1..."
    const typeKey = rawType.startsWith("QUOTE#") ? rawType.slice(6) : rawType; // sin "QUOTE#"

    // Servicio
    const servicio =
      serviceLabelFromAPI(it) || guessServiceLabel(it.serviceData || it.details) || "—";
    // Estado
    const apiStatus = (it.status || "").toString().trim().toUpperCase();
    const hasPdf = Boolean(it.pdfUrl);
    let status =
      apiStatus === "SENT"
        ? "SENT"
        : hasPdf || apiStatus === "READY"
        ? "READY"
        : "PENDING";

    // ID legible
    const id = rawType.includes("#")
      ? `Q-${rawType.split("#")[1].slice(0, 8).toUpperCase()}`
      : undefined;

    return {
      id,
      typeKey, // adminQuotes/getById
      dni,     // adminQuotes/getById y para folderPath
      cliente: fullName || "—",
      telefono: cellphone || "—",
      email: email || "—",
      metodo,
      servicio,
      status, // "PENDING" | "READY" | "SENT"
      pdfUrl: it.pdfUrl || null,
      pdfFile: null,
      pdfName: null,
    };
  }

  function normalizeMethod(m) {
    if (!m) return "whatsapp";
    const s = String(m).toLowerCase();
    if (s.includes("whatsapp")) return "whatsapp";
    if (s.includes("email")) return "email";
    if (s.includes("llamada") || s.includes("phone") || s.includes("call"))
      return "llamada";
    return "whatsapp";
  }

  function serviceLabelFromAPI(it) {
    const raw = (it?.serviceType || it?.service || "").toString().trim().toUpperCase();
    const map = {
      LIFE: "Seguro de Vida",
      MEDICAL: "Seguro Médico",
      AUTO: "Seguro de Vehículo",
      PROPERTY: "Seguro de Propiedad",
      TRAVEL: "Seguro de Viaje",
      ASSIST: "Repatriación y Asistencia",
      OTHER: "Otro",
      "SEGURO DE VIDA": "Seguro de Vida",
      "SEGURO MÉDICO": "Seguro Médico",
      "SEGURO DE VEHÍCULO": "Seguro de Vehículo",
      "SEGURO DE PROPIEDAD": "Seguro de Propiedad",
      "SEGURO DE VIAJE": "Seguro de Viaje",
      "REPATRIACIÓN Y ASISTENCIA": "Repatriación y Asistencia",
    };
    return map[raw] || "";
  }

  function guessServiceLabel(sd) {
    if (!sd || typeof sd !== "object") return "";
    if ("tripType" in sd || "destinations" in sd) {
      return `Seguro de Viaje${sd.tripType ? ` (${capitalize(sd.tripType)})` : ""}`;
    }
    if ("vehicleBrand" in sd || "vehicleModel" in sd || "vehicleYear" in sd) {
      return "Seguro de Vehículo";
    }
    if ("titular" in sd || "pareja" in sd || "sumAssured" in sd) {
      return "Seguro de Vida";
    }
    if ("propertyType" in sd || "propertyValue" in sd) {
      return "Seguro de Propiedad";
    }
    if ("migrant" in sd) {
      return "Repatriación y Asistencia";
    }
    return "Otro";
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
        (row.id || "").toLowerCase().includes(term) ||
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
  const isFiltered =
    q.trim().length > 0 || metodo !== "todos" || servicio !== "todos";

  function resetToFirstPage() {
    setPage(1);
  }

  // ===== Subida de PDF con Signed URL =====
function cleanFileName(name = "") {
  const base = name.normalize("NFKD").replace(/[^\w.\- ]+/g, "");
  return base.replace(/\s+/g, "_").slice(0, 180) || `archivo_${Date.now()}.pdf`;
}

// ===== Subida de PDF con Signed URL (usamos ID en folderPath(nombre)) =====
async function handleUploadPdf(row, file) {
  if (!file) return;

  const typeKey = row?.typeKey || ""; // <- type sin "QUOTE#"
  const dni = row?.dni || "";       // <- DNI del contacto para el path
  if (!API_BASE) {
    alert("No hay API_BASE configurado.");
    return;
  }
  if (!typeKey) {
    alert("No se encontró el typeKey (type sin QUOTE#) para el folderPath.");
    return;
  }

  try {
    const token =
      (typeof window !== "undefined" && localStorage.getItem("token")) ||
      import.meta.env?.VITE_API_TOKEN ||
      "";

    const folderPath = `uploads/quote/${dni}`;
    const cleanName = cleanFileName(file.name);

    // 1) Pide URL firmada
    const signedRes = await fetch(`${API_BASE}${S3_SIGNED_URL_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        fileName: cleanName,
        folderPath,
        fileType: "pdf",
      }),
    });
    console.log("[getSignedUrl] status:", signedRes.status, signedRes.statusText);
    console.log("[signedRes] ", signedRes);

    const signedTxt = await signedRes.text();
    if (!signedRes.ok) {
      console.error(
        `[getSignedUrl] ${signedRes.status} ${signedRes.statusText} :: ${signedTxt.slice(0, 200)}`
      );
      alert("No se pudo obtener URL firmada.");
      return;
    }
    const signedJson = signedTxt ? JSON.parse(signedTxt) : {};
    const uploadURL = signedJson?.body?.uploadURL;
    const fileURL   = signedJson?.body?.fileURL;
    if (!uploadURL || !fileURL) {
      console.error("Respuesta inválida de getSignedUrl:", signedJson);
      alert("Respuesta inválida al solicitar URL firmada.");
      return;
    }

    // Sube al bucket 
    const putRes = await fetch(uploadURL, {
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      body: file,
    });
    if (!putRes.ok) {
      const t = await putRes.text().catch(() => "");
      throw new Error(`PUT a S3 falló (${putRes.status}): ${t.slice(0, 180)}`);
    }

    // 3) Actualiza UI
    setData(prev =>
      prev.map(r =>
        r.typeKey === row.typeKey
          ? {
              ...r,
              pdfFile: file,
              pdfName: cleanName,
              pdfUrl: fileURL,            
              status: r.status === "SENT" ? "SENT" : "READY",
            }
          : r
      )
    );
  } catch (e) {
    console.error("[Upload PDF] ", e);
    alert(`Falló la subida de PDF: ${e.message}`);
  }
}

  // ===== Enviar cotización =====
  async function handleSend(row) {
    if (!row.pdfFile && !row.pdfUrl) {
      alert(`La cotización ${row.id || ""} no tiene PDF cargado. Súbelo antes de enviar.`);
      return;
    }
    if (!API_BASE) {
      alert("No hay API_BASE configurado.");
      return;
    }
    if (!row.typeKey || !row.dni) {
      alert("Faltan datos para enviar (type o DNI).");
      return;
    }

    const url = new URL(`${API_BASE}${QUOTE_BY_ID_PATH}`, window.location.origin);
    // Parámetros
    const finalUrl = `${API_BASE}${QUOTE_BY_ID_PATH}?type=${encodeURIComponent(
      row.typeKey
    )}&contactDni=${encodeURIComponent(row.dni)}`;

    try {
      const res = await fetch(finalUrl, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(
          `GET getById falló (${res.status}): ${text.slice(0, 180)}`
        );
      }
      setData((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status: "SENT" } : r))
      );
      alert("Cotización enviada correctamente.");
    } catch (e) {
      console.error("[Enviar] ", e);
      alert(`No se pudo enviar la cotización: ${e.message}`);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold">Cotizaciones</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchQuotes}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100"
            title="Refrescar desde el servidor"
          >
            {loading ? "Cargando..." : "Refrescar"}
          </button>
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
              placeholder="Buscar por cliente, teléfono, email o ID"
              className="w-full rounded-lg border border-neutral-200 pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="mb-1 block text-xs text-neutral-500">
            Método preferido
          </label>
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
          <label className="mb-1 block text-xs text-neutral-500">
            Tipo de servicio
          </label>
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
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              {/* <Th>No. cotización</Th> */}
              <Th>Cliente</Th>
              <Th>Teléfono</Th>
              <Th>Email</Th>
              <Th>Método preferido</Th>
              <Th>Tipo de servicio</Th>
              <Th>Estado</Th>
              <Th className="text-right pr-4">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-neutral-500">
                  {isFiltered
                    ? "No hay resultados con los filtros actuales."
                    : "No hay información disponible."}
                </td>
              </tr>
            )}

            {pageRows.map((row) => (
              <tr key={row.id || `${row.email}-${row.telefono}`} className="border-t">
                {/* <Td>{row.id}</Td> */}
                <Td className="font-medium">{row.cliente}</Td>
                <Td>{row.telefono}</Td>
                <Td className="truncate">{row.email}</Td>
                <Td><MetodoBadge metodo={row.metodo} /></Td>
                <Td>{row.servicio}</Td>
                <Td><EstadoBadge status={row.status} /></Td>
                <Td className="pr-4">
                  <div className="flex justify-end gap-2">
                    {/* Subir PDF */}
                    <div>
                      <input
                        id={`pdf-${row.id || `${row.email}-${row.telefono}`}`}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) =>
                          handleUploadPdf(row, e.target.files?.[0])
                        }
                      />
                      <button
                        onClick={() =>
                          document
                            .getElementById(`pdf-${row.id || `${row.email}-${row.telefono}`}`)
                            ?.click()
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 hover:bg-neutral-100"
                        title={
                          row.pdfFile
                            ? `PDF subido: ${row.pdfName}`
                            : "Subir PDF"
                        }
                      >
                        <IconFileTypePdf className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {row.pdfFile ? "Reemplazar PDF" : "Subir PDF"}
                        </span>
                        {row.pdfFile && (
                          <IconCheck className="h-4 w-4 text-[rgb(34,128,62)]" />
                        )}
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

function EstadoBadge({ status }) {
  // status: "PENDING" | "READY" | "SENT"
  if (status === "SENT") {
    return (
      <span className="rounded-full bg-[rgba(16,185,129,0.12)] px-2 py-0.5 text-xs font-medium text-emerald-600">
        Enviada
      </span>
    );
  }
  if (status === "READY") {
    return (
      <span className="rounded-full bg-[rgba(59,130,246,0.12)] px-2 py-0.5 text-xs font-medium text-blue-600">
        Lista
      </span>
    );
  }
  return (
    <span className="rounded-full bg-[rgba(245,158,11,0.12)] px-2 py-0.5 text-xs font-medium text-amber-600">
      Pendiente
    </span>
  );
}

function capitalizar(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
