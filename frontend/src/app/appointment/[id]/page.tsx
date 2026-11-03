"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DoctorCard } from "@/components/doctor-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { buildDays, formatTime, money } from "@/lib/slots";
import type { Doctor } from "@/lib/types";
import { bookSchema } from "@/lib/validators";

export default function AppointmentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [missing, setMissing] = useState(false);
  const [related, setRelated] = useState<Doctor[]>([]);
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMissing(false);
    setDoctor(null);
    api<Doctor>(`/doctors/${params.id}`)
      .then((row) => {
        setDoctor(row);
        setSlotDate("");
        setSlotTime("");
        return api<Doctor[]>(`/doctors?speciality=${encodeURIComponent(row.speciality)}`)
          .then((rows) => setRelated(rows.filter((item) => item.id !== params.id).slice(0, 3)))
          .catch(() => setRelated([]));
      })
      .catch(() => setMissing(true));
  }, [params.id]);

  const days = useMemo(() => buildDays(doctor?.booked ?? []), [doctor]);
  const activeDay = days.find((day) => day.slotDate === slotDate) ?? days[0];

  async function book() {
    const parsed = bookSchema.safeParse({
      slotDate: slotDate || activeDay?.slotDate,
      slotTime,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Choose a time");
      return;
    }
    if (!session) {
      router.push(`/login?next=/appointment/${params.id}`);
      return;
    }
    if (session.role !== "USER") {
      toast.error("Sign in as a patient to book");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api("/appointments", {
        token: session.token,
        json: { doctorId: params.id, ...parsed.data },
      });
      toast.success("Appointment booked");
      router.push("/appointments");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not book");
    } finally {
      setSaving(false);
    }
  }

  if (missing) {
    return <div className="mx-auto max-w-6xl px-4 py-20">That doctor is not on the roster.</div>;
  }

  if (!doctor) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-ink/60">Loading the doctor…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-[2rem] border border-line bg-white">
          <div className="aspect-[5/4] bg-foam">
            {doctor.image ? (
              <img src={doctor.image} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="space-y-3 p-6">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-4xl">{doctor.name}</h1>
              <Badge tone={doctor.available ? "paid" : "cancelled"}>
                {doctor.available ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <p className="text-ink/60">
              {doctor.degree} · {doctor.speciality} · {doctor.experience}
            </p>
            <p className="text-lg">{money(doctor.fees)} consultation</p>
            <p className="leading-7 text-ink/75">{doctor.about}</p>
            <p className="text-sm text-ink/60">
              {doctor.address1}
              {doctor.address2 ? `, ${doctor.address2}` : ""}
            </p>
          </div>
        </div>
        <div className="rounded-[2rem] border border-line bg-white p-6">
          <h2 className="font-serif text-3xl">Choose a time</h2>
          <p className="mt-1 text-sm text-ink/60">Half-hour visits, 10:30 to 8:30, for the next seven days.</p>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {days.map((day) => (
              <button
                key={day.slotDate}
                type="button"
                onClick={() => {
                  setSlotDate(day.slotDate);
                  setSlotTime("");
                }}
                className={`min-w-20 rounded-2xl border px-3 py-2 text-center ${(slotDate || activeDay?.slotDate) === day.slotDate ? "border-clinic bg-clinic text-white" : "border-line"}`}
              >
                <span className="block text-xs uppercase">{day.weekday}</span>
                <span className="text-sm">{day.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeDay?.times.length ? (
              activeDay.times.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSlotTime(time)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${slotTime === time ? "border-clinic bg-foam text-clinic-dark" : "border-line"}`}
                >
                  {formatTime(time)}
                </button>
              ))
            ) : (
              <p className="text-sm text-ink/60">No open times on this day.</p>
            )}
          </div>
          {error ? <p className="mt-3 text-sm text-clay">{error}</p> : null}
          <Button className="mt-6" disabled={!doctor.available || saving} onClick={book}>
            {doctor.available ? (saving ? "Booking…" : "Book this visit") : "Not taking appointments"}
          </Button>
          {!session ? (
            <p className="mt-3 text-sm text-ink/60">
              You will be asked to <Link className="text-clinic" href={`/login?next=/appointment/${doctor.id}`}>sign in</Link> first.
            </p>
          ) : null}
        </div>
      </div>
      {related.length ? (
        <div className="mt-14">
          <h2 className="font-serif text-3xl">Other {doctor.speciality.toLowerCase()}s</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <DoctorCard key={item.id} doctor={item} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
