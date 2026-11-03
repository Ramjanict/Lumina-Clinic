"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Field } from "@/components/field";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { api } from "@/lib/api";
import type { Session } from "@/lib/auth";
import { useAuth } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

type Values = z.infer<typeof registerSchema>;

const portrait =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1400&q=80";

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const form = useForm<Values>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: Values) {
    try {
      const session = await api<Session>("/auth/register", {
        json: { name: values.name, email: values.email, password: values.password },
      });
      setSession(session);
      toast.success("Account created");
      router.push("/doctors");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the account");
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-7rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative hidden overflow-hidden lg:block"
      >
        <img
          src={portrait}
          alt="A clinician in a white coat"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#073734] via-[#073734]/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">New patient</p>
          <p className="mt-3 max-w-sm text-4xl font-extrabold leading-tight">
            Create a record, then book this week.
          </p>
        </div>
      </motion.aside>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center px-5 py-12 sm:px-10"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
          <Logo />
          <div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight">Create your record</h1>
            <p className="mt-2 text-sm text-ink/65">You will use this to book and manage visits.</p>
          </div>
          <Field label="Name" error={form.formState.errors.name?.message}>
            <Input autoComplete="name" {...form.register("name")} />
          </Field>
          <Field label="Email" error={form.formState.errors.email?.message}>
            <Input type="email" autoComplete="email" {...form.register("email")} />
          </Field>
          <Field label="Password" error={form.formState.errors.password?.message}>
            <PasswordInput autoComplete="new-password" {...form.register("password")} />
          </Field>
          <Field label="Confirm password" error={form.formState.errors.confirmPassword?.message}>
            <PasswordInput autoComplete="new-password" {...form.register("confirmPassword")} />
          </Field>
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating…" : "Create account"}
          </Button>
          <p className="text-sm text-ink/60">
            Already registered?{" "}
            <Link className="font-semibold text-clinic" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
