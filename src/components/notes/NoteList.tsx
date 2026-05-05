"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, StickyNote } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { NoteCard } from "@/components/notes/NoteCard";
import { DeleteNoteModal } from "@/components/notes/DeleteNoteModal";
import { NotePreviewDrawer } from "@/components/notes/NotePreviewDrawer";
import { ViewModeToggle } from "@/components/notes/ViewModeToggle";
import { useViewMode } from "@/hooks/useViewMode";
import type { Note } from "@/types/note";
import type { ViewMode } from "@/hooks/useViewMode";

// ── Sortable item wrapper ─────────────────────────────────────
function SortableNoteCard({
  note,
  mode,
  onDelete,
  onPreview,
}: {
  note: Note;
  mode: ViewMode;
  onDelete: (n: Note) => void;
  onPreview: (n: Note) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <NoteCard
        note={note}
        mode={mode}
        onDelete={onDelete}
        onPreview={onPreview}
        dragHandleListeners={listeners}
        dragHandleAttributes={attributes}
        isDragging={isDragging}
      />
    </div>
  );
}

// ── Fetch ──────────────────────────────────────────────────────
async function fetchNotes(): Promise<Note[]> {
  const res = await fetch("/api/notes");
  if (!res.ok) throw new Error("Impossible de charger les notes");
  return res.json();
}

// ── Main component ─────────────────────────────────────────────
export function NoteList() {
  const queryClient = useQueryClient();
  const { mode, setMode } = useViewMode();
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [noteToPreview, setNoteToPreview] = useState<Note | null>(null);
  const [localNotes, setLocalNotes] = useState<Note[] | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { data: serverNotes, isLoading, isError } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
    select: (data) => data,
  });

  const notes = localNotes ?? serverNotes;

  // Sync local state when server data changes (e.g. after delete)
  const { mutate: reorder } = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch("/api/notes/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("Erreur lors du réordonnancement");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !notes) return;

      const oldIndex = notes.findIndex((n) => n.id === active.id);
      const newIndex = notes.findIndex((n) => n.id === over.id);
      const reordered = arrayMove(notes, oldIndex, newIndex);

      setLocalNotes(reordered);
      reorder(reordered.map((n) => n.id));
    },
    [notes, reorder]
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Erreur lors du chargement des notes.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
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

  const isGrid = mode === "grid";
  const strategy = isGrid ? rectSortingStrategy : verticalListSortingStrategy;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {notes.length} note{notes.length > 1 ? "s" : ""}
        </p>
        <ViewModeToggle mode={mode} onChange={setMode} />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={notes.map((n) => n.id)} strategy={strategy}>
          <div
            className={
              isGrid
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "flex flex-col gap-2"
            }
          >
            {notes.map((note) => (
              <SortableNoteCard
                key={note.id}
                note={note}
                mode={mode}
                onDelete={setNoteToDelete}
                onPreview={setNoteToPreview}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <DeleteNoteModal
        note={noteToDelete}
        onClose={() => {
          setNoteToDelete(null);
          setLocalNotes(null);
        }}
      />
      <NotePreviewDrawer
        note={noteToPreview}
        onClose={() => setNoteToPreview(null)}
      />
    </>
  );
}
