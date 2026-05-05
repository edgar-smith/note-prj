import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { NoteList } from "@/components/notes/NoteList";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/notes/SignOutButton";
import { cn } from "@/lib/utils";

export default async function NotesPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-semibold text-lg">Note Manager</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session?.user?.name || session?.user?.email}
            </span>
            <Link href="/notes/new" className={cn(buttonVariants({ size: "sm" }))}>
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle note
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <NoteList />
      </main>
    </div>
  );
}
