"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CommonSelect from "@/components/common-select";
import { Field } from "@/components/field";
import { PhotoUpload } from "@/components/photo-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { addDoctorSchema, experienceOptions, specialityLabels } from "@/lib/validators";

type Values = z.infer<typeof addDoctorSchema>;

export default function AddDoctorPage() {
  const { session } = useAuth();
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(addDoctorSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      speciality: "General physician",
      degree: "",
      experience: "3 Years",
      about: "",
      fees: "",
      address1: "",
      address2: "",
    },
  });

  async function onSubmit(values: Values) {
    if (!session) return;
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("password", values.password);
    formData.set("speciality", values.speciality);
    formData.set("degree", values.degree);
    formData.set("experience", values.experience);
    formData.set("about", values.about);
    formData.set("fees", values.fees);
    formData.set("address1", values.address1);
    formData.set("address2", values.address2 ?? "");
    formData.set("image", values.image[0]);
    try {
      await api("/doctors", { token: session.token, form: formData });
      toast.success("Doctor added");
      router.push("/admin/doctors");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add the doctor");
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold tracking-tight">Add a doctor</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 grid gap-4 rounded-2xl border border-[#e6edf5] bg-white p-5 shadow-[0_8px_30px_rgba(18,32,51,0.04)] sm:grid-cols-2"
      >
        <Field label="Name" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" {...form.register("email")} />
        </Field>
        <Field label="Password" error={form.formState.errors.password?.message}>
          <PasswordInput autoComplete="new-password" {...form.register("password")} />
        </Field>
        <Field label="Fees (USD)" error={form.formState.errors.fees?.message}>
          <Input inputMode="numeric" {...form.register("fees")} />
        </Field>
        <Field label="Speciality" error={form.formState.errors.speciality?.message}>
          <Controller
            control={form.control}
            name="speciality"
            render={({ field }) => (
              <CommonSelect
                className="w-full"
                placeholder="Select a speciality"
                value={field.value}
                onValueChange={field.onChange}
                item={specialityLabels.map((label) => ({ label, value: label }))}
              />
            )}
          />
        </Field>
        <Field label="Experience" error={form.formState.errors.experience?.message}>
          <Controller
            control={form.control}
            name="experience"
            render={({ field }) => (
              <CommonSelect
                className="w-full"
                placeholder="Select experience"
                value={field.value}
                onValueChange={field.onChange}
                item={experienceOptions.map((label) => ({ label, value: label }))}
              />
            )}
          />
        </Field>
        <Field label="Degree" error={form.formState.errors.degree?.message}>
          <Input {...form.register("degree")} placeholder="MBBS" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Photo" error={form.formState.errors.image?.message as string | undefined}>
            <PhotoUpload registration={form.register("image")} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="About" error={form.formState.errors.about?.message}>
            <Textarea {...form.register("about")} />
          </Field>
        </div>
        <Field label="Address line 1" error={form.formState.errors.address1?.message}>
          <Input {...form.register("address1")} />
        </Field>
        <Field label="Address line 2" error={form.formState.errors.address2?.message}>
          <Input {...form.register("address2")} />
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save doctor"}
          </Button>
        </div>
      </form>
    </div>
  );
}
