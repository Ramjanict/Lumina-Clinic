"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/lib/validators";

type Values = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const form = useForm<Values>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  function onSubmit(values: Values) {
    form.reset();
    toast.success(`Thanks ${values.name}. We received your note.`);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-clinic">Contact</p>
        <h1 className="mt-3 font-serif text-5xl">Write to the desk.</h1>
        <p className="mt-4 max-w-md text-lg leading-8 text-ink/70">
          Questions about a booking, a doctor profile, or access for staff can come through here.
        </p>
        <p className="mt-8 text-sm text-ink/60">mdramjan.ict@gmail.com</p>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-[2rem] border border-line bg-white p-6"
      >
        <Field label="Name" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" {...form.register("email")} />
        </Field>
        <Field label="Message" error={form.formState.errors.message?.message}>
          <Textarea {...form.register("message")} />
        </Field>
        <Button type="submit">Send message</Button>
      </form>
    </div>
  );
}
