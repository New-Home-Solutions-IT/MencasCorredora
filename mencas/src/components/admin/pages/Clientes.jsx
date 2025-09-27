import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconEdit,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";

const METODOS = ["whatsapp", "email", "llamada"];
const GENEROS = ["Male", "Female"];

// ===== API base y endpoints =====
const API_BASE = (import.meta.env?.VITE_API_URL || "").replace(/\/+$/, "");
const CONTACTS_PATH = "/contacts/getAll";
const CONTACTS_UPDATE_PATH = "/contacts/update";
const CONTACTS_ADD_PATH = "/contacts/add";
const S3_GET_SIGNED_URL_PATH = "/s3_uploads/getSignedUrl";
const CONTACTS_CREATE_BATCH_PATH = "/contacts/createBatch";
const CONTACTS_DELETE_PATH = "/contacts/delete";

// IdToken desde localStorage
function getIdToken() {
  return (
    localStorage.getItem("IdToken") ||
    localStorage.getItem("idToken") ||
    localStorage.getItem("auth.idToken") ||
    ""
  );
}
function toRawDNI(v) {
  return String(v || "").replace(/\D/g, ""); 
}

/* =========================
   Normalizadores / mappers
========================= */
function normalizePhone(p) {
  const raw = String(p || "");
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (raw.startsWith("+")) return raw;
  if (digits.length === 8) return `+504${digits}`;
  return `+${digits}`;
}

function mapPreferContactOut(m) {
  const s = String(m || "").toLowerCase();
  if (s.includes("whats")) return "whatsapp";
  if (s.includes("mail")) return "email";
  if (s.includes("llam") || s.includes("phone") || s.includes("call"))
    return "llamada";
  return "whatsapp";
}

function buildContactBodyFromForm(f) {
  const out = {
    recordType: "PROFILE",
    fullName: (f.nombre || "").trim(),
    DNI: String(f.id || "").replace(/\D/g, ""),
    cellphone: normalizePhone(f.telefono),
    preferContact: mapPreferContactOut(f.metodo),
    enabled: true,
  };
  if (f.email?.trim()) out.email = f.email.trim();
  if (f.gender?.trim()) out.gender = f.gender.trim(); // "Male" | "Female"
  if (f.birthDate?.trim()) out.birthDate = f.birthDate.trim(); // "YYYY-MM-DD"
  return out;
}

/* =========================
   Utilidades varias
========================= */
function normalizeMethod(m) {
  if (!m) return "whatsapp";
  const s = String(m).toLowerCase().trim();
  if (s.includes("whatsapp")) return "whatsapp";
  if (s.includes("email")) return "email";
  if (s.includes("llam") || s.includes("call") || s.includes("phone"))
    return "llamada";
  return "whatsapp";
}

function formatHNIdentity(dni) {
  const digits = String(dni || "").replace(/\D/g, "");
  if (digits.length === 13) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
  }
  return dni || "";
}

function ageFromBirthDate(birth) {
  if (!birth) return "";
  const d = new Date(birth);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 && age <= 120 ? age : "";
}

// Merge por id 
function mergeRowsById(prev, incoming) {
  const map = new Map(prev.map((r) => [r.id, r]));
  for (const row of incoming) map.set(row.id, row);
  return Array.from(map.values());
}

/* =========================
   CSV helpers
========================= */
const TEMPLATE_HEADERS = [
  "nombre",
  "telefono",
  "email",
  "metodopreferido",
  "genero",
  "DNI",
  "fechadeNacimiento",
];
function normalizeHeader(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}
const REQUIRED_HEADERS_NORM = TEMPLATE_HEADERS.map(normalizeHeader);
/* =========================
    Lectura robusta del archivo (UTF-8 con/sin BOM o Latin-1)
========================= */
async function readFileSmart(file) {
  const buf = await file.arrayBuffer();

  // Primero intentamos UTF-8
  let text = tryDecode(buf, "utf-8");

  // Si aparecen varios caracteres, reintenta Latin-1 (ISO-8859-1)
  const bad = (text.match(/\uFFFD/g) || []).length;
  if (bad > 3) text = tryDecode(buf, "iso-8859-1");

  // Quita BOM si viniera
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  return text;
}

