export const SPECIALITIES = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
] as const;

export type Speciality = (typeof SPECIALITIES)[number];

export const ROLES = ["USER", "DOCTOR", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export type AuthUser = {
  id: string;
  role: Role;
  email: string;
};
