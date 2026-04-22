import type { Note } from "@/types/api";
import { NoteCard } from "@/components/notes/note-card";

export function NotesGrid({ notes }: { notes: Note[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
