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
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { CurrentUser } from "../common/current-user.decorator";
import { Public, Roles } from "../common/decorators";
import { AuthUser } from "../common/constants";
import { UploadedFile as StoredFile } from "../cloudinary/cloudinary.service";
import { CreateDoctorDto, UpdateDoctorDto } from "./dto";
import { DoctorsService } from "./doctors.service";

@ApiTags("Doctors")
@Controller("doctors")
export class DoctorsController {
  constructor(private readonly doctors: DoctorsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "List all doctors (optional filter by speciality)" })
  @ApiQuery({ name: "speciality", required: false, description: "Filter by medical speciality" })
  @ApiResponse({ status: 200, description: "List of available doctors" })
  list(@Query("speciality") speciality?: string) {
    return this.doctors.list(speciality);
  }

  @Get("admin")
  @Roles("ADMIN")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "List all doctors with appointment counts (Admin only)" })
  @ApiResponse({ status: 200, description: "Admin doctor roster" })
  adminList() {
    return this.doctors.adminList();
  }

  @Get("me")
  @Roles("DOCTOR")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get current doctor profile (Doctor only)" })
  @ApiResponse({ status: 200, description: "Current doctor profile" })
  me(@CurrentUser() user: AuthUser) {
    return this.doctors.me(user.id);
  }

  @Patch("me")
  @Roles("DOCTOR")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update current doctor profile/fees/availability (Doctor only)" })
  @ApiResponse({ status: 200, description: "Updated doctor profile" })
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateDoctorDto) {
    return this.doctors.updateMe(user.id, dto);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get doctor details including upcoming booked slots" })
  @ApiResponse({ status: 200, description: "Doctor profile with booked slots list" })
  @ApiResponse({ status: 404, description: "Doctor not found" })
  detail(@Param("id") id: string) {
    return this.doctors.detail(id);
  }

  @Post()
  @Roles("ADMIN")
  @ApiBearerAuth("JWT-auth")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: "Onboard a new doctor with photo upload (Admin only)" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "Doctor successfully onboarded" })
  @ApiResponse({ status: 409, description: "Doctor email already exists" })
  create(@Body() dto: CreateDoctorDto, @UploadedFile() file?: StoredFile) {
    return this.doctors.create(dto, file);
  }

  @Patch(":id/availability")
  @Roles("ADMIN")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Toggle doctor availability on/off (Admin only)" })
  @ApiResponse({ status: 200, description: "Availability status toggled" })
  toggle(@Param("id") id: string) {
    return this.doctors.toggleAvailability(id);
  }
}
