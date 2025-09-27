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
import { toast } from "react-toastify";

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
const QUOTES_EDIT_PATH = "/adminQuotes/edit";
const QUOTES_SEND_PATH = "/adminQuotes/send";

// Token helper
function getToken() {
  // Busca varias claves comunes y elimina "Bearer " si viene incluido
  if (typeof window !== "undefined") {
    const keys = [
      "IdToken",
      "idToken",
      "token",
      "access_token",
      "accessToken",
      "Authorization",
    ];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      console.log("localStorage key:", k, "value:", raw);
      if (raw && raw.trim()) {
        return raw.replace(/^Bearer\s+/i, "");
      }
    }
  }
  return import.meta.env?.VITE_API_TOKEN || "";
}

function getAuthHeaders(extra = {}) {
  const token = getToken();
  return {
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    ...extra,
  };
}
// Normaliza el canal para la API
function mapPreferForAPI(prefer) {
  const p = String(prefer || "").toLowerCase();
  if (p === "llamada") return "phone";
  if (p === "whatsapp") return "whatsapp";
  if (p === "email") return "email";
  return "email";
}
function buildContactSnapshot(row, item, dni, prefer) {
  return {
    ...(item?.contactSnapshot || {}),
    fullName: row.cliente ?? item?.contactSnapshot?.fullName,
    cellphone: row.telefono ?? item?.contactSnapshot?.cellphone,
    preferContact: prefer,
    DNI: dni,
    email: row.email ?? item?.contactSnapshot?.email,
  };
}

