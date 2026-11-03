import { Activity, Baby, Brain, HeartPulse, Sparkles, Stethoscope } from "lucide-react";

export const specialities = [
  {
    slug: "general-physician",
    label: "General physician",
    icon: Stethoscope,
    copy: "Everyday illness, checkups, and a clear first opinion.",
  },
  {
    slug: "gynecologist",
    label: "Gynecologist",
    icon: HeartPulse,
    copy: "Women's health, from routine visits to specialist follow-up.",
  },
  {
    slug: "dermatologist",
    label: "Dermatologist",
    icon: Sparkles,
    copy: "Skin and hair concerns, without the guesswork.",
  },
  {
    slug: "pediatricians",
    label: "Pediatricians",
    icon: Baby,
    copy: "Care for children, with room for a parent's questions.",
  },
  {
    slug: "neurologist",
    label: "Neurologist",
    icon: Brain,
    copy: "Headaches, nerve symptoms, and visits that stay on record.",
  },
  {
    slug: "gastroenterologist",
    label: "Gastroenterologist",
    icon: Activity,
    copy: "Digestive issues, explained plainly and booked this week.",
  },
] as const;

export function specialityBySlug(slug?: string) {
  return specialities.find((item) => item.slug === slug);
}
