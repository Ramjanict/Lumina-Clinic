"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/doctor") ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink/65">
            Book a specialist this week. Doctors close the visit. The desk keeps the schedule.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Patients</p>
          <Link className="block text-ink/65 hover:text-clinic" href="/doctors">Find a doctor</Link>
          <Link className="block text-ink/65 hover:text-clinic" href="/appointments">My visits</Link>
          <Link className="block text-ink/65 hover:text-clinic" href="/account">Profile</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Clinic</p>
          <Link className="block text-ink/65 hover:text-clinic" href="/about">About</Link>
          <Link className="block text-ink/65 hover:text-clinic" href="/contact">Contact</Link>
          <Link className="block text-ink/65 hover:text-clinic" href="/login">Staff login</Link>
        </div>
      </div>
    </footer>
  );
}
