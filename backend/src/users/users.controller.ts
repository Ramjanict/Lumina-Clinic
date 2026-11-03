import {
  Body,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { CurrentUser } from "../common/current-user.decorator";
import { Roles } from "../common/decorators";
import { AuthUser } from "../common/constants";
import { UploadedFile as StoredFile } from "../cloudinary/cloudinary.service";
import { UpdateUserDto } from "./dto";
import { UsersService } from "./users.service";

@ApiTags("Users & Profile")
@ApiBearerAuth("JWT-auth")
@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("me")
  @Roles("USER")
  @ApiOperation({ summary: "Get current logged-in patient profile" })
  @ApiResponse({ status: 200, description: "Patient profile data" })
  me(@CurrentUser() user: AuthUser) {
    return this.users.me(user.id);
  }

  @Patch("me")
  @Roles("USER")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: "Update patient profile with optional avatar image" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 200, description: "Updated patient profile" })
  update(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: StoredFile,
  ) {
    return this.users.update(user.id, dto, file);
  }
}
