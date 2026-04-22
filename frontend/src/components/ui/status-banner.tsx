import type React from "react";

import { cn } from "@/lib/utils";

type StatusBannerProps = {
  tone?: "error" | "info" | "success";
  children: React.ReactNode;
};

const tones = {
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-border bg-white/70 text-ink",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export function StatusBanner({ tone = "info", children }: StatusBannerProps) {
  return <div className={cn("rounded-2xl border px-4 py-3 text-sm", tones[tone])}>{children}</div>;
}
