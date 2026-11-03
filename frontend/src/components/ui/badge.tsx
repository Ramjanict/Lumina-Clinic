import { cn } from "@/lib/utils";

const tones = {
  booked: "bg-amber-100 text-amber-950",
  paid: "bg-emerald-100 text-emerald-950",
  completed: "bg-sky-100 text-sky-950",
  cancelled: "bg-stone-200 text-stone-600",
  neutral: "bg-foam text-clinic-dark",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
