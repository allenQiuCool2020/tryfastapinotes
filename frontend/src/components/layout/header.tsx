"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/state/auth-context";

const publicNav = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
];

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/50 bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-ink">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-canvas">
            FN
          </div>
          <div>
            <p className="font-serif text-xl font-bold">Field Notes</p>
            <p className="text-xs text-ink/65">Public notes with weather, memory, and ownership.</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-ink/75 transition hover:bg-white/60 hover:text-ink",
                pathname === item.href && "bg-white text-ink shadow-sm",
              )}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                href="/notes/new"
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-ink/75 transition hover:bg-white/60 hover:text-ink",
                  pathname === "/notes/new" && "bg-white text-ink shadow-sm",
                )}
              >
                New Note
              </Link>
              <span className="px-2 text-sm text-ink/60">{user?.username}</span>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-ink/75 transition hover:bg-white/60 hover:text-ink",
                  pathname === "/login" && "bg-white text-ink shadow-sm",
                )}
              >
                Login
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
