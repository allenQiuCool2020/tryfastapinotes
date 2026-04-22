"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { StatusBanner } from "@/components/ui/status-banner";
import { ApiError } from "@/lib/api/client";

const authSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

type AuthValues = z.infer<typeof authSchema>;

type AuthFormProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  onSubmit: (values: AuthValues) => Promise<void>;
  error?: ApiError | null;
  isSubmitting?: boolean;
};

export function AuthForm({
  title,
  subtitle,
  submitLabel,
  onSubmit,
  error,
  isSubmitting = false,
}: AuthFormProps) {
  const form = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <form
      className="space-y-5 rounded-[32px] border border-border bg-card p-6 shadow-note sm:p-8"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Account</p>
        <h1 className="font-serif text-4xl font-bold text-ink">{title}</h1>
        <p className="text-sm leading-6 text-ink/70">{subtitle}</p>
      </div>

      {error ? <StatusBanner tone="error">{error.message}</StatusBanner> : null}

      <FormField
        label="Username"
        error={form.formState.errors.username?.message || error?.fieldErrors.username}
      >
        <Input {...form.register("username")} placeholder="Choose a username" />
      </FormField>

      <FormField
        label="Password"
        error={form.formState.errors.password?.message || error?.fieldErrors.password}
      >
        <Input {...form.register("password")} type="password" placeholder="Enter your password" />
      </FormField>

      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Please wait..." : submitLabel}
      </Button>
    </form>
  );
}
