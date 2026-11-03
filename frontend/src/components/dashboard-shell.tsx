"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, Home, LogOut, Menu, Phone, Search, X, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "L";
}

export function DashboardShell({
  homeHref,
  roleLabel,
  links,
  searchHref,
  children,
}: {
  homeHref: string;
  roleLabel: string;
  links: { href: string; label: string; icon: LucideIcon }[];
  searchHref: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const today = new Date().toLocaleDateString("en-GB");
  const current = links
    .filter((link) => pathname === link.href || pathname.startsWith(`${link.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  function signOut() {
    logout();
    router.push("/");
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <Link href={homeHref} className="px-5 pb-2 pt-5" aria-label="Lumina Clinic">
        <Logo />
      </Link>
      <div className="mx-4 mb-3 mt-4 flex items-center gap-3 rounded-2xl px-2 py-2">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e7f7f4] text-sm font-bold text-clinic">
          {initials(session?.name ?? "Clinic")}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{session?.name}</span>
          <span className="block truncate text-xs text-ink/50">{roleLabel}</span>
        </span>
      </div>
      <nav className="space-y-1 px-3">
        {links.map((link) => {
          const active = current?.href === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                active ? "bg-[#e7f7f4] font-semibold text-ink" : "text-ink/70 hover:bg-[#f4fbfa]",
              )}
            >
              <Icon size={18} className={active ? "text-clinic" : "text-ink/45"} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <a
        href="mailto:mdramjan.ict@gmail.com"
        className="mx-4 mb-5 mt-auto flex items-center gap-3 rounded-2xl bg-clinic px-4 py-3 text-white"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20">
          <Phone size={16} />
        </span>
        <span className="min-w-0">
          <span className="block text-xs text-white/80">Clinic desk</span>
          <span className="block text-sm font-semibold">Email the desk</span>
        </span>
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] overflow-y-auto border-r border-[#e6edf5] md:block">
        {sidebar}
      </aside>
      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/30"
            onClick={() => setOpen(false)}
          />
          <aside className="relative h-full w-[260px] shadow-card">{sidebar}</aside>
        </div>
      ) : null}

      <div className="md:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#e6edf5] bg-white px-4 md:px-6">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl text-ink/70 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(true)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <form
            className="relative min-w-0 flex-1 max-w-md"
            onSubmit={(event) => {
              event.preventDefault();
              const q = query.trim();
              router.push(q ? `${searchHref}?q=${encodeURIComponent(q)}` : searchHref);
            }}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              aria-label="Search"
              className="h-10 w-full rounded-xl border border-[#e6edf5] bg-[#f6f8fb] pl-9 pr-3 text-sm outline-none focus:border-clinic focus:ring-2 focus:ring-clinic/15"
            />
          </form>
          <div className="relative ml-auto">
            <button
              type="button"
              aria-label="Account menu"
              aria-expanded={menu}
              onClick={() => setMenu((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#e7f7f4] text-sm font-bold text-clinic"
            >
              {initials(session?.name ?? "Clinic")}
            </button>
            {menu ? (
              <div className="absolute right-0 top-12 w-60 rounded-2xl border border-[#e6edf5] bg-white p-3 shadow-card">
                <p className="truncate text-sm font-semibold">{session?.name}</p>
                <p className="truncate text-xs text-ink/50">{session?.email}</p>
                <button
                  type="button"
                  onClick={signOut}
                  className="mt-3 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-ink/75 hover:bg-[#f4fbfa]"
                >
                  <LogOut size={15} />
                  Log out
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <div className="px-4 py-5 md:px-6 md:py-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm text-ink/55">
              <Link href={homeHref} aria-label="Dashboard home" className="text-clinic">
                <Home size={16} />
              </Link>
              <span>/</span>
              <span className="font-medium text-ink">{current?.label ?? "Dashboard"}</span>
            </p>
            <p className="flex items-center gap-2 rounded-xl border border-[#e6edf5] bg-white px-3 py-1.5 text-sm text-ink/70">
              <CalendarDays size={15} className="text-clinic" />
              {today}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
