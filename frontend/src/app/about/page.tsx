"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";

const steps = [
  ["Choose", "Filter by speciality and open a profile with the fee, degree, and address."],
  ["Book", "Pick a half-hour in the next seven days. That time is held for you."],
  ["Visit", "Your doctor completes the visit. The desk can mark the fee paid before then."],
];

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-14">
      <Reveal>
        <p className="text-sm font-semibold text-clinic">The clinic</p>
        <h1 className="mt-2 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight">
          A clear board for a full week of care.
        </h1>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map(([title, copy], index) => (
          <Reveal key={title} delay={index * 0.08}>
            <div className="h-full rounded-3xl border border-line bg-white p-6">
              <p className="text-sm font-bold text-clinic">0{index + 1}</p>
              <h2 className="mt-4 text-2xl font-extrabold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">{copy}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.15}>
        <p className="mt-10 max-w-2xl leading-7 text-ink/70">
          Hours run from 10:30 in the morning to 8:30 in the evening. Cancelling a visit returns
          that time to the board. Fees are shown in dollars and collected at the clinic.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/doctors">See the doctors</Link>
        </Button>
      </Reveal>
    </article>
  );
}
