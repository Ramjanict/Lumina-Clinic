"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CommonSelect from "@/components/common-select";
import { Field } from "@/components/field";
import { PhotoUpload } from "@/components/photo-upload";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { UserProfile } from "@/lib/types";
import { profileSchema } from "@/lib/validators";

type Values = z.infer<typeof profileSchema>;

function AccountForm() {
  const { session } = useAuth();
  const [photo, setPhoto] = useState("");
  const form = useForm<Values>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      address1: "",
      address2: "",
      gender: "Not selected",
      dob: "",
    },
  });

  useEffect(() => {
    if (!session) return;
    api<UserProfile>("/users/me", { token: session.token })
      .then((profile) => {
        form.reset({
          name: profile.name,
          phone: profile.phone,
          address1: profile.address1,
          address2: profile.address2,
          gender: (profile.gender as Values["gender"]) || "Not selected",
          dob: profile.dob,
        });
        setPhoto(profile.image);
      })
      .catch((error: Error) => toast.error(error.message));
    // form.reset is stable enough for the initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function onSubmit(values: Values) {
    if (!session) return;
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("phone", values.phone);
    formData.set("address1", values.address1);
    formData.set("address2", values.address2);
    formData.set("gender", values.gender);
    formData.set("dob", values.dob);
    const file = values.image?.[0] as File | undefined;
    if (file) formData.set("image", file);
    try {
      await api("/users/me", { method: "PATCH", token: session.token, form: formData });
      toast.success("Profile saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-serif text-4xl">Your profile</h1>
      <p className="mt-2 text-sm text-ink/60">{session?.email}</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Field label="Name" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} />
        </Field>
        <Field label="Phone" error={form.formState.errors.phone?.message}>
          <Input {...form.register("phone")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Gender" error={form.formState.errors.gender?.message}>
            <Controller
              control={form.control}
              name="gender"
              render={({ field }) => (
                <CommonSelect
                  className="w-full"
                  placeholder="Select gender"
                  value={field.value}
                  onValueChange={field.onChange}
                  item={[
                    { label: "Not selected", value: "Not selected" },
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
                  ]}
                />
              )}
            />
          </Field>
          <Field label="Date of birth" error={form.formState.errors.dob?.message}>
            <Input type="date" {...form.register("dob")} />
          </Field>
        </div>
        <Field label="Address line 1" error={form.formState.errors.address1?.message}>
          <Input {...form.register("address1")} />
        </Field>
        <Field label="Address line 2" error={form.formState.errors.address2?.message}>
          <Input {...form.register("address2")} />
        </Field>
        <Field label="Photo" error={form.formState.errors.image?.message as string | undefined}>
          <PhotoUpload registration={form.register("image")} currentUrl={photo} />
        </Field>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Save profile
        </Button>
      </form>
    </div>
  );
}

export default function AccountPage() {
  return (
    <RequireAuth role="USER">
      <AccountForm />
    </RequireAuth>
  );
}
