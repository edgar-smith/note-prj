"use client";

import React from "react";
import { LayoutTemplate, PanelRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LayoutMode } from "@/hooks/useLayoutMode";

interface LayoutModeSelectorProps {
  mode: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

const layouts: { value: LayoutMode; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "focus",
    label: "Focus",
    description: "Notes centrées, aperçu en overlay",
    icon: <LayoutTemplate className="h-4 w-4" />,
  },
  {
    value: "split",
    label: "Split",
    description: "Notes à gauche, aperçu à droite",
    icon: <PanelRight className="h-4 w-4" />,
  },
];

export function LayoutModeSelector({ mode, onChange }: LayoutModeSelectorProps) {
  const current = layouts.find((l) => l.value === mode)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 h-7 text-sm font-medium text-foreground hover:bg-muted transition-colors focus:outline-none"
      >
        {current.icon}
        <span className="hidden sm:inline">{current.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <p className="px-2 py-1.5 text-xs text-muted-foreground">
          Mode de mise en page
        </p>
        <DropdownMenuSeparator />
        {layouts.map((l) => (
          <DropdownMenuItem
            key={l.value}
            onClick={() => onChange(l.value)}
            className="flex items-start gap-2 py-2"
          >
            <span className="mt-0.5 text-muted-foreground">{l.icon}</span>
            <div>
              <p className="text-sm font-medium leading-none">{l.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{l.description}</p>
            </div>
            {mode === l.value && (
              <span className="ml-auto text-primary text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
