import { useId } from "react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  markClassName,
  wordmark = true,
}: {
  className?: string;
  markClassName?: string;
  wordmark?: boolean;
}) {
  const rawId = useId().replace(/:/g, "");
  const gradientId = `lumina-${rawId}`;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 40" className={cn("h-9 w-9 shrink-0", markClassName)} aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="4" y1="2" x2="36" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2BC4BB" />
            <stop offset="1" stopColor="#0B7C76" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill={`url(#${gradientId})`} />
        <path
          d="M11.5 28.5V15.2c0-.7.5-1.2 1.2-1.2H20"
          fill="none"
          stroke="white"
          strokeWidth="2.7"
          strokeLinecap="round"
        />
        <path
          d="M20 14l3.2 6.5 3.15-8.5L31 21.5"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {wordmark ? (
        <span className="leading-none">
          <span className="block text-[17px] font-extrabold tracking-tight text-ink">Lumina</span>
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-clinic">
            Clinic
          </span>
        </span>
      ) : null}
    </span>
  );
}
