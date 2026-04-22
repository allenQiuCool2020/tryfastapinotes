"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { createQueryClient } from "@/lib/query-client";
import { AuthProvider } from "@/state/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
