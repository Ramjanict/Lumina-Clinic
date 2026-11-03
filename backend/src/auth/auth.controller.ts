import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "../common/decorators";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";

@ApiTags("Authentication")
@Controller("auth")
@Public()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new patient" })
  @ApiResponse({ status: 201, description: "Patient registered successfully, returns JWT token" })
  @ApiResponse({ status: 409, description: "Email already registered" })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post("login")
  @ApiOperation({ summary: "Unified login for Patients, Doctors, and Admin" })
  @ApiResponse({ status: 200, description: "Authenticated successfully, returns JWT token and role" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }
}
