"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { money } from "@/lib/slots";
import type { Doctor } from "@/lib/types";

function AdminDoctorsPage() {
  const { session } = useAuth();
  const params = useSearchParams();
  const query = params.get("q")?.trim().toLowerCase() ?? "";
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    if (!session) return;
    api<Doctor[]>("/doctors/admin", { token: session.token })
      .then(setDoctors)
      .catch((error) => toast.error(error.message));
  }, [session]);

  async function toggle(id: string) {
    if (!session) return;
    try {
      const updated = await api<{ id: string; available: boolean }>(
        `/doctors/${id}/availability`,
        { method: "PATCH", token: session.token },
      );
      setDoctors((current) =>
        current.map((doctor) =>
          doctor.id === id ? { ...doctor, available: updated.available } : doctor,
        ),
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update");
    }
  }

  const visible = doctors.filter((doctor) => {
    if (!query) return true;
    return [doctor.name, doctor.email, doctor.speciality].some((value) =>
      value?.toLowerCase().includes(query),
    );
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Doctors</h1>
          {query ? <p className="mt-1 text-sm text-ink/55">Results for “{params.get("q")}”</p> : null}
        </div>
        <Link
          href="/admin/doctors/new"
          className="inline-flex h-10 items-center rounded-lg bg-clinic px-4 text-sm font-semibold text-white hover:bg-clinic-dark"
        >
          Add doctor
        </Link>
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-[#e6edf5] bg-white shadow-[0_8px_30px_rgba(18,32,51,0.04)]">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-[#f7fbfb] text-ink/55">
            <tr>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Speciality</th>
              <th className="px-4 py-3 font-medium">Fee</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((doctor) => (
              <tr key={doctor.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={doctor.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-ink/55">{doctor.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{doctor.speciality}</td>
                <td className="px-4 py-3">{money(doctor.fees)}</td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="outline" onClick={() => toggle(doctor.id)}>
                    <Badge tone={doctor.available ? "paid" : "cancelled"}>
                      {doctor.available ? "Available" : "Hidden"}
                    </Badge>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length ? (
          <p className="px-4 py-10 text-center text-sm text-ink/60">
            {doctors.length ? "No doctors match that search." : "No doctors yet."}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminDoctorsRoute() {
  return (
    <Suspense fallback={<p className="text-sm text-ink/60">Loading doctors…</p>}>
      <AdminDoctorsPage />
    </Suspense>
  );
}
