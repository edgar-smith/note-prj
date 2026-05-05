"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";
import "@uiw/react-markdown-preview/markdown.css";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

interface NotePreviewDrawerProps {
  note: Note | null;
  onClose: () => void;
}

export function NotePreviewDrawer({ note, onClose }: NotePreviewDrawerProps) {
  const formattedDate = note
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(note.updatedAt))
    : "";

  return (
    <Sheet open={!!note} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col overflow-hidden">
        <SheetHeader className="shrink-0 pb-4 border-b">
          <SheetTitle className="pr-6 leading-snug">{note?.title}</SheetTitle>
          <div className="flex items-center justify-between mt-1">
            <Badge variant="secondary" className="text-xs font-normal">
              Modifié le {formattedDate}
            </Badge>
            {note && (
              <Link
                href={`/notes/${note.id}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "gap-1.5"
                )}
                onClick={onClose}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Éditer
              </Link>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {note?.content ? (
            <MarkdownPreview
              source={note.content}
              data-color-mode="light"
              style={{ background: "transparent", padding: 0 }}
            />
          ) : (
            <p className="text-muted-foreground text-sm">Note vide.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
