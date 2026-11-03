"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Doctor } from "@/lib/types";
import { money } from "@/lib/slots";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}>
      <Link
        href={`/appointment/${doctor.id}`}
        className="group block overflow-hidden rounded-3xl border border-line bg-white shadow-sm"
      >
        <div className="aspect-[5/4] overflow-hidden bg-foam">
          {doctor.image ? (
            <img src={doctor.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="grid h-full place-items-center text-5xl font-extrabold text-clinic">
              {doctor.name.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="px-4 pb-4 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-bold leading-none">{doctor.name}</p>
              <p className="mt-2 text-sm text-ink/60">{doctor.speciality}</p>
            </div>
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${doctor.available ? "bg-clinic" : "bg-ink/20"}`}
              title={doctor.available ? "Available" : "Unavailable"}
            />
          </div>
          <p className="mt-4 text-sm font-medium text-ink/75">
            {money(doctor.fees)} <span className="text-ink/30">·</span> {doctor.experience}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
