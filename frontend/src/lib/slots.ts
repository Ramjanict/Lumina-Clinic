export function money(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(slotTime: string) {
  const [hours, minutes] = slotTime.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function formatSlot(slotDate: string, slotTime: string) {
  const [year, month, day] = slotDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const label = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return `${label} · ${formatTime(slotTime)}`;
}

export type SlotDay = {
  slotDate: string;
  weekday: string;
  label: string;
  times: string[];
};

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildDays(
  booked: { slotDate: string; slotTime: string }[] = [],
): SlotDay[] {
  const taken = new Set(booked.map((item) => `${item.slotDate}|${item.slotTime}`));
  const now = new Date();
  const days: SlotDay[] = [];

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + index);
    const slotDate = isoDate(date);
    const times: string[] = [];

    for (let minutes = 10 * 60 + 30; minutes <= 20 * 60 + 30; minutes += 30) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const slotTime = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
      if (index === 0) {
        const slotAt = new Date(date);
        slotAt.setHours(hours, mins, 0, 0);
        if (slotAt.getTime() <= now.getTime()) continue;
      }
      if (!taken.has(`${slotDate}|${slotTime}`)) times.push(slotTime);
    }

    days.push({
      slotDate,
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      times,
    });
  }

  return days;
}
