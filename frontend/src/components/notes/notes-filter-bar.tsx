"use client";

import { Input } from "@/components/ui/input";

type NotesFilterBarProps = {
  weather: string;
  onWeatherChange: (value: string) => void;
  onApply: () => void;
};

export function NotesFilterBar({ weather, onWeatherChange, onApply }: NotesFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-border bg-white/70 p-5 md:flex-row md:items-end">
      <div className="flex-1 space-y-2">
        <p className="text-sm font-semibold text-ink">Weather filter</p>
        <Input
          value={weather}
          onChange={(event) => onWeatherChange(event.target.value)}
          placeholder="Try sunny, rainy, cloudy..."
        />
      </div>
      <button
        type="button"
        onClick={onApply}
        className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
      >
        Apply filter
      </button>
    </div>
  );
}
