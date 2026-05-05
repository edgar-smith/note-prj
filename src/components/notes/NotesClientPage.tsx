"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { NoteList } from "@/components/notes/NoteList";
import { SignOutButton } from "@/components/notes/SignOutButton";
import { LayoutModeSelector } from "@/components/notes/LayoutModeSelector";
import { useLayoutMode } from "@/hooks/useLayoutMode";

interface NotesClientPageProps {
  userName: string;
}

export function NotesClientPage({ userName }: NotesClientPageProps) {
  const { mode: layoutMode, setMode: setLayoutMode } = useLayoutMode();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <h1 className="font-semibold text-lg shrink-0">Note Manager</h1>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-[160px]">
              {userName}
            </span>
            <LayoutModeSelector mode={layoutMode} onChange={setLayoutMode} />
            <Link href="/notes/new" className={cn(buttonVariants({ size: "sm" }))}>
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle note
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main
        className={cn(
          "px-4 py-8 transition-all duration-300",
          layoutMode === "focus"
            ? "max-w-5xl mx-auto"
            : "max-w-2xl mr-auto ml-4 sm:ml-8"
        )}
      >
        <NoteList layoutMode={layoutMode} />
      </main>
    </div>
  );
}
