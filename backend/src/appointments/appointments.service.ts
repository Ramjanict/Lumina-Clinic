import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthUser } from "../common/constants";
import {
  appointmentInclude,
  isBookableSlot,
  presentAppointment,
} from "../common/presenters";
import { BookAppointmentDto } from "./dto";

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async book(userId: string, dto: BookAppointmentDto) {
    if (!isBookableSlot(dto.slotDate, dto.slotTime)) {
      throw new BadRequestException("Choose an open time in the next 7 days");
    }

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: dto.doctorId },
    });
    if (!doctor) throw new NotFoundException("Doctor not found");
    if (!doctor.available) {
      throw new BadRequestException("This doctor is not taking appointments");
    }

    const taken = await this.prisma.appointment.findFirst({
      where: {
        doctorId: dto.doctorId,
        slotDate: dto.slotDate,
        slotTime: dto.slotTime,
        cancelled: false,
      },
    });
    if (taken) throw new ConflictException("That time was just booked");

    const created = await this.prisma.appointment.create({
      data: {
        userId,
        doctorId: dto.doctorId,
        slotDate: dto.slotDate,
        slotTime: dto.slotTime,
        amount: doctor.fees,
      },
      include: appointmentInclude,
    });
    return presentAppointment(created);
  }

  async mine(userId: string) {
    const rows = await this.prisma.appointment.findMany({
      where: { userId },
      include: appointmentInclude,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(presentAppointment);
  }

  async forDoctor(doctorId: string) {
    const rows = await this.prisma.appointment.findMany({
      where: { doctorId },
      include: appointmentInclude,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(presentAppointment);
  }

  async all() {
    const rows = await this.prisma.appointment.findMany({
      include: appointmentInclude,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(presentAppointment);
  }

  async cancel(actor: AuthUser, id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.isCompleted) {
      throw new BadRequestException("A completed visit cannot be cancelled");
    }
    if (appointment.cancelled) {
      throw new BadRequestException("This appointment is already cancelled");
    }

    const allowed =
      actor.role === "ADMIN" ||
      (actor.role === "USER" && appointment.userId === actor.id) ||
      (actor.role === "DOCTOR" && appointment.doctorId === actor.id);
    if (!allowed) throw new ForbiddenException("You cannot cancel this appointment");

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { cancelled: true },
      include: appointmentInclude,
    });
    return presentAppointment(updated);
  }

  async complete(doctorId: string, id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.doctorId !== doctorId) {
      throw new ForbiddenException("You cannot complete this appointment");
    }
    if (appointment.cancelled) {
      throw new BadRequestException("This appointment is cancelled");
    }
    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { isCompleted: true, paid: true },
      include: appointmentInclude,
    });
    return presentAppointment(updated);
  }

  async markPaid(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.cancelled) {
      throw new BadRequestException("A cancelled appointment cannot be paid");
    }
    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { paid: true },
      include: appointmentInclude,
    });
    return presentAppointment(updated);
  }
}
