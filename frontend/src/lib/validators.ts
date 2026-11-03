import { z } from "zod";

export const specialityLabels = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
] as const;

export const experienceOptions = [
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
  "5 Years",
  "6 Years",
  "8 Years",
  "10 Years",
  "12 Years",
];

const fee = z
  .string()
  .min(1, "Enter a fee")
  .refine((value) => {
    const amount = Number(value);
    return Number.isInteger(amount) && amount >= 1 && amount <= 100000;
  }, "Enter a whole number from 1 to 100000");

const photo = z
  .any()
  .refine((files) => files instanceof FileList && files.length > 0, "Photo is required")
  .refine((files) => files?.[0]?.size <= 2 * 1024 * 1024, "Image must be under 2MB")
  .refine(
    (files) => ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
    "Use a JPG, PNG, or WEBP image",
  );

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Write at least 10 characters"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().max(20, "Phone is too long"),
  address1: z.string().max(120, "Address is too long"),
  address2: z.string().max(120, "Address is too long"),
  gender: z.enum(["Male", "Female", "Other", "Not selected"]),
  dob: z.string(),
  image: z.any().refine((files) => {
    if (!files || typeof files.length !== "number" || files.length === 0) return true;
    const file = files[0] as File;
    return (
      file.size <= 2 * 1024 * 1024 &&
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );
  }, "Use a JPG, PNG, or WEBP under 2MB"),
});

export const addDoctorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
  speciality: z.enum(specialityLabels),
  degree: z.string().min(2, "Degree is required"),
  experience: z.string().min(2, "Select experience"),
  about: z.string().min(10, "Write a short bio"),
  fees: fee,
  address1: z.string().min(3, "Address is required"),
  address2: z.string().optional(),
  image: photo,
});

export const doctorProfileSchema = z.object({
  fees: fee,
  about: z.string().min(10, "Write at least 10 characters"),
  address1: z.string().min(3, "Address is required"),
  address2: z.string(),
  available: z.boolean(),
});

export const bookSchema = z.object({
  slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a day"),
  slotTime: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time"),
});
