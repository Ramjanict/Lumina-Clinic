"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Role } from "@/lib/auth";
import { useAuth } from "@/lib/auth";

export function RequireAuth({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { session, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (session.role !== role) router.replace("/");
  }, [ready, session, role, pathname, router]);

  if (!ready || !session || session.role !== role) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper text-sm text-ink/60">
        Checking your session…
      </div>
    );
  }

  return children;
}
