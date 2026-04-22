"use client";

import Link from "next/link";
import type React from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StatusBanner } from "@/components/ui/status-banner";
import { useAuth } from "@/state/auth-context";

export function ProtectedPageGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isHydrated, pathname, router]);

  if (!isHydrated) {
    return <StatusBanner>Loading your session...</StatusBanner>;
  }

  if (!isAuthenticated) {
    return (
      <StatusBanner tone="info">
        Please <Link href={`/login?next=${encodeURIComponent(pathname)}`}>log in</Link> to continue.
      </StatusBanner>
    );
  }

  return <>{children}</>;
}
