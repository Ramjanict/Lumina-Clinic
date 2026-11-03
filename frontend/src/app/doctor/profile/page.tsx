"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Doctor } from "@/lib/types";
import { doctorProfileSchema } from "@/lib/validators";

type Values = z.infer<typeof doctorProfileSchema>;

export default function DoctorProfilePage() {
  const { session } = useAuth();
  const form = useForm<Values>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: { fees: "", about: "", address1: "", address2: "", available: true },
  });

  useEffect(() => {
    if (!session) return;
    api<Doctor>("/doctors/me", { token: session.token })
      .then((doctor) => {
        form.reset({
          fees: String(doctor.fees),
          about: doctor.about,
          address1: doctor.address1,
          address2: doctor.address2,
          available: doctor.available,
        });
      })
      .catch((error: Error) => toast.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function onSubmit(values: Values) {
    if (!session) return;
    try {
      await api("/doctors/me", {
        method: "PATCH",
        token: session.token,
        json: { ...values, fees: Number(values.fees) },
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update");
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold tracking-tight">Profile</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 space-y-4 rounded-2xl border border-[#e6edf5] bg-white p-5 shadow-[0_8px_30px_rgba(18,32,51,0.04)]"
      >
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-clinic" {...form.register("available")} />
          Accepting appointments
        </label>
        <Field label="Fees (USD)" error={form.formState.errors.fees?.message}>
          <Input inputMode="numeric" {...form.register("fees")} />
        </Field>
        <Field label="About" error={form.formState.errors.about?.message}>
          <Textarea {...form.register("about")} />
        </Field>
        <Field label="Address line 1" error={form.formState.errors.address1?.message}>
          <Input {...form.register("address1")} />
        </Field>
        <Field label="Address line 2" error={form.formState.errors.address2?.message}>
          <Input {...form.register("address2")} />
        </Field>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Save changes
        </Button>
      </form>
    </div>
  );
}
