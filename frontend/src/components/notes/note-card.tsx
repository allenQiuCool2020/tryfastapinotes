import Link from "next/link";
import type { Note } from "@/types/api";
import { formatDate, weatherTone } from "@/lib/utils";

export function NoteCard({ note }: { note: Note }) {
  return (
    <article className="group rotate-[-0.4deg] rounded-[28px] border border-border bg-card p-6 shadow-note transition hover:-translate-y-1 hover:rotate-0">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink/60">
        <span className={`rounded-full px-3 py-1 font-semibold ${weatherTone(note.weather)}`}>
          {note.weather || "No weather tag"}
        </span>
        <span>{formatDate(note.created_at)}</span>
      </div>
      <div className="space-y-3">
        <h3 className="font-serif text-2xl font-bold text-ink">{note.title}</h3>
        {note.summary ? <p className="text-sm leading-6 text-ink/80">{note.summary}</p> : null}
        <p className="line-clamp-4 text-sm leading-7 text-ink/75">{note.content}</p>
      </div>
      <Link
        href={`/notes/${note.id}`}
        className="mt-6 inline-flex items-center text-sm font-semibold text-brand transition group-hover:translate-x-1"
      >
        Read note
      </Link>
    </article>
  );
}
