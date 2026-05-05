"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";
import "@uiw/react-markdown-preview/markdown.css";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

interface NoteFullscreenModalProps {
  note: Note | null;
  onClose: () => void;
}

export function NoteFullscreenModal({ note, onClose }: NoteFullscreenModalProps) {
  if (!note) return null;

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(note.updatedAt));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 bg-background rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b shrink-0">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold leading-snug">{note.title}</h2>
            <Badge variant="secondary" className="text-xs font-normal mt-1">
              Modifié le {formattedDate}
            </Badge>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/notes/${note.id}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
              onClick={onClose}
            >
              <Pencil className="h-3.5 w-3.5" />
              Éditer
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Fermer"
              className="text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {note.content ? (
            <MarkdownPreview
              source={note.content}
              data-color-mode="light"
              style={{ background: "transparent", padding: 0 }}
            />
          ) : (
            <p className="text-muted-foreground text-sm">Note vide.</p>
          )}
        </div>
      </div>
    </div>
  );
}
