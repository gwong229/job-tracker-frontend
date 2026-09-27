import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      // Prime the CSRF cookie first, so it's available before any
      // state-changing request (including a possible login) happens.
      await apiClient.get("/csrf").catch(() => {});

      // Then check if a valid jwt cookie already exists from a previous
      // session (e.g. the user refreshed the page while logged in).
      try {
        const response = await apiClient.get("/auth/me");
        setUser(response.data);
      } catch {
        setUser(null); // no valid session — that's fine, just means logged out
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  async function login(email, password) {
    const response = await apiClient.post("/auth/login", { email, password });
    setUser(response.data);
  }

  async function register(username, email, password) {
    const response = await apiClient.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  }

  async function logout() {
    await apiClient.post("/auth/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
