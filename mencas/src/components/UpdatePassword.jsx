// src/components/UpdatePassword.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import logo from "/mencasIcono.png";

const BRAND = "rgb(34,128,62)";
const API_BASE = import.meta.env.VITE_API_URL;

function getStorage() {
  return localStorage.getItem("rememberMe") === "1" ? localStorage : sessionStorage;
}
function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}
function getAuth() {
  const storage = getStorage();
  const accessToken = storage.getItem("accessToken");
  const idToken = storage.getItem("idToken");
  const payload = idToken ? decodeJwtPayload(idToken) : null;
  const emailFromToken = payload?.email || null;
  const exp = Number(storage.getItem("tokenExp") || 0);
  return { accessToken, emailFromToken, exp };
}
function isExpired(exp, skewSeconds = 30) {
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return now >= exp - skewSeconds;
}

export default function UpdatePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, emailFromToken, exp } = getAuth();

  const presetEmail = location.state?.email || emailFromToken || "";

  const [form, setForm] = useState({
    email: presetEmail,
    currentPassword: "",
    confirmCurrentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");

  useEffect(() => {
    if (accessToken && isExpired(exp)) {
      navigate("/login", { replace: true });
    }
  }, [accessToken, exp, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!form.email) err.email = "Ingresa tu correo";

    if (emailFromToken && form.email && emailFromToken !== form.email) {
      err.email = "El correo no coincide con el usuario autenticado.";
    }

    if (!form.currentPassword) err.currentPassword = "Ingresa tu contraseña actual";
    if (!form.confirmCurrentPassword) err.confirmCurrentPassword = "Confirma tu contraseña actual";
    if (
      form.currentPassword &&
      form.confirmCurrentPassword &&
      form.currentPassword !== form.confirmCurrentPassword
    ) {
      err.confirmCurrentPassword = "La contraseña actual no coincide";
    }

    if (!form.newPassword) err.newPassword = "Ingresa tu nueva contraseña";
    if (form.newPassword && form.newPassword.length < 8)
      err.newPassword = "La nueva contraseña debe tener al menos 8 caracteres";
    if (form.newPassword && form.currentPassword && form.newPassword === form.currentPassword)
      err.newPassword = "La nueva contraseña no debe ser igual a la actual";

    if (!form.confirmNewPassword) err.confirmNewPassword = "Confirma tu nueva contraseña";
    if (form.newPassword && form.confirmNewPassword && form.newPassword !== form.confirmNewPassword)
      err.confirmNewPassword = "Las contraseñas nuevas no coinciden";
    return err;
  };

  const strength = useMemo(() => {
    const p = form.newPassword || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }, [form.newPassword]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    try {
      setLoading(true);

      // Normaliza entradas
      let email = (form.email || "").trim();
      const current = (form.currentPassword || "").trim();
      const next = (form.newPassword || "").trim();

      // ⚠️ Si tu backend espera el email en minúsculas, descomenta:
      // email = email.toLowerCase();

      // 1) Verificar contraseña ACTUAL intentando login
      const verifyBody = JSON.stringify({ user: email, password: current });
      console.debug("[VERIFY LOGIN] body:", verifyBody);

      const verifyRes = await fetch(`${API_BASE}/login/cognitoLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: verifyBody,
      });

      const verifyText = await verifyRes.text();
      let verifyData = {};
      try {
        verifyData = verifyText ? JSON.parse(verifyText) : {};
      } catch {}
      console.debug("[VERIFY LOGIN] status:", verifyRes.status);
      console.debug("[VERIFY LOGIN] raw:", verifyText);
      console.debug("[VERIFY LOGIN] parsed:", verifyData);

      // Criterios de validez ampliados
      const validCurrent =
        verifyRes.ok &&
        (
          verifyData?.passwordReset === true || // reto de cambio (contraseña válida)
          !!verifyData?.AccessToken ||
          !!verifyData?.IdToken ||
          verifyData?.authenticated === true ||
          verifyData?.ok === true ||
          verifyData?.status === "OK"
        );

      if (!validCurrent) {
        const backendMsg = verifyData?.message || verifyData?.error;
        throw new Error(backendMsg || "La contraseña actual no es válida.");
      }

      // 2) Establecer NUEVA contraseña
      const headers = { "Content-Type": "application/json" };
      if (accessToken && !isExpired(exp)) headers["Authorization"] = `Bearer ${accessToken}`;

      const setRes = await fetch(`${API_BASE}/login/setPassword`, {
        method: "POST",
        headers,
        body: JSON.stringify({ user: email, password: next }),
      });

      const setText = await setRes.text();
      let setData = {};
      try {
        setData = setText ? JSON.parse(setText) : {};
      } catch {}
      console.debug("[SET PASSWORD] status:", setRes.status);
      console.debug("[SET PASSWORD] raw:", setText);
      console.debug("[SET PASSWORD] parsed:", setData);

      if (!setRes.ok) {
        const backendMsg = setData?.message || setData?.error || "No se pudo actualizar la contraseña.";
        throw new Error(backendMsg);
      }

      setServerMsg("Contraseña actualizada correctamente ✅ Redirigiendo…");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (error) {
      setServerMsg(error?.message || "No se pudo actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[100svh] flex items-center justify-center py-16 bg-white text-gray-900">
      <div className="w-full max-w-md px-6">
        <div className="rounded-2xl border border-emerald-100 bg-white/85 backdrop-blur-xl shadow-xl">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Mencas" className="h-12 w-12" />
              <div>
                <h1 className="text-xl font-bold">Restablecer contraseña</h1>
                <p className="text-sm text-gray-600">
                  Confirma tu contraseña actual y crea una nueva para continuar.
                </p>
              </div>
            </div>

            {serverMsg && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {serverMsg}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Correo
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={onChange}
                  disabled={!!emailFromToken || !!location.state?.email}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 outline-none
                             focus:ring-2 focus:ring-[rgb(34,128,62)] focus:border-[rgb(34,128,62)] transition disabled:bg-gray-100"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Actual + confirmación */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium">
                  Contraseña actual
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.currentPassword}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 outline-none
                             focus:ring-2 focus:ring-[rgb(34,128,62)] focus:border-[rgb(34,128,62)] transition"
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmCurrentPassword" className="block text-sm font-medium">
                  Confirmar contraseña actual
                </label>
                <input
                  id="confirmCurrentPassword"
                  name="confirmCurrentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmCurrentPassword}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 outline-none
                             focus:ring-2 focus:ring-[rgb(34,128,62)] focus:border-[rgb(34,128,62)] transition"
                />
                {errors.confirmCurrentPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmCurrentPassword}</p>
                )}
              </div>

              {/* Nueva + confirmación */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium">
                  Nueva contraseña
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.newPassword}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 outline-none
                             focus:ring-2 focus:ring-[rgb(34,128,62)] focus:border-[rgb(34,128,62)] transition"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>
                )}
                <div className="mt-2 h-1.5 w-full rounded bg-gray-200">
                  <div
                    className="h-1.5 rounded"
                    style={{
                      width: `${(strength / 5) * 100}%`,
                      background: BRAND,
                      transition: "width .2s ease",
                    }}
                    aria-hidden
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-500 flex items-center gap-1">
                  <Lock size={12} /> Usa 8+ caracteres, mayúsculas, minúsculas, números y símbolos.
                </p>
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium">
                  Confirmar nueva contraseña
                </label>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmNewPassword}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 outline-none
                             focus:ring-2 focus:ring-[rgb(34,128,62)] focus:border-[rgb(34,128,62)] transition"
                />
                {errors.confirmNewPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmNewPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg
                           bg-gradient-to-r from-[rgb(34,128,62)] to-[rgb(30,110,55)]
                           text-white px-4 py-2.5 font-medium shadow-lg hover:shadow-xl
                           hover:scale-[1.01] transition-all duration-300 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Guardando…
                  </>
                ) : (
                  "Guardar contraseña"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
