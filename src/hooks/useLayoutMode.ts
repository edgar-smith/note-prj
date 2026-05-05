"use client";

import { useState, useEffect } from "react";
export type LayoutMode = "focus" | "split";
const STORAGE_KEY = "note-layout-mode";

export function useLayoutMode() {
  const [mode, setMode] = useState<LayoutMode>("focus");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LayoutMode | null;
    if (saved === "focus" || saved === "split") setMode(saved);
  }, []);

  function setModeAndPersist(m: LayoutMode) {
    setMode(m);
    localStorage.setItem(STORAGE_KEY, m);
  }

  return { mode, setMode: setModeAndPersist };
}
