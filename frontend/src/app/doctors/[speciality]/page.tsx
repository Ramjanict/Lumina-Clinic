"use client";

import { useParams } from "next/navigation";
import { DoctorsBrowser } from "@/components/doctors-browser";

export default function SpecialityPage() {
  const params = useParams<{ speciality: string }>();
  return <DoctorsBrowser slug={params.speciality} />;
}
