"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

const words = [
  "Trusted",
  "Experienced",
  "Caring",
  "Reliable",
  "Skilled",
  "Clear",
  "Available",
  "Calm",
];

export function CareRibbon() {
  const track = [...words, ...words];
  return (
    <div className="relative my-6 overflow-hidden bg-clinic py-4 text-white shadow-card">
      <motion.div
        className="flex w-max items-center gap-8 px-4 text-sm font-semibold tracking-wide sm:text-base"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {track.map((word, index) => (
          <span key={`${word}-${index}`} className="flex items-center gap-8">
            {word}
            <span aria-hidden className="text-white/70">
              •
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
