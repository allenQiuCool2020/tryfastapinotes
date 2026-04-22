"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AuthForm } from "@/components/auth/auth-form";
import { Shell } from "@/components/layout/shell";
import { registerUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function RegisterPage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.push("/login");
    },
  });

  return (
    <Shell>
      <div className="mx-auto max-w-xl space-y-5">
        <AuthForm
          title="Create account"
          subtitle="Register once, then log in to write and manage your own notes."
          submitLabel="Register"
          onSubmit={async (values) => {
            await mutation.mutateAsync(values);
          }}
          error={mutation.error instanceof ApiError ? mutation.error : null}
          isSubmitting={mutation.isPending}
        />
        <p className="text-center text-sm text-ink/70">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-brand">
            Go to login
          </Link>
          .
        </p>
      </div>
    </Shell>
  );
}
