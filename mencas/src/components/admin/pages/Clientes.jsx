// src/components/admin/pages/Clientes.jsx
import React, { useMemo, useState } from "react";
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

const BRAND = "rgb(34,128,62)";
const METODOS = ["whatsapp", "email", "llamada"];

const MOCK = [
  {
    id: "0801-1998-05788",
    nombre: "Ana López",
    telefono: "+504 9988-2211",
    email: "ana@example.com",
    metodo: "whatsapp",
    ocupacion: "Ingeniera Agrónoma",
    edad: 27,
    direccion: "Col. Miraflores, Tegucigalpa",
  },
  {
    id: "0801-1985-11223",
    nombre: "Carlos Mejía",
    telefono: "+504 9911-3344",
    email: "carlos.mejia@correo.hn",
    metodo: "email",
    ocupacion: "Distribuidor",
    edad: 39,
    direccion: "Barrio Abajo, Tegucigalpa",
  },
  {
    id: "0801-1992-00991",
    nombre: "María Fernández",
    telefono: "+504 9876-1122",
    email: "mariaf@empresa.hn",
    metodo: "llamada",
    ocupacion: "Productora",
    edad: 33,
    direccion: "Col. San Ángel, Tegucigalpa",
  },
];

export default function Clientes() {
  const [data, setData] = useState(MOCK);
  const [q, setQ] = useState("");
  const [metodo, setMetodo] = useState("todos");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(getEmptyForm());

  function getEmptyForm() {
    return {
      id: "",
      nombre: "",
      telefono: "",
      email: "",
      metodo: "whatsapp",
      ocupacion: "",
      edad: "",
      direccion: "",
    };
  }

  // Filtro + búsqueda
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.filter((row) => {
      const matchesQ =
        !term ||
        row.nombre.toLowerCase().includes(term) ||
        row.telefono.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.id.toLowerCase().includes(term) ||
        row.ocupacion.toLowerCase().includes(term) ||
        row.direccion.toLowerCase().includes(term);
      const matchesMetodo = metodo === "todos" || row.metodo === metodo;
      return matchesQ && matchesMetodo;
    });
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
  function handleSave(e) {
    e.preventDefault();

    if (!form.nombre.trim()) return alert("El nombre es obligatorio.");
    if (!form.id.trim())
      return alert("La ID es obligatoria (formato HN: 0801-AAAA-NNNNN).");
    if (!/^\d{4}-\d{4}-\d{5}$/.test(form.id))
      return alert("ID inválida. Ejemplo válido: 0801-1998-05788");
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return alert("Email inválido.");

    const payload = {
      ...form,
      metodo: (form.metodo || "whatsapp").toLowerCase(),
      edad: form.edad ? Number(form.edad) : "",
    };

    setData((prev) => {
      if (editingId) {
        return prev.map((r) => (r.id === editingId ? payload : r));
      }
      if (prev.some((r) => r.id === payload.id)) {
        alert("Ya existe un cliente con esa ID.");
        return prev;
      }
      return [payload, ...prev];
    });

    setShowForm(false);
    setEditingId(null);
    setForm(getEmptyForm());
  }

  function handleEdit(row) {
    setEditingId(row.id);
    setForm({ ...row, edad: row.edad?.toString() ?? "" });
    setShowForm(true);
  }

  function handleDelete(row) {
    if (confirm(`¿Eliminar al cliente ${row.nombre}?`)) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
    }
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setForm(getEmptyForm());
  }

  // Descargar CSV (tabla filtrada) con BOM
  function downloadCsv() {
    const rows = filtered; // usa pageRows si prefieres solo la página visible
    const header = [
      "ID",
      "Nombre",
      "Teléfono",
      "Email",
      "Método preferido",
      "Ocupación",
      "Edad",
      "Dirección",
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
          safeCsv(r.ocupacion),
          safeCsv(r.edad),
          safeCsv(r.direccion),
        ].join(",")
      ),
    ].join("\n");

    // ✅ Con BOM para acentos/ñ
    downloadCsvWithBom(csv, `clientes-${today()}.csv`);
  }

  // ====== 📥 IMPORTACIÓN CSV (alta masiva) ======
  const TEMPLATE_HEADERS = [
    "Nombre",
    "Teléfono",
    "Email",
    "Método preferido",
    "Ocupación",
    "ID",
    "Edad",
    "Dirección",
  ];

  function downloadTemplate() {
    const ejemplo = [
      TEMPLATE_HEADERS.join(","),
      [
        "Juan Pérez",
        "+504 9999-1111",
        "juan@example.com",
        "WhatsApp",
        "Productor",
        "0801-1990-12345",
        "35",
        "Col. Las Colinas, Tegucigalpa",
      ]
        .map(safeCsv)
        .join(","),
    ].join("\n");

    // ✅ Con BOM para acentos/ñ
    downloadCsvWithBom(ejemplo, "plantilla-clientes.csv");
  }

  async function handleImportCsv(file) {
    if (!file) return;
    const text = await file.text();

    const { headers, rows } = parseCsv(text);
    if (!headers || headers.length === 0) {
      alert("El CSV no tiene encabezados.");
      return;
    }

    const map = mapColumns(headers);

    const required = ["nombre", "id"];
    for (const key of required) {
      if (!map[key]) {
        alert(
          `Falta la columna requerida: ${requeridaHumana(key)}.\n` +
            `Encabezados esperados: ${TEMPLATE_HEADERS.join(", ")}`
        );
        return;
      }
    }

    let ok = 0;
    const errors = [];
    const nuevos = [];

    rows.forEach((r, idx) => {
      const get = (key) => r[map[key] ?? -1] ?? "";

      const nombre = String(get("nombre")).trim();
      const telefono = String(get("telefono")).trim();
      const email = String(get("email")).trim();
      const metodo = (String(get("metodo")).trim() || "whatsapp").toLowerCase();
      const ocupacion = String(get("ocupacion")).trim();
      const id = String(get("id")).trim();
      const edadRaw = String(get("edad")).trim();
      const direccion = String(get("direccion")).trim();

      if (!nombre) return errors.push(msgErr(idx, "El nombre es obligatorio."));
      if (!id) return errors.push(msgErr(idx, "La ID es obligatoria."));
      if (!/^\d{4}-\d{4}-\d{5}$/.test(id))
        return errors.push(
          msgErr(idx, `ID inválida: "${id}" (ej: 0801-1998-05788)`)
        );
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return errors.push(msgErr(idx, `Email inválido: "${email}"`));
      if (!METODOS.includes(metodo))
        return errors.push(
          msgErr(
            idx,
            `Método preferido inválido: "${get("metodo")}". Usa: ${METODOS.join(
              ", "
            )}`
          )
        );
      const edad = edadRaw ? Number(edadRaw) : "";
      if (edadRaw && (Number.isNaN(edad) || edad < 0 || edad > 120))
        return errors.push(msgErr(idx, `Edad inválida: "${edadRaw}"`));

      if (nuevos.some((x) => x.id === id) || data.some((x) => x.id === id)) {
        return errors.push(msgErr(idx, `ID duplicada: "${id}"`));
      }

      nuevos.push({
        id,
        nombre,
        telefono,
        email,
        metodo,
        ocupacion,
        edad,
        direccion,
      });
      ok++;
    });

    if (ok > 0) {
      setData((prev) => [...nuevos, ...prev]);
      resetToFirstPage();
    }

    if (errors.length === 0) {
      alert(`Importación completada: ${ok} cliente(s) agregado(s).`);
    } else {
      const firstErrors = errors.slice(0, 10).join("\n");
      alert(
        `Importación: ${ok} agregado(s), ${errors.length} error(es).\n\n` +
          firstErrors +
          (errors.length > 10 ? `\n... +${errors.length - 10} errores más` : "")
      );
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold">Clientes</h1>
        <div className="flex flex-wrap items-center gap-2">
          {/* Nuevo cliente (form individual) */}
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

          {/* Importar CSV */}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100">
            <IconUpload className="h-4 w-4" />
            Importar CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => handleImportCsv(e.target.files?.[0])}
            />
          </label>

          {/* Descargar plantilla */}
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100"
            title="Descargar plantilla CSV"
          >
            <IconDownload className="h-4 w-4" />
            Plantilla
          </button>

          {/* Descargar datos (tabla filtrada) */}
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
      <p className="mt-2 text-sm text-gray-600">
        Descarga la plantilla de ejemplo y úsala para subir varios clientes a la
        vez.
      </p>

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
              placeholder="Buscar por nombre, email, teléfono"
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
        <table className="min-w-[1000px] w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              <Th>Nombre</Th>
              <Th>Teléfono</Th>
              <Th>Email</Th>
              <Th>Método</Th>
              <Th>Ocupación</Th>
              <Th>ID</Th>
              <Th>Edad</Th>
              <Th>Dirección</Th>
              <Th className="text-right pr-4">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-neutral-500">
                  No hay resultados con los filtros actuales.
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
                <Td>{row.ocupacion}</Td>
                <Td className="font-mono">{row.id}</Td>
                <Td>{row.edad}</Td>
                <Td className="truncate">{row.direccion}</Td>
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
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 text-red-600 hover:bg-red-50"
                      title="Eliminar"
                    >
                      <IconTrash className="h-4 w-4" />
                      <span className="hidden sm:inline">Eliminar</span>
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
                label="Teléfono"
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
                label="Ocupación"
                value={form.ocupacion}
                onChange={(v) => setForm((f) => ({ ...f, ocupacion: v }))}
                placeholder="Profesión / Cargo"
              />
              <TextField
                label="ID (Honduras) *"
                value={form.id}
                onChange={(v) => setForm((f) => ({ ...f, id: v }))}
                placeholder="0801-1998-05788"
              />
              <TextField
                label="Edad"
                type="number"
                value={form.edad}
                onChange={(v) => setForm((f) => ({ ...f, edad: v }))}
                placeholder="Ej. 32"
              />
              <TextField
                className="md:col-span-2"
                label="Dirección"
                value={form.direccion}
                onChange={(v) => setForm((f) => ({ ...f, direccion: v }))}
                placeholder="Dirección completa"
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
              * Campos obligatorios. Formato de ID: <code>0801-AAAA-NNNNN</code>
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
function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}) {
  return (
    <label className={cnField("block", className)}>
      <span className="mb-1 block text-xs text-neutral-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
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
            {capitalizar(o)}
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

// Descarga CSV con UTF-8 BOM para que Excel/Sheets respeten acentos/ñ
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

function normalizeHeader(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}
// Mapea encabezados del CSV a llaves internas
function mapColumns(headers) {
  const h = headers.map(normalizeHeader);
  const idx = (aliases) => {
    for (const a of aliases) {
      const i = h.indexOf(a);
      if (i !== -1) return i;
    }
    return undefined;
  };
  return {
    nombre: idx(["nombre"]),
    telefono: idx(["telefono", "teléfono"]),
    email: idx(["email", "correo"]),
    metodo: idx(["metodo preferido", "metodo", "método preferido", "método"]),
    ocupacion: idx(["ocupacion", "ocupación"]),
    id: idx(["id", "identidad", "dni"]),
    edad: idx(["edad"]),
    direccion: idx(["direccion", "dirección"]),
  };
}
function requeridaHumana(key) {
  const map = { nombre: "Nombre", id: "ID" };
  return map[key] || key;
}
function msgErr(idx, text) {
  return `Fila ${idx + 2}: ${text}`; // +1 encabezado +1 base 1
}
function parseCsv(text) {
  // Soporta comillas y comas dentro de comillas. Delimitador coma.
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line) => {
    const out = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++; // escapado
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out;
  };

  const headers = parseLine(lines[0]).map((h) => h.trim());
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}
function capitalizar(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
