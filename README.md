# 🏥 Lumina Clinic — Doctor Appointment & Management Platform

A modern, full-stack doctor appointment booking and healthcare practice management system. Built with **Next.js 15 (App Router)** and **NestJS 11**, powered by **Prisma ORM**, **Neon PostgreSQL**, and **Cloudinary**.

---

## 🌟 Key Features

### 🧑‍💼 Patient Portal
- **Account & Authentication**: Fast sign-up, secure JWT authentication, and session persistence.
- **Doctor Discovery**: Search doctors by name, filter by speciality (*General physician, Gynecologist, Dermatologist, Pediatricians, Neurologist, Gastroenterologist*), or toggle "Available now".
- **Dynamic 7-Day Slot Booking**: Real-time calendar generating 30-minute consultation slots (10:30 AM – 8:30 PM), automatic exclusion of past hours today, and instant conflict detection.
- **My Visits (`/appointments`)**: Live tracking of appointments with distinct status badges (`Booked`, `Paid`, `Completed`, `Cancelled`) and one-click cancellation.
- **Profile Management (`/account`)**: Manage personal details, address, gender, date of birth, and Cloudinary avatar upload.

### 🩺 Doctor Portal (`/doctor`)
- **Practice Analytics**: Real-time stats on total appointments, distinct patients seen, total earnings collected, and interactive 14-day booking/revenue trend charts powered by Recharts.
- **Appointments Desk (`/doctor/appointments`)**: Filter and search patient bookings. Mark appointments as completed (which automatically records consultation fees as collected) or cancel.
- **Practice Settings (`/doctor/profile`)**: Update consultation fees (USD), toggle appointment availability, update bio, and edit clinic addresses.

