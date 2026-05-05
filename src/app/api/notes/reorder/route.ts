import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/notes/reorder
// Body: { ids: string[] } — ordered list of note IDs
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { ids } = body as { ids: string[] };

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  }

  // Verify all notes belong to the current user
  const notes = await prisma.note.findMany({
    where: { id: { in: ids }, userId: session.user.id },
    select: { id: true },
  });

  if (notes.length !== ids.length) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.note.update({ where: { id }, data: { position: index } })
    )
  );

  return NextResponse.json({ success: true });
}