export default function Cotizaciones() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [metodo, setMetodo] = useState("todos");
  const [servicio, setServicio] = useState("todos");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(false);

  //modal para detalles de cotizacion
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState(null);
  function toServiceTypeEnum(raw) {
    const s = String(raw || "")
      .trim()
      .toUpperCase();
    const map = {
      "SEGURO DE VIDA": "LIFE",
      VIDA: "LIFE",
      LIFE: "LIFE",
      "SEGURO MÉDICO": "MEDICAL",
      MEDICO: "MEDICAL",
      MÉDICO: "MEDICAL",
      MEDICAL: "MEDICAL",
      "SEGURO DE VEHÍCULO": "AUTO",
      VEHICULO: "AUTO",
      VEHÍCULO: "AUTO",
      AUTO: "AUTO",
      "SEGURO DE PROPIEDAD": "PROPERTY",
      PROPIEDAD: "PROPERTY",
      PROPERTY: "PROPERTY",
      "SEGURO DE VIAJE": "TRAVEL",
      VIAJE: "TRAVEL",
      TRAVEL: "TRAVEL",
      "REPATRIACIÓN Y ASISTENCIA": "ASSIST",
      REPATRIACION: "ASSIST",
      ASSIST: "ASSIST",
      OTRO: "OTHER",
      OTHER: "OTHER",
    };
    return map[s] || "OTHER";
  }

  async function openDetails(row) {
    try {
      setDetailsOpen(true);
      setDetailsLoading(true);
      const url = `${API_BASE}${QUOTE_BY_ID_PATH}?type=${encodeURIComponent(
        row.typeKey
      )}&contactDni=${encodeURIComponent(row.dni)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt.slice(0, 500));
      const json = txt ? JSON.parse(txt) : {};
      const item = extractQuoteFromGetById(json);
      const serviceType = toServiceTypeEnum(
        item?.serviceType || item?.service || row?.servicio
      );

      setDetails({
        ...item,
        serviceType,
        type:
          item?.type ||
          row?.typeFull ||
          (row?.typeKey ? `QUOTE#${row.typeKey}` : ""),
        contactSnapshot: item?.contactSnapshot || {},
        serviceData: item?.serviceData || item?.details || {},
        pdfUrl: item?.pdfUrl || row?.pdfUrl || null,
        status: (item?.status || row?.status || "").toUpperCase(),
      });
    } catch (e) {
      console.error("[openDetails] ", e);
      setDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  }

  function Field({ label, value }) {
    return (
      <div className="grid grid-cols-3 gap-3 py-1">
        <div className="text-xs text-neutral-500">{label}</div>
        <div className="col-span-2 text-sm">
          <Value value={value} />
        </div>
      </div>
    );
  }

  function renderServiceData(sd = {}, st = "OTHER") {
    if (!sd || typeof sd !== "object") return <p className="text-sm">—</p>;

    if (st === "AUTO") {
      const m = {
        vehicleBrand: "Marca",
        vehicleModel: "Modelo",
        vehicleYear: "Año",
        invoiceValue: "Valor factura",
        marketValue: "Valor mercado",
      };
      return (
        <div>
          {Object.entries(m).map(([k, label]) => (
            <Field key={k} label={label} value={sd[k]} />
          ))}
          {Object.keys(sd)
            .filter((k) => !(k in m))
            .map((k) => (
              <Field key={k} label={humanizeKey(k)} value={sd[k]} />
            ))}
        </div>
      );
    }

    if (st === "LIFE") {
      const m = {
        sumAssured: "Suma asegurada",
        profession: "Profesión",
        gender: "Género",
        birthDate: "Fecha de nacimiento",
        titular: "Titular", // <- puede ser objeto
        pareja: "Pareja", // <- puede ser objeto
      };
      return (
        <div>
          {Object.entries(m).map(([k, label]) => (
            <Field key={k} label={label} value={sd[k]} />
          ))}
          {Object.keys(sd)
            .filter((k) => !(k in m))
            .map((k) => (
              <Field key={k} label={humanizeKey(k)} value={sd[k]} />
            ))}
        </div>
      );
    }

    return (
      <div>
        {Object.entries(sd).map(([k, v]) => (
          <Field key={k} label={humanizeKey(k)} value={v} />
        ))}
      </div>
    );
  }

  // Extrae el objeto quote del GET /getById
  function humanizeKey(k = "") {
    return k
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function isEmptyValue(v) {
    if (v == null || v === "") return true;
    if (Array.isArray(v)) return v.length === 0;
    if (typeof v === "object") return Object.keys(v).length === 0;
    return false;
  }
  // Renderiza
 function Value({ value, depth = 0 }) {
  if (isEmptyValue(value)) return <span>—</span>;

  // Arrays
  if (Array.isArray(value)) {
    // Solo primitivos
    if (value.every(v => typeof v !== "object")) {
      return <span>{value.join(", ")}</span>;
    }
    // Array de objetos con 'name'
    if (value.every(v => v && typeof v === "object" && "name" in v)) {
      return <span>{value.map(v => v.name).join(", ")}</span>;
    }
    // Array de objetos con 'label'
    if (value.every(v => v && typeof v === "object" && "label" in v)) {
      return <span>{value.map(v => v.label).join(", ")}</span>;
    }
    // Fallback
    return (
      <span>
        {value
          .map(v => (typeof v === "object" ? JSON.stringify(v) : String(v)))
          .join(", ")}
      </span>
    );
  }

  // Objetos
  if (value && typeof value === "object") {
    // Mostrar sólo el nombre cuando exista
    if (typeof value.name === "string") return <span>{value.name}</span>;
    if (typeof value.label === "string") return <span>{value.label}</span>;
    return (
      <div className={depth === 0 ? "space-y-1" : "ml-3 space-y-1"}>
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-2">
            <div className="text-xs text-neutral-500">{humanizeKey(k)}</div>
            <div className="col-span-2 text-sm">
              <Value value={v} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return <span>{String(value)}</span>;
}
  //termnina modal de cotizacion aqui

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
          `[Cotizaciones] Respuesta inválida: ${
            res.status
          } CT=${ct} Preview=${text.slice(0, 120)}`
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
    const raw = String(it.type || it.quoteId || it.id || "");
    const hasPrefix = raw.startsWith("QUOTE#");
    const typeKey = hasPrefix ? raw.slice(6) : raw; // sin "QUOTE#"
    const typeFull = hasPrefix ? raw : typeKey ? `QUOTE#${typeKey}` : ""; // con "QUOTE#"

    // Servicio
    const servicio =
      serviceLabelFromAPI(it) ||
      guessServiceLabel(it.serviceData || it.details) ||
      "—";

    // Estado
    const apiStatus = (it.status || "").toString().trim().toUpperCase();
    const hasPdf = Boolean(it.pdfUrl || it.fileKey);
    const status =
      apiStatus === "SENT"
        ? "SENT"
        : hasPdf || apiStatus === "READY"
        ? "READY"
        : "PENDING";

    // ID
    const id = typeKey ? `Q-${typeKey.slice(0, 8).toUpperCase()}` : undefined;

    return {
      id,
      typeKey, // para GET getById
      typeFull, // para PUT edit
      dni,
      cliente: fullName || "—",
      telefono: cellphone || "—",
      email: email || "—",
      metodo,
      servicio,
      status,
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
    const raw = (it?.serviceType || it?.service || "")
      .toString()
      .trim()
      .toUpperCase();
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
      return `Seguro de Viaje${
        sd.tripType ? ` (${capitalize(sd.tripType)})` : ""
      }`;
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

  async function updateQuoteOnServer(row, updates) {
    if (!API_BASE) throw new Error("API_BASE no configurado.");

    const dni = row?.dni || "";
    const typeFull =
      row?.typeFull || (row?.typeKey ? `QUOTE#${row.typeKey}` : "");
    console.log("row", row, "updates", updates);
    if (!dni)
      throw new Error("updateQuoteOnServer: faltó contactDni (row.dni)");
    if (!typeFull)
      throw new Error("updateQuoteOnServer: faltó type (con 'QUOTE#')");
    if (!updates || typeof updates !== "object")
      throw new Error("updateQuoteOnServer: faltó updates");

    const url = `${API_BASE}${QUOTES_EDIT_PATH}`;
    const body = { contactDni: dni, type: typeFull, updates };

    console.log("[updateQuoteOnServer] PUT", url, "payload:", body);

    const res = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    });

    const txt = await res.text();
    console.log(
      "[updateQuoteOnServer] status:",
      res.status,
      res.statusText,
      "raw:",
      txt
    );

    if (!res.ok) throw new Error(`edit ${res.status}: ${txt.slice(0, 500)}`);

    try {
      return txt ? JSON.parse(txt) : {};
    } catch {
      return { raw: txt };
    }
  }

  // ===== Subida de PDF con Signed URL =====

  function buildFileKeyForEdit({ dni, typeFull }) {
    return `uploads/quote/${dni}/${typeFull}.pdf`;
  }

  async function handleUploadPdf(row, file) {
  if (!file) return;
  if (!API_BASE) return toast.error("No hay API_BASE configurado.");

  const dni = row?.dni || "";
  const typeKey = row?.typeKey || "";
  const typeFull = row?.typeFull || (typeKey ? `QUOTE#${typeKey}` : "");

  if (!dni || !typeKey || !typeFull) {
    return toast.error("Faltan datos para subir PDF (dni/typeKey/typeFull).");
  }

  const reemplazo = Boolean(row.pdfFile || row.pdfUrl || row.status === "READY");
  const t = toast.loading(reemplazo ? "Reemplazando PDF…" : "Subiendo PDF…");

  try {
    const folderPath = `uploads/quote/${dni}`;
    const desiredFileName = `${typeFull}.pdf`;

    // 1) URL firmada
    const signedRes = await fetch(`${API_BASE}${S3_SIGNED_URL_PATH}`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        fileName: desiredFileName,
        folderPath,
        fileType: "pdf",
      }),
    });

    const signedTxt = await signedRes.text();
    if (!signedRes.ok) {
      console.error("[getSignedUrl] fail:", signedRes.status, signedRes.statusText, signedTxt);
      throw new Error("No se pudo obtener URL firmada.");
    }
    const signedJson = signedTxt ? JSON.parse(signedTxt) : {};
    const uploadURL = signedJson?.body?.uploadURL;
    const fileURL = signedJson?.body?.fileURL;
    const fileKey = buildFileKeyForEdit({ dni, typeFull }); // uploads/quote/<dni>/QUOTE#...pdf

    if (!uploadURL) {
      console.error("Respuesta inválida de getSignedUrl:", signedJson);
      throw new Error("Respuesta inválida al solicitar URL firmada.");
    }

    // 2) PUT a S3
    const putRes = await fetch(uploadURL, {
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      body: file,
    });
    if (!putRes.ok) {
      const t = await putRes.text().catch(() => "");
      throw new Error(`PUT a S3 falló (${putRes.status}): ${t.slice(0, 180)}`);
    }

    // 3) READY con fileKey
    await updateQuoteOnServer({ ...row, typeFull }, { status: "READY", fileKey });

    // 4) UI
    setData((prev) =>
      prev.map((r) =>
        r.typeKey === typeKey
          ? {
              ...r,
              pdfFile: file,
              pdfName: desiredFileName,
              pdfUrl: fileURL,
              status: "READY",
              typeFull,
            }
          : r
      )
    );

    toast.update(t, {
      render: reemplazo ? "PDF reemplazado correctamente." : "PDF subido correctamente.",
      type: "success",
      isLoading: false,
      autoClose: 2500,
    });
  } catch (e) {
    console.error("[Upload PDF] ", e);
    toast.update(t, {
      render: `Falló la subida de PDF: ${e.message}`,
      type: "error",
      isLoading: false,
      autoClose: 4000,
    });
  }
}

  // ===== Enviar cotización =====
  async function handleSend(row) {
  if (!row.pdfFile && !row.pdfUrl) {
    return toast.error(
      `La cotización ${row.id || ""} no tiene PDF cargado. Súbelo antes de enviar.`
    );
  }
  if (!API_BASE) return toast.error("No hay API_BASE configurado.");

  const dni = row?.dni || "";
  const typeKey = row?.typeKey || "";
  const typeFull = row?.typeFull || (typeKey ? `QUOTE#${typeKey}` : "");
  if (!dni || !typeKey) {
    return toast.error("Faltan datos para enviar (type o DNI).");
  }

  const token = getToken();
  if (!token) return toast.error("No hay token de autenticación. Inicia sesión de nuevo.");

  const t = toast.loading("Enviando cotización…");

  try {
    // 1) Traer item completo
    const getUrl = `${API_BASE}${QUOTE_BY_ID_PATH}?type=${encodeURIComponent(
      typeKey
    )}&contactDni=${encodeURIComponent(dni)}`;

    const getRes = await fetch(getUrl, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const getTxt = await getRes.text();
    if (!getRes.ok)
      throw new Error(`getById ${getRes.status}: ${getTxt.slice(0, 500)}`);

    const getJson = getTxt ? JSON.parse(getTxt) : {};
    const item = extractQuoteFromGetById(getJson);
    if (!item) throw new Error("No se pudo interpretar la respuesta de getById.");

    // 2) Payload /send
    const preferUi = (
      row.metodo || item?.contactSnapshot?.preferContact || "email"
    ).toLowerCase();
    const prefer = preferUi === "llamada" ? "phone" : preferUi;
    const contactKey = `CONTACT#${dni}`;
    const fileKey = buildFileKeyForEdit({ dni, typeFull });

    const payload = {
      serviceData: item.serviceData || item.details || {},
      status: item.status || "READY",
      fileKey,
      ttl: item.ttl || Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
      contactSnapshot: buildContactSnapshot(row, item, dni, prefer),
      serviceType: (item.serviceType || item.service || "").toString().toUpperCase(),
      "contact#dni": contactKey,
      fileUploadedAt: item.fileUploadedAt || new Date().toISOString(),
      searchKey: item.searchKey || `${row.cliente} | ${row.status} | ${row.servicio}`,
      searchDate: item.searchDate || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recordType: "QUOTE",
      type: typeFull,
    };

    // 3) POST /send
    const sendRes = await fetch(`${API_BASE}${QUOTES_SEND_PATH}`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    const sendTxt = await sendRes.text();
    if (!sendRes.ok) {
      console.error("[/adminQuotes/send] status:", sendRes.status, sendRes.statusText, "resp:", sendTxt);
      throw new Error(`send ${sendRes.status}: ${sendTxt.slice(0, 500)}`);
    }

    // 4) Acción según preferencia
    if (prefer === "whatsapp") {
      const servicioMsg = serviceNameForMessage(row);
      const msg = buildWhatsAppMessage({
        cliente: row.cliente,
        servicio: servicioMsg,
      });
      const wa = buildWhatsAppLink(row.telefono, msg);
      window.open(wa, "_blank", "noopener,noreferrer");
      toast.info("Abriendo WhatsApp…");
    } else if (prefer === "phone") {
      toast.info(`Debes llamar al cliente: ${row.telefono}`);
    }

    // 5) estado SENT
    await updateQuoteOnServer({ ...row, typeFull }, { status: "SENT" });

    // 6) UI
    setData((prev) =>
      prev.map((r) => (r.typeKey === typeKey ? { ...r, status: "SENT", typeFull } : r))
    );

    toast.update(t, {
      render: "Cotización enviada correctamente.",
      type: "success",
      isLoading: false,
      autoClose: 2500,
    });
  } catch (e) {
    console.error("[Enviar] ", e);
    toast.update(t, {
      render: `No se pudo enviar la cotización: ${e.message}`,
      type: "error",
      isLoading: false,
      autoClose: 4000,
    });
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
              <tr
                key={row.id || `${row.email}-${row.telefono}`}
                className="border-t"
              >
                {/* <Td>{row.id}</Td> */}
                <Td className="font-medium">
                  <div className="w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] truncate">
                    <button
                      onClick={() => openDetails(row)}
                      title={row.cliente}
                      className="block w-full text-left underline decoration-dotted underline-offset-2 hover:text-[rgb(34,128,62)]"
                    >
                      {row.cliente}
                    </button>
                  </div>
                </Td>

                <Td>{row.telefono}</Td>
                <Td>
                  <div
                    className="w-[220px] md:w-[280px] truncate"
                    title={row.email}
                  >
                    {row.email}
                  </div>
                </Td>

                <Td>
                  <MetodoBadge metodo={row.metodo} />
                </Td>
                <Td>{row.servicio}</Td>
                <Td>
                  <EstadoBadge status={row.status} />
                </Td>
                <Td className="pr-4">
                  <div className="flex justify-end gap-2">
                    {/* Detalle de cotizacion */}
                    <button
                      onClick={() => openDetails(row)}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 hover:bg-neutral-100"
                      title="Ver detalles"
                    >
                      <IconSearch className="h-4 w-4" />
                      <span className="hidden sm:inline">Detalles</span>
                    </button>
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
                            .getElementById(
                              `pdf-${row.id || `${row.email}-${row.telefono}`}`
                            )
                            ?.click()
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 hover:bg-neutral-100"
                        title={
                          row.pdfFile || row.pdfUrl
                            ? `PDF subido: ${
                                row.pdfName || "Archivo existente"
                              }`
                            : "Subir PDF"
                        }
                      >
                        <IconFileTypePdf className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {row.pdfFile || row.pdfUrl || row.status === "READY"
                            ? "Reemplazar PDF"
                            : "Subir PDF"}
                        </span>
                        {(row.pdfFile ||
                          row.pdfUrl ||
                          row.status === "READY") && (
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
            Página <strong>{currentPage}</strong> de{" "}
            <strong>{totalPages}</strong>
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
      {/* Modal detalles de cotizacion */}
      {detailsOpen && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onKeyDown={(e) => e.key === "Escape" && setDetailsOpen(false)}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDetailsOpen(false)}
          />
          <div className="relative mx-auto mt-16 w-[min(760px,92vw)] rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-base font-semibold">
                Detalle de cotización{" "}
                {/* {details?.type?.replace("QUOTE#", "") || ""} */}
              </h3>
              <button
                onClick={() => setDetailsOpen(false)}
                className="rounded-full p-1 hover:bg-neutral-100"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="p-4">
              {detailsLoading && <p className="text-sm">Cargando…</p>}

              {!detailsLoading && details && (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Contacto */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-neutral-700">
                      Contacto
                    </h4>
                    <Field
                      label="Nombre"
                      value={details.contactSnapshot?.fullName}
                    />
                    <Field label="DNI" value={details.contactSnapshot?.DNI} />
                    <Field
                      label="Teléfono"
                      value={details.contactSnapshot?.cellphone}
                    />
                    <Field
                      label="Email"
                      value={details.contactSnapshot?.email}
                    />
                    <Field
                      label="Preferencia"
                      value={details.contactSnapshot?.preferContact}
                    />
                  </div>

                  {/* Estado / Archivo */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-neutral-700">
                      Estado
                    </h4>
                    <Field label="Status" value={details.status} />
                    <Field label="ServiceType" value={details.serviceType} />
                    <Field
                      label="Archivo"
                      value={details.fileKey || details?.pdfUrl ? "PDF" : "—"}
                    />
                    {details?.pdfUrl && (
                      <div className="mt-2">
                        <a
                          href={details.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline text-[rgb(34,128,62)]"
                        >
                          Ver PDF
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Datos del servicio */}
                  <div className="md:col-span-2">
                    <h4 className="mb-2 text-sm font-semibold text-neutral-700">
                      Datos del servicio
                    </h4>
                    {renderServiceData(
                      details.serviceData,
                      details.serviceType
                    )}
                  </div>
                </div>
              )}

              {!detailsLoading && !details && (
                <p className="text-sm text-red-600">
                  No se pudieron cargar los detalles.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t p-3">
              <button
                onClick={() => setDetailsOpen(false)}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th
      className={`px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}
    >
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

function serviceNameForMessage(row) {
  return row?.servicio || "tu seguro";
}

function buildWhatsAppMessage({ cliente, servicio }) {
  const firstName = (cliente || "").split(" ")[0] || "¡Hola!";
  return `Buen día ${firstName}, te saludamos de MENCAS. Esta es tu cotización para ${servicio}.`;
}

function buildWhatsAppLink(phone, message) {
  // Solo dígitos para wa.me (sin '+', espacios, guiones)
  const number = String(phone || "").replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

//  GET /adminQuotes/getById
function extractQuoteFromGetById(json) {
  if (!json) return null;
  if (json.quote) return json.quote;
  if (json.item) return json.item;
  if (Array.isArray(json.items) && json.items[0]) return json.items[0];
  if (json.type || json["contact#dni"] || json.contactSnapshot) return json;
  return null;
}
