import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import logo from "/mencasIcono.png";
const SIDE_IMAGE = "/historiaMencas.png";
const BRAND = "rgb(34,128,62)";

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const err = {};
    if (!form.email) err.email = "Ingresa tu correo";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Correo inválido";
    if (!form.password) err.password = "Ingresa tu contraseña";
    return err;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1200));
      alert("Login ok (demo)");
    } catch {
      setErrors({ form: "No pudimos iniciar sesión. Intenta de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[100svh] flex items-center justify-center pt-24 bg-white text-gray-900">
      {/* Marca de agua */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${SIDE_IMAGE})` }}
        aria-hidden
      />
      {/* Overlay para suavizar */}
      <div className="absolute inset-0 bg-white/70" aria-hidden />

      {/* Contenido encima */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-2xl border border-emerald-100 bg-white/85 backdrop-blur-xl shadow-xl">
          <div className="p-6 md:p-8">
            {/* header */}
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Mencas" className="h-12 w-12" />
              <div>
                <h1 className="text-xl font-bold">Bienvenido</h1>
                <p className="text-sm text-gray-600">
                  Inicia sesión para continuar
                </p>
              </div>
            </div>

            {errors.form && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errors.form}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
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
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 outline-none
                             focus:ring-2 focus:ring-[rgb(34,128,62)] focus:border-[rgb(34,128,62)] transition"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Contraseña
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={onChange}
                    className="w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 pr-10 outline-none
                               focus:ring-2 focus:ring-[rgb(34,128,62)] focus:border-[rgb(34,128,62)] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPwd ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={onChange}
                    className="rounded border-gray-300 text-[rgb(34,128,62)] focus:ring-[rgb(34,128,62)]"
                  />
                  Recuérdame
                </label>
                <a
                  href="#"
                  className="text-sm font-medium hover:opacity-80"
                  style={{ color: BRAND }}
                >
                  ¿Olvidaste tu contraseña?
                </a>
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
                    <Loader2 className="animate-spin" size={18} /> Iniciando…
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </form>
            <div className="my-6 flex items-center gap-4 text-xs text-gray-400">
              <div className="h-px flex-1 bg-gray-200" />
              
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-600">
          Al continuar, aceptas nuestros{" "}
          <a href="#" style={{ color: BRAND }}>
            Términos
          </a>{" "}
          y{" "}
          <a href="#" style={{ color: BRAND }}>
            Política de Privacidad
          </a>
          .
        </p>
      </div>
    </main>
  );
}
