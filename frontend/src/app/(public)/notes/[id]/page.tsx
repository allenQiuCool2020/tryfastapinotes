"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Shell } from "@/components/layout/shell";
import { DeleteNoteButton } from "@/components/notes/delete-note-button";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/ui/status-banner";
import { getNote } from "@/lib/api/notes";
import { formatDate, weatherTone } from "@/lib/utils";
import { useAuth } from "@/state/auth-context";

export default function NoteDetailPage() {
  const params = useParams<{ id: string }>();
  const noteId = Number(params.id);
  const { user } = useAuth();

  const noteQuery = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNote(noteId),
    enabled: Number.isFinite(noteId),
  });

  const isOwner = noteQuery.data && user ? noteQuery.data.created_by === user.id : false;

  return (
    <Shell>
      {noteQuery.isLoading ? <StatusBanner>Loading note...</StatusBanner> : null}
      {noteQuery.isError ? <StatusBanner tone="error">We could not find that note.</StatusBanner> : null}

      {noteQuery.data ? (
        <article className="space-y-8 rounded-[36px] border border-border bg-card p-6 shadow-note sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-ink/60">
                <span className={`rounded-full px-3 py-1 font-semibold ${weatherTone(noteQuery.data.weather)}`}>
                  {noteQuery.data.weather || "No weather tag"}
                </span>
                <span>{formatDate(noteQuery.data.created_at)}</span>
              </div>
              <h1 className="font-serif text-5xl font-bold text-ink">{noteQuery.data.title}</h1>
              {noteQuery.data.summary ? (
                <p className="max-w-3xl text-lg leading-8 text-ink/80">{noteQuery.data.summary}</p>
              ) : null}
            </div>

            {isOwner ? (
              <div className="flex flex-wrap gap-3">
                <Link href={`/notes/${noteQuery.data.id}/edit`}>
                  <Button variant="ghost">Edit note</Button>
                </Link>
                <DeleteNoteButton noteId={noteQuery.data.id} />
              </div>
            ) : null}
          </div>

          <div className="prose prose-stone max-w-none text-base leading-8 text-ink/80">
            <p>{noteQuery.data.content}</p>
          </div>
        </article>
      ) : null}
    </Shell>
  );
}
