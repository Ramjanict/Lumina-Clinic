"use client";

import { Calendar, LayoutDashboard, UserRound } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { RequireAuth } from "@/components/require-auth";

const links = [
  { href: "/doctor", label: "Healthcare dashboard", icon: LayoutDashboard },
  { href: "/doctor/appointments", label: "Appointments", icon: Calendar },
  { href: "/doctor/profile", label: "Profile", icon: UserRound },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth role="DOCTOR">
      <DashboardShell
        homeHref="/doctor"
        roleLabel="Doctor"
        links={links}
        searchHref="/doctor/appointments"
      >
        {children}
      </DashboardShell>
    </RequireAuth>
  );
}
