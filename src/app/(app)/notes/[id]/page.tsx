"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import type { Note } from "@/types/note";

async function fetchNote(id: string): Promise<Note> {
  const res = await fetch(`/api/notes/${id}`);
  if (!res.ok) throw new Error("Note introuvable");
  return res.json();
}

export default function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [id, setId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const { isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNote(id),
    enabled: !!id,
    staleTime: 0,
    refetchOnWindowFocus: false,
    select: (note) => {
      setTitle((prev) => (prev === "" ? note.title : prev));
      setContent((prev) => (prev === "" ? note.content : prev));
      return note;
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", id] });
      setIsDirty(false);
    },
  });

  function handleTitleChange(val: string) {
    setTitle(val);
    setIsDirty(true);
  }

  function handleContentChange(val: string) {
    setContent(val);
    setIsDirty(true);
  }

  if (isLoading || !id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">Note introuvable.</p>
        <Link href="/notes" className={buttonVariants({ variant: "outline" })}>
          Retour
        </Link>
      </div>
    );
  }

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
          <h1 className="font-semibold text-lg flex-1 truncate">
            {title || "Note sans titre"}
          </h1>
          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="text-xs text-muted-foreground">Non sauvegardé</span>
            )}
            <Button
              onClick={() => mutate()}
              disabled={isPending || !title.trim() || !content.trim()}
              size="sm"
            >
              {isPending ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Titre de la note..."
              required
              className="text-lg h-11"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Contenu</Label>
            <MarkdownEditor value={content} onChange={handleContentChange} />
          </div>

          {error && (
            <p className="text-sm text-destructive">{(error as Error).message}</p>
          )}
        </form>
      </main>
    </div>
  );
}
