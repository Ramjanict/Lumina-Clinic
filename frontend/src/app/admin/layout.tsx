"use client";

import { Calendar, LayoutDashboard, Stethoscope, UserPlus } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { RequireAuth } from "@/components/require-auth";

const links = [
  { href: "/admin", label: "Healthcare dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/admin/doctors/new", label: "Add doctor", icon: UserPlus },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth role="ADMIN">
      <DashboardShell
        homeHref="/admin"
        roleLabel="Clinic admin"
        links={links}
        searchHref="/admin/doctors"
      >
        {children}
      </DashboardShell>
    </RequireAuth>
  );
}
