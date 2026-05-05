"use client";

import { LayoutGrid, List, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ViewMode } from "@/hooks/useViewMode";

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const modes: { value: ViewMode; icon: React.ReactNode; label: string }[] = [
  { value: "grid", icon: <LayoutGrid className="h-4 w-4" />, label: "Grille" },
  { value: "list", icon: <List className="h-4 w-4" />, label: "Liste" },
  { value: "simple", icon: <AlignJustify className="h-4 w-4" />, label: "Simple" },
];

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 border rounded-lg p-0.5 bg-muted/40">
      {modes.map((m) => (
        <Button
          key={m.value}
          variant={mode === m.value ? "secondary" : "ghost"}
          size="icon"
          className="h-7 w-7"
          onClick={() => onChange(m.value)}
          aria-label={m.label}
          title={m.label}
        >
          {m.icon}
        </Button>
      ))}
    </div>
  );
}
