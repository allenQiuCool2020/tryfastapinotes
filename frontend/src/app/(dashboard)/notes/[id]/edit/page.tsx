"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedPageGate } from "@/components/auth/protected-page-gate";
import { Shell } from "@/components/layout/shell";
import { NoteForm } from "@/components/notes/note-form";
import { StatusBanner } from "@/components/ui/status-banner";
import { ApiError } from "@/lib/api/client";
import { getNote, updateNote } from "@/lib/api/notes";
import { useAuth } from "@/state/auth-context";

export default function EditNotePage() {
  const params = useParams<{ id: string }>();
  const noteId = Number(params.id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, user } = useAuth();

  const noteQuery = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNote(noteId),
    enabled: Number.isFinite(noteId),
  });

  const mutation = useMutation({
    mutationFn: async (values: { title?: string; content?: string; weather?: string | null; summary?: string | null }) => {
      if (!token) {
        throw new ApiError(401, "Please log in to edit a note.");
      }
      return updateNote(noteId, values, token);
    },
    onSuccess: async (note) => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      await queryClient.invalidateQueries({ queryKey: ["note", noteId] });
      router.push(`/notes/${note.id}`);
    },
  });

  const isOwner = noteQuery.data && user ? noteQuery.data.created_by === user.id : false;

  return (
    <Shell>
      <ProtectedPageGate>
        {noteQuery.isLoading ? <StatusBanner>Loading note...</StatusBanner> : null}
        {noteQuery.isError ? <StatusBanner tone="error">This note could not be loaded for editing.</StatusBanner> : null}
        {noteQuery.data && !isOwner ? (
          <StatusBanner tone="error">You can only edit notes that you created.</StatusBanner>
        ) : null}
        {noteQuery.data && isOwner ? (
          <div className="mx-auto max-w-3xl">
            <NoteForm
              submitLabel="Update note"
              initialValues={noteQuery.data}
              onSubmit={async (values) => {
                await mutation.mutateAsync(values);
              }}
              serverError={mutation.error instanceof ApiError ? mutation.error : null}
              isSubmitting={mutation.isPending}
            />
          </div>
        ) : null}
      </ProtectedPageGate>
    </Shell>
  );
}
