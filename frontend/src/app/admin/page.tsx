"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PanelDashboard } from "@/components/panel-dashboard";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { money } from "@/lib/slots";
import { specialities } from "@/lib/specialities";
import type { AdminDashboard } from "@/lib/types";

export default function AdminHome() {
  const { session } = useAuth();
  const [data, setData] = useState<AdminDashboard | null>(null);

  useEffect(() => {
    if (!session) return;
    api<AdminDashboard>("/dashboard/admin", { token: session.token })
      .then(setData)
      .catch((error) => toast.error(error.message));
  }, [session]);

  if (!data) return <p className="text-sm text-ink/60">Loading the desk…</p>;

  const counts = new Map(data.specialities.map((item) => [item.name, item.value]));

  return (
    <PanelDashboard
      name={session?.name ?? "Clinic admin"}
      subtitle="Clinic admin"
      stat={`${data.appointments} ${data.appointments === 1 ? "appointment" : "appointments"} on the books · ${data.doctors} ${data.doctors === 1 ? "doctor" : "doctors"}`}
      actionHref="/admin/appointments"
      actionLabel="Appointments"
      treatmentsTitle="Specialities"
      treatments={specialities.map((item) => ({
        label: item.label,
        icon: item.icon,
        count: counts.get(item.label) ?? 0,
      }))}
      series={data.series}
      latest={data.latest}
      listHref="/admin/appointments"
      perspective="admin"
      summaryTitle="Clinic"
      summary={[
        { label: "Doctors", value: String(data.doctors) },
        { label: "Patients", value: String(data.patients) },
        { label: "Appointments", value: String(data.appointments) },
        { label: "Collected", value: money(data.earnings) },
      ]}
    />
  );
}
