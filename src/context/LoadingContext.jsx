"use client";
import { createContext, useContext, useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [state, setState] = useState({ visible: false, text: "Cargando..." });

  const showLoading = (text = "Cargando...") =>
    setState({ visible: true, text });

  const hideLoading = () =>
    setState((prev) => ({ ...prev, visible: false }));

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      <LoadingOverlay visible={state.visible} text={state.text} />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading debe usarse dentro de <LoadingProvider>");
  return ctx;
}
