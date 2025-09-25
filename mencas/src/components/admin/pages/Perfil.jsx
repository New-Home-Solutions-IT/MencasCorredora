import React, { useState } from "react";
import {
  IconPencil, IconDeviceFloppy, IconX,
  IconEye, IconEyeOff, IconLock
} from "@tabler/icons-react";

const BRAND = "rgb(34,128,62)";

//Cognito
const MOCK_USER = {
  nombre: "Mariel Méndez",
  email: "mariel@example.com", 
  telefono: "+504 9999-1111",
};

export default function Perfil() {
  const [user, setUser] = useState(MOCK_USER);
  const [form, setForm] = useState(MOCK_USER);
  const [editing, setEditing] = useState(false);

  //cambiar contraseña
  const [pwd, setPwd] = useState({
    current: "",
    next: "",
    confirm: "",
    showCurrent: false,
    showNext: false,
    showConfirm: false,
  });
  const [pwdBusy, setPwdBusy] = useState(false);

  function startEdit() {
    setForm(user);
    setEditing(true);
  }
  function cancelEdit() {
    setForm(user);
    setEditing(false);
  }

  function handleSave(e) {
    e.preventDefault();
    if (!form.nombre.trim()) return alert("El nombre es obligatorio.");
    if (form.telefono && !/^\+?\d[\d\s\-()]{6,}$/.test(form.telefono))
      return alert("Teléfono inválido.");

    //integrar API (PUT/PATCH)
    setUser((prev) => ({
      ...prev,
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
    }));
    setEditing(false);
    alert("Perfil actualizado.");
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    // Validaciones
    if (!pwd.current) return alert("Ingresa tu contraseña actual.");
    if (!pwd.next) return alert("Ingresa la nueva contraseña.");
    if (pwd.next.length < 1) return alert("La nueva contraseña debe tener al menos 8 caracteres.");
    // una letra y un número
    if (!/[A-Za-z]/.test(pwd.next) || !/\d/.test(pwd.next))
      return alert("La nueva contraseña debe incluir letras y números.");
    if (pwd.next !== pwd.confirm) return alert("La confirmación no coincide.");

    try {
      setPwdBusy(true);
      await new Promise((r) => setTimeout(r, 600));
      setPwd({ current: "", next: "", confirm: "", showCurrent: false, showNext: false, showConfirm: false });
      alert("Contraseña actualizada.");
    } catch (err) {
      console.error(err);
      alert("No se pudo cambiar la contraseña. Verifica tu contraseña actual.");
    } finally {
      setPwdBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Encabezado + acciones edición de perfil */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Perfil</h1>
        {!editing ? (
          <button
            onClick={startEdit}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100"
          >
            <IconPencil className="h-4 w-4" />
            Editar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={cancelEdit}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-100"
            >
              <IconX className="h-4 w-4" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-[rgb(34,128,62)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              <IconDeviceFloppy className="h-4 w-4" />
              Guardar
            </button>
          </div>
        )}
      </div>

      {/* Formulario Perfil */}
      <form
        onSubmit={handleSave}
        className="rounded-xl border border-neutral-200 bg-white p-4 md:p-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Nombre"
            value={form.nombre}
            onChange={(v) => setForm((f) => ({ ...f, nombre: v }))}
            placeholder="Tu nombre"
            disabled={!editing}
          />
          <Field
            label="Teléfono"
            value={form.telefono}
            onChange={(v) => setForm((f) => ({ ...f, telefono: v }))}
            placeholder="+504 9xxx-xxxx"
            disabled={!editing}
          />
          <Field
            label="Email"
            value={form.email}
            onChange={() => {}}
            placeholder="tu@correo.com"
            disabled={true}
          />
        </div>

        {editing && (
          <div className="mt-6 flex items-center justify-end gap-2 md:hidden">
            <button
              type="button"
              onClick={cancelEdit}
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
        )}
      </form>

      {/* Cambiar contraseña */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <IconLock className="h-4 w-4 text-neutral-500" />
          <h2 className="text-sm font-semibold text-neutral-700">Cambiar contraseña</h2>
        </div>

        <form onSubmit={handleChangePassword} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Contraseña actual */}
          <PasswordField
            label="Contraseña actual"
            value={pwd.current}
            onChange={(v) => setPwd((p) => ({ ...p, current: v }))}
            show={pwd.showCurrent}
            toggleShow={() => setPwd((p) => ({ ...p, showCurrent: !p.showCurrent }))}
          />

          {/* Nueva contraseña */}
          <PasswordField
            label="Nueva contraseña"
            value={pwd.next}
            onChange={(v) => setPwd((p) => ({ ...p, next: v }))}
            show={pwd.showNext}
            toggleShow={() => setPwd((p) => ({ ...p, showNext: !p.showNext }))}
          />

          {/* Confirmar nueva (full width en md) */}
          <PasswordField
            className="md:col-span-2"
            label="Confirmar nueva contraseña"
            value={pwd.confirm}
            onChange={(v) => setPwd((p) => ({ ...p, confirm: v }))}
            show={pwd.showConfirm}
            toggleShow={() => setPwd((p) => ({ ...p, showConfirm: !p.showConfirm }))}
          />

          <div className="md:col-span-2 mt-1 text-xs text-neutral-500">
            La contraseña debe tener al menos 8 caracteres e incluir letras y números.
          </div>

          <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                setPwd({ current: "", next: "", confirm: "", showCurrent: false, showNext: false, showConfirm: false })
              }
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-100"
              disabled={pwdBusy}
            >
              Limpiar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[rgb(34,128,62)] px-3 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              disabled={pwdBusy}
            >
              {pwdBusy ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </div>
        </form>
      </div>

      {/* Resumen */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">Resumen</h2>
        <ul className="text-sm text-neutral-700">
          <li className="flex items-center justify-between border-b py-2">
            <span className="text-neutral-500">Nombre</span>
            <span className="font-medium">{user.nombre}</span>
          </li>
          <li className="flex items-center justify-between border-b py-2">
            <span className="text-neutral-500">Email</span>
            <span className="font-medium">{user.email}</span>
          </li>
          <li className="flex items-center justify-between py-2">
            <span className="text-neutral-500">Teléfono</span>
            <span className="font-medium">{user.telefono || "—"}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ---------- Componentes reutilizables ---------- */
function Field({ label, value, onChange, placeholder, disabled = false }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-neutral-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
          disabled
            ? "border-neutral-200 bg-neutral-50 text-neutral-500"
            : "border-neutral-200 focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
        }`}
      />
    </label>
  );
}

function PasswordField({ label, value, onChange, show, toggleShow, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs text-neutral-500">{label}</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 pr-9 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
          placeholder="••••••••"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-500 hover:bg-neutral-100"
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          tabIndex={-1}
        >
          {show ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}
