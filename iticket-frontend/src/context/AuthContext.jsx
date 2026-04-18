import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, authStorage } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => authStorage.get());

  useEffect(() => {
    const stored = authStorage.get();
    if (stored?.token && !auth?.token) {
      setAuth(stored);
    }
  }, []);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== "auth") return;
      setAuth(authStorage.get());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setAuthSession = (authData) => {
    authStorage.set(authData);
    setAuth(authData);
  };

  const logout = () => {
    authStorage.clear();
    setAuth(null);
  };

  const login = async (payload) => {
    const response = await authApi.login(payload);
    setAuthSession(response);
    return response;
  };

  const value = useMemo(
    () => ({
      auth,
      token: auth?.token || "",
      user: auth?.user || null,
      roles: auth?.user?.roles || [],
      isAuthenticated: Boolean(auth?.token),
      setAuthSession,
      login,
      logout
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
