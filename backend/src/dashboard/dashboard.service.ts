import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  appointmentInclude,
  dayKey,
  presentAppointment,
} from "../common/presenters";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async admin() {
    const [doctors, patients, appointments, paidRows, latest, series, specialities] =
      await Promise.all([
        this.prisma.doctor.count(),
        this.prisma.user.count(),
        this.prisma.appointment.count({ where: { cancelled: false } }),
        this.prisma.appointment.findMany({
          where: { paid: true, cancelled: false },
          select: { amount: true },
        }),
        this.latest(),
        this.series(),
        this.specialities(),
      ]);

    return {
      doctors,
      patients,
      appointments,
      earnings: paidRows.reduce((sum, row) => sum + row.amount, 0),
      latest,
      series,
      specialities,
    };
  }

  async doctor(doctorId: string) {
    const [appointments, patients, paidRows, latest, series] = await Promise.all([
      this.prisma.appointment.count({
        where: { doctorId, cancelled: false },
      }),
      this.prisma.appointment.findMany({
        where: { doctorId, cancelled: false },
        distinct: ["userId"],
        select: { userId: true },
      }),
      this.prisma.appointment.findMany({
        where: { doctorId, paid: true, cancelled: false },
        select: { amount: true },
      }),
      this.latest(doctorId),
      this.series(doctorId),
    ]);

    return {
      appointments,
      patients: patients.length,
      earnings: paidRows.reduce((sum, row) => sum + row.amount, 0),
      latest,
      series,
    };
  }

  private async latest(doctorId?: string) {
    const rows = await this.prisma.appointment.findMany({
      where: doctorId ? { doctorId } : undefined,
      include: appointmentInclude,
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return rows.map(presentAppointment);
  }

  private async series(doctorId?: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 13);

    const rows = await this.prisma.appointment.findMany({
      where: {
        createdAt: { gte: start },
        ...(doctorId ? { doctorId } : {}),
      },
      select: {
        createdAt: true,
        amount: true,
        paid: true,
        cancelled: true,
      },
    });

    const days: { date: string; appointments: number; earnings: number }[] = [];
    for (let i = 0; i < 14; i += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = dayKey(date);
      const items = rows.filter((row) => dayKey(row.createdAt) === key);
      days.push({
        date: key,
        appointments: items.filter((item) => !item.cancelled).length,
        earnings: items
          .filter((item) => item.paid && !item.cancelled)
          .reduce((sum, item) => sum + item.amount, 0),
      });
    }
    return days;
  }

  private async specialities() {
    const doctors = await this.prisma.doctor.findMany({
      select: { speciality: true },
    });
    const counts = new Map<string, number>();
    for (const doctor of doctors) {
      counts.set(doctor.speciality, (counts.get(doctor.speciality) ?? 0) + 1);
    }
    return [...counts.entries()].map(([name, value]) => ({ name, value }));
  }
}
