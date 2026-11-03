"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PanelDashboard } from "@/components/panel-dashboard";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { money } from "@/lib/slots";
import { specialities } from "@/lib/specialities";
import type { Doctor, DoctorDashboard } from "@/lib/types";

export default function DoctorHome() {
  const { session } = useAuth();
  const [data, setData] = useState<DoctorDashboard | null>(null);
  const [profile, setProfile] = useState<Doctor | null>(null);
  const [roster, setRoster] = useState<Doctor[]>([]);

  useEffect(() => {
    if (!session) return;
    Promise.all([
      api<DoctorDashboard>("/dashboard/doctor", { token: session.token }),
      api<Doctor>("/doctors/me", { token: session.token }),
      api<Doctor[]>("/doctors"),
    ])
      .then(([dashboard, me, doctors]) => {
        setData(dashboard);
        setProfile(me);
        setRoster(doctors);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Could not load the practice"));
  }, [session]);

  if (!data) return <p className="text-sm text-ink/60">Loading your practice…</p>;

  const counts = new Map<string, number>();
  for (const doctor of roster) {
    counts.set(doctor.speciality, (counts.get(doctor.speciality) ?? 0) + 1);
  }

  return (
    <PanelDashboard
      name={profile?.name ?? session?.name ?? "Doctor"}
      subtitle={[profile?.speciality, profile?.degree].filter(Boolean).join(" · ") || "Doctor"}
      stat={`${data.appointments} ${data.appointments === 1 ? "appointment" : "appointments"} · ${data.patients} ${data.patients === 1 ? "patient" : "patients"}`}
      image={profile?.image}
      actionHref="/doctor/appointments"
      actionLabel="Appointments"
      treatmentsTitle="Specialities"
      treatments={specialities.map((item) => ({
        label: item.label,
        icon: item.icon,
        count: counts.get(item.label) ?? 0,
      }))}
      series={data.series}
      latest={data.latest}
      listHref="/doctor/appointments"
      perspective="doctor"
      summaryTitle="Practice"
      summary={[
        { label: "Collected", value: money(data.earnings) },
        { label: "Patients", value: String(data.patients) },
        { label: "Appointments", value: String(data.appointments) },
      ]}
    />
  );
}
