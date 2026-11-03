export function presentAppointment(row: {
  id: string;
  slotDate: string;
  slotTime: string;
  amount: number;
  cancelled: boolean;
  paid: boolean;
  isCompleted: boolean;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    phone: string;
  };
  doctor: {
    id: string;
    name: string;
    image: string;
    speciality: string;
    fees: number;
  };
}) {
  let status: "cancelled" | "completed" | "paid" | "booked" = "booked";
  if (row.cancelled) status = "cancelled";
  else if (row.isCompleted) status = "completed";
  else if (row.paid) status = "paid";

  return {
    id: row.id,
    slotDate: row.slotDate,
    slotTime: row.slotTime,
    amount: row.amount,
    status,
    createdAt: row.createdAt,
    user: row.user,
    doctor: row.doctor,
  };
}

export const appointmentInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
    },
  },
  doctor: {
    select: {
      id: true,
      name: true,
      image: true,
      speciality: true,
      fees: true,
    },
  },
} as const;

export function isBookableSlot(slotDate: string, slotTime: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slotDate)) return false;
  if (!/^\d{2}:\d{2}$/.test(slotTime)) return false;

  const [hours, minutes] = slotTime.split(":").map(Number);
  if (minutes !== 0 && minutes !== 30) return false;
  const total = hours * 60 + minutes;
  if (total < 10 * 60 + 30 || total > 20 * 60 + 30) return false;

  const [year, month, day] = slotDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const earliest = new Date(today);
  earliest.setDate(today.getDate() - 1);
  const latest = new Date(today);
  latest.setDate(today.getDate() + 7);
  return date >= earliest && date <= latest;
}

export function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
