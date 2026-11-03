import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { CloudinaryService, UploadedFile } from "../cloudinary/cloudinary.service";
import { PrismaService } from "../prisma/prisma.service";
import { SPECIALITIES } from "../common/constants";
import { dayKey } from "../common/presenters";
import { CreateDoctorDto, UpdateDoctorDto } from "./dto";

const publicSelect = {
  id: true,
  name: true,
  image: true,
  speciality: true,
  degree: true,
  experience: true,
  about: true,
  available: true,
  fees: true,
  address1: true,
  address2: true,
} as const;

const selfSelect = {
  ...publicSelect,
  email: true,
} as const;

@Injectable()
export class DoctorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async list(speciality?: string) {
    const filter =
      speciality && (SPECIALITIES as readonly string[]).includes(speciality)
        ? { speciality }
        : {};
    return this.prisma.doctor.findMany({
      where: filter,
      select: publicSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async adminList() {
    return this.prisma.doctor.findMany({
      select: {
        ...selfSelect,
        _count: { select: { appointments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async detail(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      select: publicSelect,
    });
    if (!doctor) throw new NotFoundException("Doctor not found");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - 1);

    const booked = await this.prisma.appointment.findMany({
      where: {
        doctorId: id,
        cancelled: false,
        slotDate: { gte: dayKey(today) },
      },
      select: { slotDate: true, slotTime: true },
    });

    return { ...doctor, booked };
  }

  async me(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      select: selfSelect,
    });
    if (!doctor) throw new NotFoundException("Doctor not found");
    return doctor;
  }

  async create(dto: CreateDoctorDto, file?: UploadedFile) {
    const image = await this.cloudinary.upload(file);
    const password = await bcrypt.hash(dto.password, 10);
    try {
      return await this.prisma.doctor.create({
        data: {
          name: dto.name.trim(),
          email: dto.email.toLowerCase().trim(),
          password,
          image,
          speciality: dto.speciality,
          degree: dto.degree.trim(),
          experience: dto.experience.trim(),
          about: dto.about.trim(),
          fees: dto.fees,
          address1: dto.address1.trim(),
          address2: dto.address2?.trim() ?? "",
        },
        select: selfSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("A doctor with this email already exists");
      }
      throw error;
    }
  }

  async updateMe(id: string, dto: UpdateDoctorDto) {
    await this.me(id);
    return this.prisma.doctor.update({
      where: { id },
      data: {
        ...(dto.available !== undefined ? { available: dto.available } : {}),
        ...(dto.fees !== undefined ? { fees: dto.fees } : {}),
        ...(dto.about !== undefined ? { about: dto.about.trim() } : {}),
        ...(dto.address1 !== undefined ? { address1: dto.address1.trim() } : {}),
        ...(dto.address2 !== undefined ? { address2: dto.address2.trim() } : {}),
      },
      select: selfSelect,
    });
  }

  async toggleAvailability(id: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException("Doctor not found");
    return this.prisma.doctor.update({
      where: { id },
      data: { available: !doctor.available },
      select: { id: true, available: true },
    });
  }
}
