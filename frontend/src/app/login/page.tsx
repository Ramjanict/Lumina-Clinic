"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Field } from "@/components/field";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { api } from "@/lib/api";
import { homeFor, type Session, useAuth } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

type Values = z.infer<typeof loginSchema>;

function destination(role: Session["role"], next: string | null) {
  const safe = next && next.startsWith("/") && !next.startsWith("//") ? next : "";
  if (role === "ADMIN") return safe.startsWith("/admin") ? safe : "/admin";
  if (role === "DOCTOR") return safe.startsWith("/doctor") ? safe : "/doctor";
  if (safe.startsWith("/admin") || safe.startsWith("/doctor")) return homeFor(role);
  return safe || homeFor(role);
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { session, setSession } = useAuth();
  const form = useForm<Values>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (session) router.replace(homeFor(session.role));
  }, [session, router]);

  async function onSubmit(values: Values) {
    try {
      const nextSession = await api<Session>("/auth/login", { json: values });
      setSession(nextSession);
      toast.success("Signed in");
      router.push(destination(nextSession.role, params.get("next")));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in");
    }
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-2">
      <div className="hidden lg:block">
        <Logo />
        <p className="mt-8 max-w-md text-5xl font-extrabold leading-tight tracking-tight">
          Sign in to your clinic record.
        </p>
        <p className="mt-4 max-w-md text-ink/70">
          One login. Patients, doctors, and the desk each land on their own page.
        </p>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 rounded-[2rem] border border-line bg-white p-6 shadow-card"
      >
        <div className="lg:hidden">
          <Logo />
        </div>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" autoComplete="email" {...form.register("email")} />
        </Field>
        <Field label="Password" error={form.formState.errors.password?.message}>
          <PasswordInput autoComplete="current-password" {...form.register("password")} />
        </Field>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-center text-sm text-ink/60">
          New patient? <Link className="font-semibold text-clinic" href="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm text-ink/60">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
