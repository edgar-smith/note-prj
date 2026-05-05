"use client";

import { useState, useEffect } from "react";

export type ViewMode = "grid" | "list" | "simple";

const STORAGE_KEY = "note-view-mode";

export function useViewMode() {
  const [mode, setMode] = useState<ViewMode>("grid");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    if (saved && ["grid", "list", "simple"].includes(saved)) {
      setMode(saved);
    }
  }, []);

  function setModeAndPersist(newMode: ViewMode) {
    setMode(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }

  return { mode, setMode: setModeAndPersist };
}
