"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shell } from "@/components/layout/shell";
import { NotesFilterBar } from "@/components/notes/notes-filter-bar";
import { NotesGrid } from "@/components/notes/notes-grid";
import { PaginationControls } from "@/components/notes/pagination-controls";
import { StatusBanner } from "@/components/ui/status-banner";
import { listNotes } from "@/lib/api/notes";

const pageSize = 5;

export default function NotesPage() {
  const [draftWeather, setDraftWeather] = useState("");
  const [weather, setWeather] = useState("");
  const [skip, setSkip] = useState(0);

  const notesQuery = useQuery({
    queryKey: ["notes", { weather, skip, pageSize }],
    queryFn: () => listNotes({ weather: weather || undefined, skip, limit: pageSize, orderBy: "created_at" }),
  });

  return (
    <Shell>
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Archive</p>
          <h1 className="font-serif text-5xl font-bold text-ink">Browse public notes</h1>
          <p className="max-w-2xl text-lg leading-8 text-ink/75">
            Filter by weather, move through pages, and open any note to read the full entry.
          </p>
        </div>

        <NotesFilterBar
          weather={draftWeather}
          onWeatherChange={setDraftWeather}
          onApply={() => {
            setSkip(0);
            setWeather(draftWeather.trim());
          }}
        />

        {notesQuery.isLoading ? <StatusBanner>Loading notes...</StatusBanner> : null}
        {notesQuery.isError ? <StatusBanner tone="error">Unable to load notes right now.</StatusBanner> : null}
        {notesQuery.data?.length === 0 ? (
          <StatusBanner>No notes matched that filter. Try clearing the weather value.</StatusBanner>
        ) : null}
        {notesQuery.data && notesQuery.data.length > 0 ? <NotesGrid notes={notesQuery.data} /> : null}

        <PaginationControls
          skip={skip}
          limit={pageSize}
          hasNextPage={(notesQuery.data?.length ?? 0) === pageSize}
          onPageChange={setSkip}
        />
      </section>
    </Shell>
  );
}
