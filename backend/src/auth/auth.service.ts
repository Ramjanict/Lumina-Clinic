import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from "../common/constants";
import { LoginDto, RegisterDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const password = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name.trim(),
          email,
          password,
        },
      });
      return this.tokenFor(user.id, "USER", user.email, user.name);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("An account with this email already exists");
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const adminEmail = this.config.getOrThrow<string>("ADMIN_EMAIL").toLowerCase().trim();
    const adminPassword = this.config.getOrThrow<string>("ADMIN_PASSWORD");

    if (email === adminEmail) {
      if (dto.password !== adminPassword) {
        throw new UnauthorizedException("Email or password is incorrect");
      }
      return this.tokenFor("admin", "ADMIN", adminEmail, "Admin");
    }

    const [doctor, user] = await Promise.all([
      this.prisma.doctor.findUnique({ where: { email } }),
      this.prisma.user.findUnique({ where: { email } }),
    ]);

    if (doctor && (await bcrypt.compare(dto.password, doctor.password))) {
      return this.tokenFor(doctor.id, "DOCTOR", doctor.email, doctor.name);
    }
    if (user && (await bcrypt.compare(dto.password, user.password))) {
      return this.tokenFor(user.id, "USER", user.email, user.name);
    }

    throw new UnauthorizedException("Email or password is incorrect");
  }

  private async tokenFor(id: string, role: Role, email: string, name: string) {
    const token = await this.jwt.signAsync({ sub: id, role, email });
    return { token, role, email, name };
  }
}
