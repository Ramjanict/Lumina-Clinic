import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService, UploadedFile } from "../cloudinary/cloudinary.service";
import { UpdateUserDto } from "./dto";

const userSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  address1: true,
  address2: true,
  gender: true,
  dob: true,
  phone: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async me(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
    if (!user) throw new NotFoundException("Account not found");
    return user;
  }

  async update(id: string, dto: UpdateUserDto, file?: UploadedFile) {
    await this.me(id);
    const image = file ? await this.cloudinary.upload(file) : undefined;
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone.trim() } : {}),
        ...(dto.address1 !== undefined ? { address1: dto.address1.trim() } : {}),
        ...(dto.address2 !== undefined ? { address2: dto.address2.trim() } : {}),
        ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
        ...(dto.dob !== undefined ? { dob: dto.dob } : {}),
        ...(image ? { image } : {}),
      },
      select: userSelect,
    });
  }
}
