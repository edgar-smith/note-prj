"use client";

import Link from "next/link";
import { Trash2, Eye, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";
import type { ViewMode } from "@/hooks/useViewMode";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface NoteCardProps {
  note: Note;
  mode: ViewMode;
  onDelete: (note: Note) => void;
  onPreview: (note: Note) => void;
  dragHandleListeners?: SyntheticListenerMap;
  dragHandleAttributes?: DraggableAttributes;
  isDragging?: boolean;
}

export function NoteCard({
  note,
  mode,
  onDelete,
  onPreview,
  dragHandleListeners,
  dragHandleAttributes,
  isDragging = false,
}: NoteCardProps) {
  const preview = note.content
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\n/g, " ")
    .trim()
    .slice(0, 120);

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(note.updatedAt));

  const actions = (
    <div className="flex items-center gap-1 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
        onClick={(e) => { e.preventDefault(); onPreview(note); }}
        aria-label={`Aperçu "${note.title}"`}
      >
        <Eye className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={(e) => { e.preventDefault(); onDelete(note); }}
        aria-label={`Supprimer "${note.title}"`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );

  const dragHandle = (
    <span
      {...dragHandleListeners}
      {...dragHandleAttributes}
      className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground p-1 shrink-0"
      aria-label="Déplacer"
    >
      <GripVertical className="h-4 w-4" />
    </span>
  );

  // ── Simple mode ──────────────────────────────────────────────
  if (mode === "simple") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border bg-card hover:bg-muted/40 transition-colors",
          isDragging && "opacity-40"
        )}
      >
        {dragHandle}
        <Link
          href={`/notes/${note.id}`}
          className="flex-1 min-w-0 text-sm font-medium truncate hover:underline"
        >
          {note.title}
        </Link>
        <Badge variant="secondary" className="text-xs font-normal shrink-0 hidden sm:inline-flex">
          {formattedDate}
        </Badge>
        {actions}
      </div>
    );
  }

  // ── List mode ─────────────────────────────────────────────────
  if (mode === "list") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors",
          isDragging && "opacity-40"
        )}
      >
        {dragHandle}
        <div className="flex-1 min-w-0">
          <Link
            href={`/notes/${note.id}`}
            className="text-sm font-medium hover:underline block truncate"
          >
            {note.title}
          </Link>
          {preview && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{preview}</p>
          )}
        </div>
        <Badge variant="secondary" className="text-xs font-normal shrink-0 hidden sm:inline-flex">
          {formattedDate}
        </Badge>
        {actions}
      </div>
    );
  }

  // ── Grid mode (default) ───────────────────────────────────────
  return (
    <Card
      className={cn(
        "flex flex-col transition-shadow hover:shadow-md",
        isDragging && "opacity-40"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start gap-1">
          {dragHandle}
          <CardTitle className="text-base leading-tight flex-1">
            <Link href={`/notes/${note.id}`} className="hover:underline line-clamp-2">
              {note.title}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        {preview && (
          <p className="text-sm text-muted-foreground line-clamp-3">{preview}</p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-2">
        <Badge variant="secondary" className="text-xs font-normal">
          {formattedDate}
        </Badge>
        {actions}
      </CardFooter>
    </Card>
  );
}
