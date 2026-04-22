"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AuthForm } from "@/components/auth/auth-form";
import { Shell } from "@/components/layout/shell";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/state/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: storeLogin } = useAuth();
  const nextPath = searchParams.get("next") || "/notes";

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (result) => {
      await storeLogin(result.access_token);
      router.push(nextPath);
    },
  });

  return (
    <Shell>
      <div className="mx-auto max-w-xl space-y-5">
        <AuthForm
          title="Welcome back"
          subtitle="Sign in with your FastAPI account to create, edit, and delete your own notes."
          submitLabel="Login"
          onSubmit={async (values) => {
            await mutation.mutateAsync(values);
          }}
          error={mutation.error instanceof ApiError ? mutation.error : null}
          isSubmitting={mutation.isPending}
        />
        <p className="text-center text-sm text-ink/70">
          Need an account?{" "}
          <Link href="/register" className="font-semibold text-brand">
            Register here
          </Link>
          .
        </p>
      </div>
    </Shell>
  );
}
