import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { CurrentUser } from "../common/current-user.decorator";
import { Public, Roles } from "../common/decorators";
import { AuthUser } from "../common/constants";
import { UploadedFile as StoredFile } from "../cloudinary/cloudinary.service";
import { CreateDoctorDto, UpdateDoctorDto } from "./dto";
import { DoctorsService } from "./doctors.service";

@Controller("doctors")
export class DoctorsController {
  constructor(private readonly doctors: DoctorsService) {}

  @Get()
  @Public()
  list(@Query("speciality") speciality?: string) {
    return this.doctors.list(speciality);
  }

  @Get("admin")
  @Roles("ADMIN")
  adminList() {
    return this.doctors.adminList();
  }

  @Get("me")
  @Roles("DOCTOR")
  me(@CurrentUser() user: AuthUser) {
    return this.doctors.me(user.id);
  }

  @Patch("me")
  @Roles("DOCTOR")
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateDoctorDto) {
    return this.doctors.updateMe(user.id, dto);
  }

  @Get(":id")
  @Public()
  detail(@Param("id") id: string) {
    return this.doctors.detail(id);
  }

  @Post()
  @Roles("ADMIN")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  create(@Body() dto: CreateDoctorDto, @UploadedFile() file?: StoredFile) {
    return this.doctors.create(dto, file);
  }

  @Patch(":id/availability")
  @Roles("ADMIN")
  toggle(@Param("id") id: string) {
    return this.doctors.toggleAvailability(id);
  }
}
