"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface SelectProps<T extends string> {
  value: T | undefined;
  item: readonly SelectOption<T>[];
  w?: number;
  onValueChange: (val: T) => void;
  className?: string;
  arrow?: string;
  placeholder?: string;
  disabled?: boolean;
}

const CommonSelect = <T extends string>({
  value,
  item,
  w = 120,
  onValueChange,
  disabled = false,
  className,
  placeholder,
}: SelectProps<T>) => {
  return (
    <Select
      value={value || undefined}
      onValueChange={(next) => onValueChange(next as T)}
      disabled={disabled}
    >
      <SelectTrigger
        style={{ minWidth: w }}
        disabled={disabled}
        className={cn("cursor-pointer", className, disabled && "cursor-not-allowed opacity-50")}
      >
        <SelectValue placeholder={placeholder || "Select an option"} />
      </SelectTrigger>
      <SelectContent className="rounded-xl border border-line bg-white shadow-card">
        {item.map((option, index) => (
          <SelectItem key={option.value + index} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CommonSelect;
