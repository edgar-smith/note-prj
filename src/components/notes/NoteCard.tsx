"use client";

import { useState } from "react";
import { Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Note } from "@/types/note";

interface NoteCardProps {
  note: Note;
  onDelete: (note: Note) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const [hovered, setHovered] = useState(false);

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

  return (
    <Card
      className="flex flex-col transition-shadow hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight line-clamp-2">
            {note.title}
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
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
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-muted-foreground transition-opacity ${
            hovered ? "opacity-100" : "opacity-0"
          } hover:text-destructive hover:bg-destructive/10`}
          onClick={() => onDelete(note)}
          aria-label={`Supprimer "${note.title}"`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
