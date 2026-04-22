"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { deleteNote } from "@/lib/api/notes";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/state/auth-context";

export function DeleteNoteButton({ noteId }: { noteId: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new ApiError(401, "Please log in to delete notes.");
      }
      return deleteNote(noteId, token);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes");
    },
  });

  return (
    <div className="space-y-3">
      {mutation.error instanceof ApiError ? (
        <p className="text-sm text-rose-700">{mutation.error.message}</p>
      ) : null}
      <Button
        variant="danger"
        onClick={() => {
          if (window.confirm("Delete this note? This action cannot be undone.")) {
            mutation.mutate();
          }
        }}
      >
        {mutation.isPending ? "Deleting..." : "Delete note"}
      </Button>
    </div>
  );
}
