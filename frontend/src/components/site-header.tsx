"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { homeFor, useAuth } from "@/lib/auth";

const links = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const studio = pathname.startsWith("/admin") || pathname.startsWith("/doctor");

  if (studio) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 bg-paper/80 px-4 py-4 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl border border-white/80 bg-white/90 px-4 shadow-card backdrop-blur">
        <Link href="/" aria-label="Lumina Clinic">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink/70 md:flex">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={active ? "text-clinic" : "hover:text-ink"}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {ready && session ? (
            <>
              <Button variant="ghost" asChild>
                <Link href={homeFor(session.role)}>
                  {session.role === "USER" ? "My visits" : session.role === "DOCTOR" ? "Practice" : "Desk"}
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/doctors">Appointment</Link>
          </Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <div className="mx-auto mt-2 max-w-6xl space-y-3 rounded-2xl border border-line bg-white px-4 py-4 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block text-sm font-medium" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {session ? (
            <button
              className="text-sm"
              onClick={() => {
                logout();
                setOpen(false);
                router.push("/");
              }}
            >
              Log out
            </button>
          ) : (
            <Link href="/login" className="block text-sm" onClick={() => setOpen(false)}>
              Log in
            </Link>
          )}
        </div>
      ) : null}
    </motion.header>
  );
}
