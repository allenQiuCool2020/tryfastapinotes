"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { StatusBanner } from "@/components/ui/status-banner";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import type { NoteCreateInput, NoteUpdateInput } from "@/types/api";

const noteSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  weather: z.string().optional(),
  summary: z.string().optional(),
});

type NoteFormValues = z.infer<typeof noteSchema>;

type NoteFormProps = {
  initialValues?: Partial<NoteCreateInput>;
  submitLabel: string;
  onSubmit: (values: NoteUpdateInput) => Promise<void>;
  serverError?: ApiError | null;
  isSubmitting?: boolean;
};

export function NoteForm({
  initialValues,
  submitLabel,
  onSubmit,
  serverError,
  isSubmitting = false,
}: NoteFormProps) {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      content: initialValues?.content ?? "",
      weather: initialValues?.weather ?? "",
      summary: initialValues?.summary ?? "",
    },
  });

  return (
    <form
      className="space-y-5 rounded-[32px] border border-border bg-card p-6 shadow-note sm:p-8"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit({
          ...values,
          weather: values.weather || null,
          summary: values.summary || null,
        });
      })}
    >
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Compose</p>
        <h1 className="font-serif text-4xl font-bold text-ink">{submitLabel}</h1>
      </div>

      {serverError ? <StatusBanner tone="error">{serverError.message}</StatusBanner> : null}

      <FormField label="Title" error={form.formState.errors.title?.message || serverError?.fieldErrors.title}>
        <Input {...form.register("title")} placeholder="A memory worth keeping" />
      </FormField>

      <FormField
        label="Summary"
        error={form.formState.errors.summary?.message || serverError?.fieldErrors.summary}
      >
        <Input {...form.register("summary")} placeholder="One-sentence snapshot" />
      </FormField>

      <FormField
        label="Weather"
        error={form.formState.errors.weather?.message || serverError?.fieldErrors.weather}
      >
        <Input {...form.register("weather")} placeholder="sunny, rainy, windy..." />
      </FormField>

      <FormField
        label="Content"
        error={form.formState.errors.content?.message || serverError?.fieldErrors.content}
      >
        <Textarea {...form.register("content")} placeholder="Write the full note here." />
      </FormField>

      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
