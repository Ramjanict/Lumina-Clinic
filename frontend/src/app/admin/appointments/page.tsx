"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppointmentTable } from "@/components/appointment-table";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Appointment } from "@/lib/types";

function AdminAppointmentsPage() {
  const { session } = useAuth();
  const params = useSearchParams();
  const query = params.get("q")?.trim().toLowerCase() ?? "";
  const [rows, setRows] = useState<Appointment[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    if (!session) return;
    setRows(await api<Appointment[]>("/appointments", { token: session.token }));
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
    return [row.user.name, row.user.email, row.doctor.name, row.doctor.speciality].some((value) =>
      value.toLowerCase().includes(query),
    );
  });

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight">Appointments</h1>
      {query ? <p className="mt-1 text-sm text-ink/55">Results for “{params.get("q")}”</p> : null}
      <div className="mt-5">
        <AppointmentTable
          rows={visible}
          perspective="admin"
          busyId={busyId}
          onPaid={(id) => act(id, "paid", "Marked as paid")}
          onCancel={(id) => {
            if (confirm("Cancel this appointment?")) act(id, "cancel", "Appointment cancelled");
          }}
        />
      </div>
    </div>
  );
}

export default function AdminAppointmentsRoute() {
  return (
    <Suspense fallback={<p className="text-sm text-ink/60">Loading appointments…</p>}>
      <AdminAppointmentsPage />
    </Suspense>
  );
}
