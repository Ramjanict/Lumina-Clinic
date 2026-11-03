"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Search } from "lucide-react";
import { api } from "@/lib/api";
import { specialities, specialityBySlug } from "@/lib/specialities";
import type { Doctor } from "@/lib/types";
import { DoctorCard } from "@/components/doctor-card";
import { cn } from "@/lib/utils";

export function DoctorsBrowser({ slug }: { slug?: string }) {
  const active = specialityBySlug(slug);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [query, setQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Doctor[]>("/doctors")
      .then(setDoctors)
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const doctor of doctors) {
      map.set(doctor.speciality, (map.get(doctor.speciality) ?? 0) + 1);
    }
    return map;
  }, [doctors]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const matchesSpeciality = active ? doctor.speciality === active.label : true;
      const matchesQuery = !needle || doctor.name.toLowerCase().includes(needle);
      const matchesAvailability = availableOnly ? doctor.available : true;
      return matchesSpeciality && matchesQuery && matchesAvailability;
    });
  }, [doctors, active, query, availableOnly]);

  const filtersActive = Boolean(query.trim() || availableOnly || active);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-3xl border border-line bg-white p-4 shadow-sm lg:sticky lg:top-24">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name"
            className="h-11 w-full rounded-2xl border border-line bg-paper pl-9 pr-3 text-sm outline-none focus:border-clinic focus:ring-2 focus:ring-clinic/20"
          />
        </label>

        <button
          type="button"
          onClick={() => setAvailableOnly((value) => !value)}
          className="mt-3 flex w-full items-center justify-between rounded-2xl border border-line px-3 py-2.5 text-sm"
        >
          <span className="font-medium">Available now</span>
          <span
            className={cn(
              "relative h-6 w-11 rounded-full transition",
              availableOnly ? "bg-clinic" : "bg-ink/15",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                availableOnly ? "left-5" : "left-0.5",
              )}
            />
          </span>
        </button>

        <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
          Speciality
        </p>
        <div className="space-y-1">
          <FilterLink href="/doctors" active={!active} count={doctors.length} label="All doctors" icon={LayoutGrid} />
          {specialities.map((item) => (
            <FilterLink
              key={item.slug}
              href={`/doctors/${item.slug}`}
              active={active?.slug === item.slug}
              count={counts.get(item.label) ?? 0}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </div>
        {filtersActive ? (
          <Link href="/doctors" onClick={() => { setQuery(""); setAvailableOnly(false); }} className="mt-4 block text-center text-sm font-semibold text-clinic">
            Clear filters
          </Link>
        ) : null}
      </aside>

      <section>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">{active?.label ?? "All doctors"}</h1>
          <p className="mt-2 text-ink/65">
            {active?.copy ?? "Every clinician currently on the Lumina roster."}
            {!loading ? ` · ${visible.length} shown` : ""}
          </p>
        </div>
        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="h-72 animate-pulse rounded-3xl bg-white" />
            <div className="h-72 animate-pulse rounded-3xl bg-white" />
          </div>
        ) : visible.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {visible.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
            <p className="text-2xl font-extrabold">No doctors in this view</p>
            <p className="mt-2 text-sm text-ink/60">
              {slug && !active
                ? "That speciality is not on the list."
                : "Try another speciality, or clear the search."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function FilterLink({
  href,
  active,
  label,
  count,
  icon: Icon,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-2.5 py-2 text-sm transition",
        active ? "bg-foam font-semibold text-clinic-dark" : "text-ink/75 hover:bg-paper",
      )}
    >
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-xl",
          active ? "bg-white text-clinic" : "bg-paper text-ink/50",
        )}
      >
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className={cn("text-xs tabular-nums", active ? "text-clinic" : "text-ink/40")}>{count}</span>
    </Link>
  );
}
