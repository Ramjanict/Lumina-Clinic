"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus, Star } from "lucide-react";
import { DoctorCard } from "@/components/doctor-card";
import { CareRibbon, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { specialities } from "@/lib/specialities";
import type { Doctor } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;
const portrait = "/doctor-1.jpg";


const consult = "/clinic-consultation.jpg";



export default function HomePage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    api<Doctor[]>("/doctors")
      .then((rows) => setDoctors(rows.filter((doctor) => doctor.available)))
      .catch(() => setDoctors([]));
  }, []);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-4 pt-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-3 rounded-full border border-line bg-white px-3 py-1.5 text-sm shadow-sm"
          >
            <span className="flex -space-x-2">
              {["A", "N", "R"].map((letter) => (
                <span key={letter} className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-foam text-xs font-bold text-clinic">
                  {letter}
                </span>
              ))}
            </span>
            <span className="flex items-center gap-1 text-ink/70">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              Same-week appointments
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease }}
            className="mt-6 max-w-xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
          >
            Get the care you need, faster.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease }}
            className="mt-5 max-w-lg text-base leading-7 text-ink/65"
          >
            Choose a specialist, hold a half-hour this week, and keep the visit in one record
            for you, your doctor, and the front desk.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button size="lg" asChild>
              <Link href="/doctors">Book appointment</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">How it works</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="relative"
        >
          <div className="absolute inset-x-8 top-8 h-72 rounded-full bg-sky-100 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-sky-100 to-white">
            <img src={portrait} alt="Physician in a white coat" className="h-[460px] w-full object-cover object-top" />
          </div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-2 bottom-10 rounded-2xl border border-line bg-white px-4 py-3 shadow-card sm:left-[-18px]"
          >
            <p className="text-xs text-ink/50">Doctors on the roster</p>
            <p className="text-2xl font-extrabold text-clinic">{doctors.length || "—"}</p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-3 top-6 grid h-24 w-24 place-items-center rounded-full border border-dashed border-clinic/40 bg-white/90 text-center text-[11px] font-semibold leading-tight text-clinic shadow-sm"
          >
            Same-week
            <br />
            visits
          </motion.div>
        </motion.div>
      </section>

      <CareRibbon />

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-card">
            <img src={consult} alt="A clinician speaking with a patient" className="h-80 w-full object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-sm font-semibold text-clinic">Who we are</p>
          <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight">
            One clinic record for the visit, the doctor, and the desk.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-ink/65">
            Lumina is the booking board. Patients pick a time. Doctors complete or cancel their own day.
            Admins add clinicians and mark a fee paid.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div>
              <p className="text-4xl font-extrabold">6</p>
              <p className="text-sm text-ink/55">Specialities on the menu</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">7</p>
              <p className="text-sm text-ink/55">Days of open slots</p>
            </div>
          </div>
          <Button className="mt-8" asChild>
            <Link href="/doctors">Explore doctors</Link>
          </Button>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6" id="speciality">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-clinic">Our areas of expertise</p>
              <h2 className="mt-1 text-4xl font-extrabold tracking-tight">Care, sorted by speciality.</h2>
            </div>
            <Link href="/doctors" className="hidden items-center gap-1 text-sm font-semibold text-clinic sm:inline-flex">
              View all <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {specialities.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.slug} delay={index * 0.05}>
                <Link
                  href={`/doctors/${item.slug}`}
                  className="flex h-full flex-col rounded-3xl border border-line bg-white p-5 shadow-sm transition hover:border-clinic/40"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-foam text-clinic">
                    <Icon size={20} />
                  </span>
                  <p className="mt-5 text-lg font-bold">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-ink/60">{item.copy}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal>
          <h2 className="text-4xl font-extrabold tracking-tight">Available this week</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.length ? (
            doctors.slice(0, 4).map((doctor, index) => (
              <Reveal key={doctor.id} delay={index * 0.06}>
                <DoctorCard doctor={doctor} />
              </Reveal>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-line bg-white p-8 sm:col-span-2 lg:col-span-4">
              <p className="text-2xl font-bold">The roster is still empty.</p>
              <p className="mt-2 text-sm text-ink/60">An admin can add the first doctor from the clinic desk.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["30 min", "Each visit is a half-hour between 10:30 and 8:30."],
            ["One record", "Patients, doctors, and the desk share the same appointment."],
            ["Fees at the clinic", "The desk marks a booking paid, or the doctor closes the visit."],
          ].map(([title, copy], index) => (
            <Reveal key={title} delay={index * 0.08}>
              <div className={`rounded-3xl p-6 ${index === 1 ? "bg-clinic text-white" : "bg-white"}`}>
                <Plus className={index === 1 ? "text-white" : "text-clinic"} size={18} />
                <p className="mt-6 text-3xl font-extrabold">{title}</p>
                <p className={`mt-2 text-sm leading-6 ${index === 1 ? "text-white/80" : "text-ink/60"}`}>{copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
