"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProtectedPageGate } from "@/components/auth/protected-page-gate";
import { Shell } from "@/components/layout/shell";
import { NoteForm } from "@/components/notes/note-form";
import { createNote } from "@/lib/api/notes";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/state/auth-context";

export default function NewNotePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const mutation = useMutation({
    mutationFn: async (values: { title?: string; content?: string; weather?: string | null; summary?: string | null }) => {
      if (!token) {
        throw new ApiError(401, "Please log in to create a note.");
      }
      return createNote(
        {
          title: values.title ?? "",
          content: values.content ?? "",
          weather: values.weather ?? null,
          summary: values.summary ?? null,
        },
        token,
      );
    },
    onSuccess: async (note) => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push(`/notes/${note.id}`);
    },
  });

  return (
    <Shell>
      <ProtectedPageGate>
        <div className="mx-auto max-w-3xl">
          <NoteForm
            submitLabel="Create note"
            onSubmit={async (values) => {
              await mutation.mutateAsync(values);
            }}
            serverError={mutation.error instanceof ApiError ? mutation.error : null}
            isSubmitting={mutation.isPending}
          />
        </div>
      </ProtectedPageGate>
    </Shell>
  );
}
