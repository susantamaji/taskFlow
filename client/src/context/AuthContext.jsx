import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("taskflow_token")) { setLoading(false); return; }
    api.get("/auth/me").then(r => setUser(r.data.user)).catch(() => localStorage.removeItem("taskflow_token")).finally(() => setLoading(false));
  }, []);
  const login = async (identifier, password) => {
    const { data } = await api.post("/auth/login", { identifier, password });
    localStorage.setItem("taskflow_token", data.token); setUser(data.user); return data;
  };
  const logout = () => { localStorage.removeItem("taskflow_token"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