### 🛡️ Clinic Admin Desk (`/admin`)
- **Executive Dashboard**: Clinic-wide visibility into total doctors, registered patients, active bookings, total revenue, 14-day trend analytics, and speciality distribution breakdown.
- **Doctor Management (`/admin/doctors`)**: Directory of all clinic doctors with appointment counts and instant one-click availability toggles.
- **Doctor Onboarding (`/admin/doctors/new`)**: Multi-step form to register new physicians with credentials, speciality, bio, experience, fees, and photo uploads.
- **Master Appointments Desk (`/admin/appointments`)**: View all clinic bookings across all doctors, confirm cash/counter payments, and handle administrative cancellations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a clean medical clinic design system
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives (Select, Tabs, Slot, Label)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Animations & Feedback**: [Framer Motion](https://www.framer.com/motion/) & [Sonner](https://sonner.emilkowal.ski/) toasts
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [NestJS 11](https://nestjs.com/) (TypeScript, Express platform)
- **ORM & Database**: [Prisma 6](https://www.prisma.io/) with [Neon](https://neon.tech/) Serverless PostgreSQL
- **Security & Auth**: Passport JWT, Bcrypt password hashing, Class Validator & Transformer, Role Guards
- **Media Storage**: [Cloudinary](https://cloudinary.com/) (streaming file uploads via Multer memory storage)

---

## 📂 Project Architecture

```
Doctor-appointment-booking-app/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma           # Prisma data models (User, Doctor, Appointment)
│   ├── src/
│   │   ├── appointments/           # Booking logic, conflict checks, status transitions
│   │   ├── auth/                   # Unified register & login, JWT strategy, role guards
│   │   ├── cloudinary/             # Cloudinary upload service
│   │   ├── common/                 # Guards, decorators, constants, presenters, error filters
│   │   ├── dashboard/              # 14-day analytics, metrics, speciality stats
│   │   ├── doctors/                # Doctor CRUD, search, availability, profile updates
│   │   ├── prisma/                 # Prisma client service lifecycle
│   │   ├── users/                  # Patient profile & avatar management
│   │   ├── app.module.ts           # Root module registering all submodules
│   │   └── main.ts                 # NestJS application bootstrap & CORS configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   │   ├── (public)/           # Landing (/), /doctors, /about, /contact
│   │   │   ├── account/            # Patient profile management
│   │   │   ├── admin/              # Admin dashboard, roster, new doctor, all visits
│   │   │   ├── appointment/[id]/   # Slot picker & booking confirmation
│   │   │   ├── appointments/       # Patient's booked visits
│   │   │   ├── doctor/             # Doctor dashboard, appointments, practice profile
│   │   │   └── login & register/   # Unified auth flows
│   │   ├── components/             # Reusable UI & layout components
│   │   │   ├── ui/                 # Buttons, inputs, badges, select, tabs, modals
│   │   │   ├── appointment-table   # Unified appointment list for User/Doctor/Admin
│   │   │   ├── charts.tsx          # 14-day trend bar & area charts
│   │   │   ├── dashboard-shell.tsx # Responsive sidebar for Admin and Doctor studios
│   │   │   └── doctors-browser.tsx # Doctor grid with interactive search & filters
│   │   └── lib/                    # API client, auth context, slot math, validators
│   └── package.json
└── README.md
```

---

## 🗄️ Database Schema (`Prisma`)

```mermaid
erDiagram
    User ||--o{ Appointment : "books"
    Doctor ||--o{ Appointment : "conducts"

    User {
        String id PK
        String name
        String email UK
        String password
        String image
        String address1
        String address2
        String gender
        String dob
        String phone
        DateTime createdAt
    }

    Doctor {
        String id PK
        String name
        String email UK
        String password
        String image
        String speciality
        String degree
        String experience
        String about
        Boolean available
        Int fees
        String address1
        String address2
        DateTime createdAt
    }

    Appointment {
        String id PK
        String userId FK
        String doctorId FK
        String slotDate
        String slotTime
        Int amount
        Boolean cancelled
        Boolean paid
        Boolean isCompleted
        DateTime createdAt
    }
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or v20.x+)
- npm or pnpm
- PostgreSQL database (or free [Neon](https://neon.tech) instance)
- Cloudinary account for photo uploads

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` (see `backend/.env.example`):

```env
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="admin@12345"

PORT=4000
FRONTEND_URL="http://localhost:3000"
```

Sync the database schema and start the dev server:

```bash
npx prisma db push
npm run dev
```

The API will be running on `http://localhost:4000`.

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local` (see `frontend/.env.example`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Roles & Access

| Role | Access URL | How to Sign In |
|---|---|---|
| **Admin** | `/admin` | Use `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `backend/.env`<br>*(Default: `admin@gmail.com` / `admin@12345`)* |
| **Doctor** | `/doctor` | Created by the Admin in `/admin/doctors/new`. Use assigned email & password. |
| **Patient** | `/appointments` | Register at `/register` or sign in at `/login`. |

> **Single Sign-On Experience**: All users log in through the same `/login` form. The backend automatically determines the user role and routes them directly to their corresponding workspace.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new patient account |
| `POST` | `/api/auth/login` | Public | Unified sign-in for Patients, Doctors, and Admin |
| `GET` | `/api/doctors` | Public | List all doctors (supports `?speciality=...`) |
| `GET` | `/api/doctors/:id` | Public | Doctor detail + booked slot list for calendar sync |
| `GET` | `/api/doctors/admin` | Admin | Doctor roster with appointment volume metrics |
| `POST` | `/api/doctors` | Admin | Onboard new physician (with image upload) |
| `PATCH`| `/api/doctors/:id/availability` | Admin | Toggle doctor availability status |
| `GET` | `/api/doctors/me` | Doctor | Fetch logged-in doctor's profile |
| `PATCH`| `/api/doctors/me` | Doctor | Update practice fees, availability, bio, address |
| `POST` | `/api/appointments` | Patient | Book a 30-min consultation slot |
| `GET` | `/api/appointments/me` | Patient | View logged-in patient's visits |
| `GET` | `/api/appointments/doctor` | Doctor | View logged-in doctor's schedule |
| `GET` | `/api/appointments` | Admin | View all clinic appointments |
| `POST` | `/api/appointments/:id/cancel` | User / Doc / Admin | Cancel scheduled visit |
| `POST` | `/api/appointments/:id/complete`| Doctor | Mark appointment complete & fee collected |
| `POST` | `/api/appointments/:id/paid` | Admin | Mark appointment fee paid at clinic desk |
| `GET` | `/api/dashboard/admin` | Admin | Summary metrics, revenue, 14-day series, specialities |
| `GET` | `/api/dashboard/doctor` | Doctor | Practice metrics, patient volume, 14-day series |
| `GET` | `/api/users/me` | Patient | Get patient profile details |
| `PATCH`| `/api/users/me` | Patient | Update patient profile & avatar |

---

## 🚢 Deployment

### Backend (Node / VPS / Render / Railway / Fly.io)
1. Set all environment variables on your platform.
2. Ensure `FRONTEND_URL` points to your public frontend origin (e.g., `https://your-domain.com`).
3. Run:
   ```bash
   npm install
   npx prisma db push
   npm run build
   npm run start:prod
   ```

### Frontend (Vercel / Netlify / Cloudflare)
1. Connect your repository to Vercel or your preferred host.
2. Set `NEXT_PUBLIC_API_URL` to your production backend URL (no trailing slash).
3. Deploy! Next.js will build and serve all static and dynamic pages automatically.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
