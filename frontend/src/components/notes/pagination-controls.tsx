"use client";

import { Button } from "@/components/ui/button";

type PaginationControlsProps = {
  skip: number;
  limit: number;
  hasNextPage: boolean;
  onPageChange: (nextSkip: number) => void;
};

export function PaginationControls({
  skip,
  limit,
  hasNextPage,
  onPageChange,
}: PaginationControlsProps) {
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div className="flex items-center justify-between rounded-[28px] border border-border bg-white/70 px-5 py-4">
      <p className="text-sm text-ink/70">Page {currentPage}</p>
      <div className="flex gap-3">
        <Button variant="ghost" disabled={skip === 0} onClick={() => onPageChange(Math.max(0, skip - limit))}>
          Previous
        </Button>
        <Button variant="secondary" disabled={!hasNextPage} onClick={() => onPageChange(skip + limit)}>
          Next
        </Button>
      </div>
    </div>
  );
}
