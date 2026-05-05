import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NotesClientPage } from "@/components/notes/NotesClientPage";

export default async function NotesPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <NotesClientPage userName={session.user?.name || session.user?.email || ""} />;
}
