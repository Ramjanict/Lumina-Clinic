export type Doctor = {
  id: string;
  name: string;
  email?: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  available: boolean;
  fees: number;
  address1: string;
  address2: string;
  booked?: { slotDate: string; slotTime: string }[];
  _count?: { appointments: number };
};

export type Appointment = {
  id: string;
  slotDate: string;
  slotTime: string;
  amount: number;
  status: "booked" | "paid" | "completed" | "cancelled";
  createdAt: string;
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
};

export type SeriesPoint = {
  date: string;
  appointments: number;
  earnings: number;
};

export type AdminDashboard = {
  doctors: number;
  patients: number;
  appointments: number;
  earnings: number;
  latest: Appointment[];
  series: SeriesPoint[];
  specialities: { name: string; value: number }[];
};

export type DoctorDashboard = {
  appointments: number;
  patients: number;
  earnings: number;
  latest: Appointment[];
  series: SeriesPoint[];
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string;
  address1: string;
  address2: string;
  gender: string;
  dob: string;
  phone: string;
};
