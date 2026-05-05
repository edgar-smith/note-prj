"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { NoteCard } from "@/components/notes/NoteCard";
import { DeleteNoteModal } from "@/components/notes/DeleteNoteModal";
import type { Note } from "@/types/note";

async function fetchNotes(): Promise<Note[]> {
  const res = await fetch("/api/notes");
  if (!res.ok) throw new Error("Impossible de charger les notes");
  return res.json();
}

export function NoteList() {
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const { data: notes, isLoading, isError } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Erreur lors du chargement des notes.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
        <div className="text-center py-24 flex flex-col items-center gap-4">
        <StickyNote className="h-12 w-12 text-muted-foreground" />
        <div>
          <p className="text-lg font-medium">Aucune note pour l&apos;instant</p>
          <p className="text-sm text-muted-foreground mt-1">
            Crée ta première note pour commencer
          </p>
        </div>
        <Link href="/notes/new" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-1" />
          Nouvelle note
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onDelete={setNoteToDelete} />
        ))}
      </div>
      <DeleteNoteModal
        note={noteToDelete}
        onClose={() => setNoteToDelete(null)}
      />
    </>
  );
}
