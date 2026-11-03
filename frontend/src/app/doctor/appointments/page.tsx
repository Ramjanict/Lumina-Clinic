"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppointmentTable } from "@/components/appointment-table";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Appointment } from "@/lib/types";

function DoctorAppointmentsPage() {
  const { session } = useAuth();
  const params = useSearchParams();
  const query = params.get("q")?.trim().toLowerCase() ?? "";
  const [rows, setRows] = useState<Appointment[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    if (!session) return;
    setRows(await api<Appointment[]>("/appointments/doctor", { token: session.token }));
  }

  useEffect(() => {
    load().catch((error) => toast.error(error.message));
  }, [session]);

  async function act(id: string, path: string, success: string) {
    if (!session) return;
    setBusyId(id);
    try {
      await api(`/appointments/${id}/${path}`, { token: session.token });
      toast.success(success);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally {
      setBusyId(null);
    }
  }

  const visible = rows.filter((row) => {
    if (!query) return true;
    return [row.user.name, row.user.email].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight">Appointments</h1>
      <p className="mt-1 text-sm text-ink/55">
        {query ? `Results for “${params.get("q")}”. ` : ""}
        Completing a visit records the fee as collected.
      </p>
      <div className="mt-5">
        <AppointmentTable
          rows={visible}
          perspective="doctor"
          busyId={busyId}
          onComplete={(id) => act(id, "complete", "Visit completed")}
          onCancel={(id) => {
            if (confirm("Cancel this appointment?")) act(id, "cancel", "Appointment cancelled");
          }}
        />
      </div>
    </div>
  );
}

export default function DoctorAppointmentsRoute() {
  return (
    <Suspense fallback={<p className="text-sm text-ink/60">Loading appointments…</p>}>
      <DoctorAppointmentsPage />
    </Suspense>
  );
}
