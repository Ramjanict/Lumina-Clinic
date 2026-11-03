"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { feeChangeNote, VisitsChart } from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import { formatSlot } from "@/lib/slots";
import type { Appointment, SeriesPoint } from "@/lib/types";

function ClinicArt() {
  return (
    <svg viewBox="0 0 420 230" className="h-full w-full" aria-hidden>
      <rect x="168" y="36" width="214" height="132" rx="22" fill="#ffffff" opacity="0.72" />
      <rect x="190" y="58" width="78" height="10" rx="5" fill="#b7ebe7" />
      <rect x="190" y="80" width="150" height="8" rx="4" fill="#d7f4f2" />
      <rect x="190" y="98" width="120" height="8" rx="4" fill="#d7f4f2" />
      <rect x="190" y="122" width="70" height="24" rx="8" fill="#0F9D96" />
      <circle cx="92" cy="92" r="28" fill="#0F9D96" />
      <path d="M58 168c6-34 22-48 34-48s28 14 34 48" fill="#128f89" />
      <circle cx="318" cy="168" r="26" fill="#d8f6f3" />
      <path d="M306 166h24M318 154v24" stroke="#0F9D96" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function PanelDashboard({
  name,
  subtitle,
  stat,
  image,
  actionHref,
  actionLabel,
  treatmentsTitle,
  treatments,
  series,
  latest,
  listHref,
  perspective,
  summaryTitle,
  summary,
}: {
  name: string;
  subtitle: string;
  stat: string;
  image?: string;
  actionHref: string;
  actionLabel: string;
  treatmentsTitle: string;
  treatments: { label: string; icon: LucideIcon; count: number }[];
  series: SeriesPoint[];
  latest: Appointment[];
  listHref: string;
  perspective: "admin" | "doctor";
  summaryTitle: string;
  summary: { label: string; value: string }[];
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#d5f5f2] via-[#e7faf8] to-[#f3fcfb] p-6">
          <div className="relative z-10 max-w-sm">
            <div className="flex items-center gap-3">
              {image ? (
                <img src={image} alt="" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-sm font-bold text-clinic">
                  {initials(name)}
                </span>
              )}
              <div>
                <h1 className="text-xl font-bold tracking-tight">{name}</h1>
                <p className="text-sm text-ink/60">{subtitle}</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-ink/75">{stat}</p>
            <Link
              href={actionHref}
              className="mt-4 inline-flex h-10 items-center rounded-lg bg-[#0c6e6a] px-4 text-sm font-semibold text-white hover:bg-clinic-dark"
            >
              {actionLabel}
            </Link>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] sm:block">
            <ClinicArt />
          </div>
        </section>

        <section className="rounded-2xl border border-[#e6edf5] bg-white p-5 shadow-[0_8px_30px_rgba(18,32,51,0.04)]">
          <h2 className="font-semibold">{treatmentsTitle}</h2>
          <div className="mt-5 grid grid-cols-3 gap-4">
            {treatments.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e7f7f4] text-clinic">
                    <Icon size={22} />
                  </span>
                  <p className="mt-2 text-xs font-medium text-ink/80">{item.label}</p>
                  <p className="text-[11px] text-ink/45">{item.count}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-[#e6edf5] bg-white p-5 shadow-[0_8px_30px_rgba(18,32,51,0.04)]">
        <h2 className="font-semibold">Income</h2>
        <p className="mt-1 text-sm text-ink/50">Appointments and collected fees, last 14 days.</p>
        <VisitsChart data={series} />
        <p className="text-center text-sm font-medium text-clinic">{feeChangeNote(series)}</p>
      </section>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border border-[#e6edf5] bg-white p-5 shadow-[0_8px_30px_rgba(18,32,51,0.04)] xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Appointments</h2>
            <Link href={listHref} className="text-sm font-semibold text-clinic">
              View all
            </Link>
          </div>
          {latest.length ? (
            <ul className="divide-y divide-[#eef3f8]">
              {latest.slice(0, 5).map((row) => (
                <li key={row.id} className="flex items-center gap-3 py-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e7f7f4] text-xs font-bold text-clinic">
                    {initials(row.user.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{row.user.name}</span>
                    <span className="block truncate text-xs text-ink/50">
                      {perspective === "admin" ? row.doctor.name : row.user.email}
                    </span>
                  </span>
                  <span className="hidden text-xs text-ink/55 sm:block">
                    {formatSlot(row.slotDate, row.slotTime)}
                  </span>
                  <Badge tone={row.status}>{row.status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-sm text-ink/55">No appointments yet.</p>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-[#e6edf5] bg-white p-5 shadow-[0_8px_30px_rgba(18,32,51,0.04)]">
            <h2 className="font-semibold">Activity</h2>
            {latest.length ? (
              <ul className="mt-3 space-y-3">
                {latest.slice(0, 4).map((row) => (
                  <li key={row.id} className="flex gap-3 text-sm">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-clinic" />
                    <span>
                      <span className="block text-ink/80">
                        {row.user.name} · {row.doctor.speciality}
                      </span>
                      <span className="text-xs capitalize text-ink/45">{row.status}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-sm text-ink/55">Nothing recorded yet.</p>
            )}
          </section>
          <section className="rounded-2xl border border-[#e6edf5] bg-white p-5 shadow-[0_8px_30px_rgba(18,32,51,0.04)]">
            <h2 className="font-semibold">{summaryTitle}</h2>
            <dl className="mt-3">
              {summary.map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-[#eef3f8] py-2.5 last:border-0">
                  <dt className="text-sm text-ink/55">{item.label}</dt>
                  <dd className="text-sm font-semibold">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
