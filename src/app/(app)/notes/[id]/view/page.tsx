"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Pencil } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";
import "@uiw/react-markdown-preview/markdown.css";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

async function fetchNote(id: string): Promise<Note> {
  const res = await fetch(`/api/notes/${id}`);
  if (!res.ok) throw new Error("Note introuvable");
  return res.json();
}

export default function ViewNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNote(id),
    enabled: !!id,
    staleTime: 30_000,
  });

  if (isLoading || !id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">Note introuvable.</p>
        <Link href="/notes" className={buttonVariants({ variant: "outline" })}>
          Retour
        </Link>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(note.updatedAt));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/notes"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-semibold text-lg flex-1 truncate">{note.title}</h1>
          <Link
            href={`/notes/${note.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
          >
            <Pencil className="h-3.5 w-3.5" />
            Éditer
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{note.title}</h2>
          <Badge variant="secondary" className="text-xs font-normal mt-2">
            Modifié le {formattedDate}
          </Badge>
        </div>

        <div className="prose-container">
          {note.content ? (
            <MarkdownPreview
              source={note.content}
              data-color-mode="light"
              style={{ background: "transparent", padding: 0 }}
            />
          ) : (
            <p className="text-muted-foreground">Note vide.</p>
          )}
        </div>
      </main>
    </div>
  );
}
