"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppointmentTable } from "@/components/appointment-table";
import { RequireAuth } from "@/components/require-auth";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Appointment } from "@/lib/types";

function Visits() {
  const { session } = useAuth();
  const [rows, setRows] = useState<Appointment[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    if (!session) return;
    const data = await api<Appointment[]>("/appointments/me", { token: session.token });
    setRows(data);
  }

  useEffect(() => {
    load().catch((error) => toast.error(error.message));
  }, [session]);

  async function cancel(id: string) {
    if (!session || !confirm("Cancel this appointment?")) return;
    setBusyId(id);
    try {
      await api(`/appointments/${id}/cancel`, { token: session.token });
      toast.success("Appointment cancelled");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl">My visits</h1>
      <p className="mt-2 max-w-xl text-sm text-ink/65">
        Fees are collected at the clinic. A visit shows as paid once the desk confirms it, or when the doctor completes it.
      </p>
      <div className="mt-8">
        <AppointmentTable rows={rows} perspective="user" busyId={busyId} onCancel={cancel} />
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <RequireAuth role="USER">
      <Visits />
    </RequireAuth>
  );
}
