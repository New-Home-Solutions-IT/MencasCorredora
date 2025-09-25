import { Navigate, Outlet, useLocation } from "react-router-dom";

function isExpired(exp, skewSeconds = 30) {
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return now >= exp - skewSeconds; // margen por desincronización
}

function getTokenState() {
  const storage =
    localStorage.getItem("rememberMe") === "1" ? localStorage : sessionStorage;

  const accessToken = storage.getItem("accessToken");
  const exp = Number(storage.getItem("tokenExp") || 0);

  return { accessToken, exp, storage };
}

export default function PrivateRoute() {
  const { accessToken, exp, storage } = getTokenState();
  const location = useLocation();

  // si no hay token o está expirado, limpia y manda a login
  if (!accessToken || isExpired(exp)) {
    storage.removeItem("accessToken");
    storage.removeItem("idToken");
    storage.removeItem("tokenExp");
    // refreshToken lo dejamos para que el helper lo use
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // hay token válido → deja pasar
  return <Outlet />;
}
