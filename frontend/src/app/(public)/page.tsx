"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { NotesGrid } from "@/components/notes/notes-grid";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/ui/status-banner";
import { Shell } from "@/components/layout/shell";
import { listNotes } from "@/lib/api/notes";

export default function HomePage() {
  const notesQuery = useQuery({
    queryKey: ["notes", "home"],
    queryFn: () => listNotes({ skip: 0, limit: 3, orderBy: "created_at" }),
  });

  return (
    <Shell>
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.25em] text-ink/50">Public notes. Private authorship.</p>
          <h1 className="max-w-3xl font-serif text-5xl font-bold leading-tight text-ink sm:text-6xl">
            Capture weather, memory, and quiet details in a notes app built for browsing first.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-ink/75">
            Read public notes freely, then sign in when you want to leave your own field notes behind.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/notes">
              <Button>Browse notes</Button>
            </Link>
            <Link href="/notes/new">
              <Button variant="ghost">Write a note</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-[36px] border border-border bg-card p-6 shadow-note">
          <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Why this setup works</p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-ink/75">
            <p>Public reads stay frictionless, so the first visit already feels alive.</p>
            <p>FastAPI keeps auth and ownership rules on the backend, while this frontend focuses on pages, forms, and flow.</p>
            <p>The result is a simple full-stack split that is easy to keep growing.</p>
          </div>
        </div>
      </section>

      <section className="mt-14 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Recent notes</p>
            <h2 className="font-serif text-3xl font-bold text-ink">Latest public entries</h2>
          </div>
          <Link href="/notes" className="text-sm font-semibold text-brand">
            View all notes
          </Link>
        </div>

        {notesQuery.isLoading ? <StatusBanner>Loading recent notes...</StatusBanner> : null}
        {notesQuery.isError ? (
          <StatusBanner tone="error">The notes feed is unavailable right now. Check that the FastAPI app is running.</StatusBanner>
        ) : null}
        {notesQuery.data ? <NotesGrid notes={notesQuery.data} /> : null}
      </section>
    </Shell>
  );
}
