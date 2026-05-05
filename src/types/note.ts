export interface Note {
  id: string;
  title: string;
  content: string;
  position: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
}
