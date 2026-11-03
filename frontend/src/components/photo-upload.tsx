"use client";

import { ImagePlus } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export function PhotoUpload({
  registration,
  currentUrl,
}: {
  registration: UseFormRegisterReturn;
  currentUrl?: string;
}) {
  const id = useId();
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const shown = preview || currentUrl || "";

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-dashed border-line bg-paper px-3 py-3">
      <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-foam text-clinic">
        {shown ? (
          <img src={shown} alt="Photo preview" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus className="h-6 w-6" aria-hidden />
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">
          {fileName || (currentUrl ? "Current photo" : "No photo selected")}
        </p>
        <p className="mt-0.5 text-xs text-ink/50">JPG, PNG, or WEBP</p>
        <label
          htmlFor={id}
          className="mt-2 inline-flex h-8 cursor-pointer items-center rounded-lg bg-clinic px-3 text-xs font-medium text-white transition hover:bg-clinic-dark"
        >
          {shown ? "Change photo" : "Choose photo"}
        </label>
      </div>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        name={registration.name}
        onBlur={registration.onBlur}
        ref={registration.ref}
        onChange={(event) => {
          void registration.onChange(event);
          const file = event.target.files?.[0];
          setFileName(file?.name ?? "");
          setPreview((current) => {
            if (current) URL.revokeObjectURL(current);
            return file ? URL.createObjectURL(file) : null;
          });
        }}
      />
    </div>
  );
}
