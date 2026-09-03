import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as authApi from "../api/auth";

const AuthContext =
  createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getMe()
      .then((result) => {
        setUser(result.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login(email, password) {
    const result = await authApi.login({
      email,
      password,
    });

    localStorage.setItem(
      "token",
      result.token
    );

    setUser(result.user);
  }

  async function register(
    name,
    email,
    password
  ) {
    const result =
      await authApi.register({
        name,
        email,
        password,
      });

    localStorage.setItem(
      "token",
      result.token
    );

    setUser(result.user);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