function tryDecode(arrayBuffer, encoding) {
  try {
    return new TextDecoder(encoding, { fatal: false }).decode(
      new Uint8Array(arrayBuffer)
    );
  } catch {
    return new TextDecoder().decode(new Uint8Array(arrayBuffer));
  }
}

// ===== Parser CSV que respeta comillas y deja el encabezado tal cual =====
function parseCsvKeepHeader(text) {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headersRaw: [], rows: [] };

  const parseLine = (line) => {
    const out = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = !inQ;
        }
      } else if (ch === "," && !inQ) {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out;
  };

  // Encabezados 
  const headersRaw = parseLine(lines[0]);
  if (headersRaw.length && headersRaw[0].charCodeAt(0) === 0xfeff) {
    headersRaw[0] = headersRaw[0].slice(1);
  }

  const rows = lines.slice(1).map(parseLine);
  return { headersRaw, rows };
}

/* =========================
          Componente
========================= */
export default function Clientes() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [metodo, setMetodo] = useState("todos");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(getEmptyForm());

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);
  const lastKeyRef = useRef(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    refreshFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getEmptyForm() {
    return {
      id: "",
      nombre: "",
      telefono: "",
      email: "",
      metodo: "whatsapp",
      gender: "", // "Male" | "Female"
      birthDate: "", // "YYYY-MM-DD"
    };
  }

  async function refreshFromServer() {
    lastKeyRef.current = null;
    await fetchContacts({ append: false, limit: 1000 });
  }

  async function loadMore() {
    if (!lastKeyRef.current) return;
    await fetchContacts({
      append: true,
      limit: 2000,
      lastKey: lastKeyRef.current,
    });
  }

  // GET /contacts/getAll
  async function fetchContacts({ append, limit = 1000, lastKey } = {}) {
    setErrMsg("");
    if (!API_BASE) {
      setErrMsg("VITE_API_URL no está configurado.");
      return;
    }
    const token = getIdToken();
    if (!token) {
      setErrMsg("No hay IdToken en localStorage. Inicia sesión nuevamente.");
      return;
    }

    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (lastKey && typeof lastKey === "object") {
      params.set("lastKey", encodeURIComponent(JSON.stringify(lastKey)));
    }
    params.set("_t", String(Date.now())); // cache buster

    const url = `${API_BASE}${CONTACTS_PATH}?${params.toString()}`;

    try {
      setLoading(true);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        cache: "no-store",
      });

      const text = await res.text();
      const ct = (res.headers.get("content-type") || "").toLowerCase();

      if (!res.ok) {
        console.error(
          `[Clientes] HTTP ${res.status} ${
            res.statusText
          } CT=${ct} :: ${text.slice(0, 160)}`
        );
        setErrMsg(`Error ${res.status}: no se pudo cargar contactos.`);
        return;
      }
      if (!ct.includes("application/json")) {
        console.error(
          `[Clientes] Esperaba JSON pero CT=${ct} :: ${text.slice(0, 160)}`
        );
        setErrMsg("La API no devolvió JSON válido.");
        return;
      }

      const json = JSON.parse(text);
      const items = json?.contacts?.items ?? [];
      const normalized = items.map(mapFromApiToRow).filter(Boolean);
      lastKeyRef.current = json?.contacts?.lastKey ?? null;

      if (append) {
        setData((prev) => [...prev, ...normalized]);
      } else {
        setData((prev) => mergeRowsById(prev, normalized));
        setPage(1);
      }
    } catch (err) {
      console.error("[Clientes] Error al cargar contactos:", err);
      setErrMsg("Error de red al cargar contactos.");
    } finally {
      setLoading(false);
    }
  }

  // API -> tabla
  function mapFromApiToRow(it) {
    if (!it) return null;
    const nombre = (it.fullName|| "").trim();
    const telefono = (it.cellphone || "").trim();
    const email = (it.email || "").trim();
    const metodo = normalizeMethod(it.preferContact);
    const id = formatHNIdentity(it.DNI || "");
    const birthDate = it.birthDate || "";
    const gender = it.gender || "";
    return { id, nombre, telefono, email, metodo, birthDate, gender };
  }

  // Filtro + búsqueda (orden alfabético por nombre)
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const base = data.filter((row) => {
      const matchesQ =
        !term ||
        row.nombre.toLowerCase().includes(term) ||
        row.telefono.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.id.toLowerCase().includes(term);
      const matchesMetodo = metodo === "todos" || row.metodo === metodo;
      return matchesQ && matchesMetodo;
    });

    return base.slice().sort((a, b) =>
      (a.nombre || "").localeCompare(b.nombre || "", "es", {
        sensitivity: "base",
        ignorePunctuation: true,
        numeric: true,
      })
    );
  }, [data, q, metodo]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function resetToFirstPage() {
    setPage(1);
  }

  // Guardar (crear/editar) 
  async function handleSave(e) {
    e.preventDefault();

    if (!form.nombre.trim()) return alert("El nombre es obligatorio.");
    if (!form.id.trim())
      return alert("La ID es obligatoria (0801-AAAA-NNNNN).");
    if (!/^\d{4}-\d{4}-\d{5}$/.test(form.id))
      return alert("ID inválida. Ej: 0801-1998-05788");
    if (!normalizePhone(form.telefono))
      return alert("Teléfono inválido o vacío.");
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return alert("Email inválido.");

    try {
      setLoading(true);
      setErrMsg("");

      const token = getIdToken();
      if (!token) throw new Error("Sin IdToken");

      const body = buildContactBodyFromForm(form);

      if (editingId) {
        // EDITAR
        const res = await fetch(`${API_BASE}${CONTACTS_UPDATE_PATH}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        const text = await res.text();
        if (!res.ok) {
          console.error(
            `[PUT update] ${res.status} ${res.statusText} :: ${text.slice(
              0,
              200
            )}`
          );
          alert(`Error ${res.status} al actualizar.`);
          return;
        }
      } else {
        // CREAR
        const res = await fetch(`${API_BASE}${CONTACTS_ADD_PATH}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        const text = await res.text();
        if (!res.ok) {
          console.error(
            `[POST add] ${res.status} ${res.statusText} :: ${text.slice(
              0,
              200
            )}`
          );
          alert(`Error ${res.status} al crear.`);
          return;
        }

        let apiItem = null;
        try {
          apiItem = text ? JSON.parse(text) : null;
        } catch {
          // ignorar por ahora luego agrego 
        }
        const created = apiItem?.contact || apiItem?.item || apiItem;

        const newRow = created
          ? mapFromApiToRow(created)
          : {
              id: formatHNIdentity(form.id),
              nombre: (form.nombre || "").trim(),
              telefono: normalizePhone(form.telefono),
              email: (form.email || "").trim(),
              metodo: mapPreferContactOut(form.metodo),
              birthDate: form.birthDate || "",
              gender: form.gender || "",
            };

        setData((prev) => {
          const withoutDup = prev.filter((r) => r.id !== newRow.id);
          return [newRow, ...withoutDup];
        });
      }

      await refreshFromServer();
      setShowForm(false);
      setEditingId(null);
      setForm(getEmptyForm());
    } catch (err) {
      console.error("handleSave error", err);
      setErrMsg("No se pudo guardar el contacto.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(row) {
    setEditingId(row.id);
    setForm({ ...row, id: row.id });
    setShowForm(true);
  }

  async function handleDelete(row) {
    const nombre = row?.nombre || "";
    const dniRaw = toRawDNI(row?.id);

    if (!dniRaw) {
      alert("No se encontró un DNI válido para este registro.");
      return;
    }

    const ok = confirm(`¿Eliminar al cliente ${nombre}?`);
    if (!ok) return;

    const token = getIdToken();
    if (!API_BASE || !token) {
      alert("No hay configuración de API o token.");
      return;
    }

    // Optimistic UI
    const prev = data;
    setDeletingId(row.id);
    setData((p) => p.filter((r) => toRawDNI(r.id) !== dniRaw));
    setErrMsg("");

    try {
      const res = await fetch(`${API_BASE}${CONTACTS_DELETE_PATH}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ DNI: dniRaw }),
      });

      const txt = await res.text();
      if (!res.ok) {
        console.error(
          `[DELETE contact] ${res.status} ${res.statusText} :: ${txt.slice(
            0,
            200
          )}`
        );
        // rollback
        setData(prev);
        alert(`No se pudo eliminar (HTTP ${res.status}).`);
        return;
      }
      await refreshFromServer();
    } catch (err) {
      console.error("handleDelete error", err);
      setData(prev); 
      setErrMsg("No se pudo eliminar el contacto.");
      alert("Ocurrió un error eliminando el contacto.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setForm(getEmptyForm());
  }

  // ===== Importación CSV vía S3 + createBatch =====
  async function handleImportChange(e) {
    const file = e.target.files?.[0];
    try {
      await importCsvToBatch(file);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

 async function importCsvToBatch(file) {
  if (!file) return;
  const lower = file.name.toLowerCase();
  if (!lower.endsWith(".csv")) {
    alert("Sube un CSV (exporta tu Excel como CSV UTF-8).");
    return;
  }

  // Lee y parsea preservando comillas y encabezado original
  const text = await readFileSmart(file);
  const { headersRaw, rows } = parseCsvKeepHeader(text);

  if (headersRaw.length === 0) {
    alert("El CSV está vacío.");
    return;
  }

  // Validamos encabezados EXACTOS y en el mismo orden
  const headerOk =
    headersRaw.length === TEMPLATE_HEADERS.length &&
    headersRaw.every((h, i) => stripBOM((h || "").trim()) === TEMPLATE_HEADERS[i]);

  if (!headerOk) {
    alert(
      "La plantilla no coincide.\n\nEncabezados esperados (en este orden):\n" +
        TEMPLATE_HEADERS.join(", ")
    );
    return;
  }

  const token = getIdToken();
  if (!API_BASE || !token) {
    alert("No hay configuración de API o token.");
    return;
  }

  setImporting(true);
  setErrMsg("");

  try {
    // --- RECONSTRUYE CSV LIMPIO, SIN BOM --- //
    const cleanHeader = TEMPLATE_HEADERS; 
    const cleanLines = [cleanHeader.join(",")];

    for (const cols of rows) {
      const [
        nombre,
        telefono,
        email,
        metodopreferido,
        genero,
        DNI,
        fechadeNacimiento,
      ] = cols;

      cleanLines.push(
        [
          csvEscape(stripBOM(nombre)),
          csvEscape(String(telefono ?? "").trim()),
          csvEscape(String(email ?? "").trim()),
          csvEscape(String(metodopreferido ?? "").trim()),
          csvEscape(String(genero ?? "").trim()),
          csvEscape(String(DNI ?? "").replace(/\D/g, "")), // sólo dígitos
          csvEscape(toIsoDate(fechadeNacimiento ?? "")),   // YYYY-MM-DD
        ].join(",")
      );
    }

    const csvClean = cleanLines.join("\n");
    const blobClean = new Blob([csvClean], { type: "text/csv;charset=utf-8" });

    // --- Pide URL firmada --- //
    const folderPath = "uploads/csv"; // <= sin slash final
    const cleanName = file.name.replace(/\.csv$/i, "") + "-clean.csv";

    const signedRes = await fetch(`${API_BASE}${S3_GET_SIGNED_URL_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileName: cleanName,
        folderPath,
        fileType: "csv",
      }),
    });

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
    const fileURL = signedJson?.body?.fileURL;
    console.log("Signed URL:", { fileURL });
    if (!uploadURL || !fileURL) {
      console.error("Respuesta inválida de getSignedUrl:", signedJson);
      alert("Respuesta inválida al solicitar URL firmada.");
      return;
    }

    // --- Sube a S3 el CSV LIMPIO --- //
    const putRes = await fetch(uploadURL, {
      method: "PUT",
      body: blobClean,
      headers: {
        "Content-Type": "text/csv",
      },
    });
    if (!putRes.ok) {
      const t = await putRes.text();
      throw new Error(
        `Error al subir a S3: ${putRes.status} ${putRes.statusText} :: ${t.slice(0, 200)}`
      );
    }

    // --- Llama createBatch con la key derivada --- //
    const key = fileURL; 
    console.log("S3 file key:", key);
    const batchRes = await fetch(`${API_BASE}${CONTACTS_CREATE_BATCH_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ key }),
    });

    const batchTxt = await batchRes.text();
    if (!batchRes.ok) {
      console.error(
        `[createBatch] ${batchRes.status} ${batchRes.statusText} :: ${batchTxt.slice(0, 200)}`
      );
      alert("Error al crear el batch de contactos.");
      return;
    }

    alert("Importación iniciada correctamente. Refrescando lista...");
    await refreshFromServer();
  } catch (err) {
    console.error("importCsvToBatch error", err);
    setErrMsg("Falló la importación CSV.");
    alert(err.message || "Ocurrió un error importando el CSV.");
  } finally {
    setImporting(false);
  }
}


  // CSV: edad calculada al vuelo
  function downloadCsv() {
    const rows = filtered;
    const header = [
      "ID",
      "Nombre",
      "Teléfono",
      "Email",
      "Método preferido",
      "Edad",
    ];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        [
          safeCsv(r.id),
          safeCsv(r.nombre),
          safeCsv(r.telefono),
          safeCsv(r.email),
          safeCsv(capitalizar(r.metodo)),
          safeCsv(ageFromBirthDate(r.birthDate)),
        ].join(",")
      ),
    ].join("\n");
    downloadCsvWithBom(csv, `clientes-${today()}.csv`);
  }

  function downloadTemplate() {
    const ejemplo = [
      TEMPLATE_HEADERS.join(","),
      [
        "Carlos Parra",
        "+504 9999-99999",
        "cparra@example.com",
        "WhatsApp",
        "Male",
        "0801199012345",
        "1991-05-20",
      ]
        .map(safeCsv)
        .join(","),
    ].join("\n");
    downloadCsvWithBom(ejemplo, "plantilla-clientes.csv");
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold">Clientes</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={refreshFromServer}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100 disabled:opacity-60"
            title="Refrescar desde el servidor"
          >
            {loading ? "Cargando..." : "Refrescar"}
          </button>

          {lastKeyRef.current && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100 disabled:opacity-60"
              title="Cargar más contactos"
            >
              Cargar más
            </button>
          )}

          <button
            onClick={() => {
              setEditingId(null);
              setForm(getEmptyForm());
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[rgb(34,128,62)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <IconPlus className="h-4 w-4" />
            Nuevo cliente
          </button>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100">
            <IconUpload className="h-4 w-4" />
            {importing ? "Importando..." : "Importar CSV"}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleImportChange}
              disabled={importing}
            />
          </label>

          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100"
            title="Descargar plantilla CSV"
          >
            <IconDownload className="h-4 w-4" />
            Plantilla
          </button>

          <button
            onClick={downloadCsv}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100"
            title="Descargar CSV (respeta filtros)"
          >
            <IconDownload className="h-4 w-4" />
            Descargar
          </button>
        </div>
      </div>

      {errMsg && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errMsg}
        </div>
      )}

      {/* Filtros */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-200 bg-white p-3 md:grid-cols-12">
        <div className="md:col-span-6">
          <label className="mb-1 block text-xs text-neutral-500">Buscar</label>
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                resetToFirstPage();
              }}
              placeholder="Buscar por nombre, email, teléfono o ID"
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
              <Th>Nombre</Th>
              <Th>Teléfono</Th>
              <Th>Email</Th>
              <Th>Método</Th>
              <Th>ID</Th>
              <Th>Edad</Th>
              <Th className="text-right pr-4">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-neutral-500">
                  {loading ? "Cargando..." : "No hay resultados."}
                </td>
              </tr>
            )}

            {pageRows.map((row) => (
              <tr key={row.id} className="border-t">
                <Td className="font-medium">{row.nombre}</Td>
                <Td>{row.telefono}</Td>
                <Td className="truncate">{row.email}</Td>
                <Td>
                  <MetodoBadge metodo={row.metodo} />
                </Td>
                <Td className="font-mono">{row.id}</Td>
                <Td>{ageFromBirthDate(row.birthDate)}</Td>
                <Td className="pr-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 hover:bg-neutral-100"
                      title="Editar"
                    >
                      <IconEdit className="h-4 w-4" />
                      <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      disabled={deletingId === row.id}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      title="Eliminar"
                    >
                      <IconTrash className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {deletingId === row.id ? "Eliminando..." : "Eliminar"}
                      </span>
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

      {/* Modal/Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl rounded-xl border border-neutral-200 bg-white p-4 md:p-6"
          >
            <h3 className="mb-4 text-base font-semibold">
              {editingId ? "Editar cliente" : "Nuevo cliente"}
            </h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Nombre *"
                value={form.nombre}
                onChange={(v) => setForm((f) => ({ ...f, nombre: v }))}
                placeholder="Nombre completo"
              />
              <TextField
                label="Teléfono *"
                value={form.telefono}
                onChange={(v) => setForm((f) => ({ ...f, telefono: v }))}
                placeholder="+504 9xxx-xxxx"
              />
              <TextField
                label="Email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                placeholder="correo@dominio.com"
              />
              <SelectField
                label="Método preferido"
                value={form.metodo}
                onChange={(v) => setForm((f) => ({ ...f, metodo: v }))}
                options={METODOS}
              />
              <TextField
                label="ID*"
                value={form.id}
                onChange={(v) => setForm((f) => ({ ...f, id: v }))}
                placeholder="0801-1998-05788"
                readOnly={!!editingId}
              />
              <SelectField
                label="Género"
                value={form.gender}
                onChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                options={["", ...GENEROS]}
              />
              <TextField
                label="Fecha de nacimiento"
                type="date"
                value={form.birthDate}
                onChange={(v) => setForm((f) => ({ ...f, birthDate: v }))}
                placeholder="YYYY-MM-DD"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[rgb(34,128,62)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Guardar
              </button>
            </div>

            <p className="mt-3 text-xs text-neutral-500">
              * El DNI/ID no es editable en este formulario. Para cambiarlo,
              elimina el cliente y crea uno nuevo.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

/* ---------- UI helpers ---------- */
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
// --- Helpers para limpiar CSV y normalizar campos --- //
function stripBOM(s = "") {
  return String(s || "").replace(/^\uFEFF/, "");
}

function csvEscape(v) {
  const s = (v ?? "").toString();
  return `"${s.replace(/"/g, '""')}"`;
}

// Normaliza a YYYY-MM-DD. Acepta "YYYY-MM-DD", "M/D/YY", "D/M/YY", "M-D-YYYY", etc.
function toIsoDate(input) {
  if (!input) return "";
  const t = String(input).trim();

  // ya viene ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;

  // separador / o -
  const m = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (!m) return t;

  let a = parseInt(m[1], 10);
  let b = parseInt(m[2], 10);
  let y = m[3];

  // Año a 4 dígitos
  if (y.length === 2) {
    const yy = parseInt(y, 10);
    y = (yy > 30 ? 1900 + yy : 2000 + yy).toString();
  }

  // Heurística: si el primer número > 12, asumimos D/M/Y; si el segundo > 12, asumimos M/D/Y
  // Si ambos <= 12, asumimos M/D/Y (estilo Excel US)
  let month = a, day = b;
  if (a > 12 && b <= 31) {
    day = a; month = b;
  } else if (b > 12 && a <= 12) {
    month = a; day = b;
  }

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}


// Inputs
function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  disabled = false,
  readOnly = false,
}) {
  return (
    <label className={cnField("block", className)}>
      <span className="mb-1 block text-xs text-neutral-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={`w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]
          ${
            disabled ? "bg-neutral-100 text-neutral-500 cursor-not-allowed" : ""
          }
          ${readOnly ? "bg-neutral-50" : ""}`}
      />
    </label>
  );
}
function SelectField({ label, value, onChange, options, className = "" }) {
  return (
    <label className={cnField("block", className)}>
      <span className="mb-1 block text-xs text-neutral-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o ? o : "—"}
          </option>
        ))}
      </select>
    </label>
  );
}
function cnField(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ---------- CSV utils (con BOM) ---------- */
function today() {
  return new Date().toISOString().slice(0, 10);
}
function downloadCsvWithBom(csvString, filename) {
  const BOM = "\uFEFF";
  const blob = new Blob([BOM, csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function safeCsv(value) {
  const v = value ?? "";
  return `"${String(v).replace(/"/g, '""')}"`;
}
function capitalizar(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
