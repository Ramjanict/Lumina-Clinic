import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../common/current-user.decorator";
import { Roles } from "../common/decorators";
import { AuthUser } from "../common/constants";
import { AppointmentsService } from "./appointments.service";
import { BookAppointmentDto } from "./dto";

@ApiTags("Appointments")
@ApiBearerAuth("JWT-auth")
@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointments: AppointmentsService) {}

  @Post()
  @Roles("USER")
  @ApiOperation({ summary: "Book a new appointment (Patient only)" })
  @ApiResponse({ status: 201, description: "Appointment booked successfully" })
  @ApiResponse({ status: 400, description: "Invalid slot time or doctor unavailable" })
  @ApiResponse({ status: 409, description: "Slot already taken" })
  book(@CurrentUser() user: AuthUser, @Body() dto: BookAppointmentDto) {
    return this.appointments.book(user.id, dto);
  }

  @Get("me")
  @Roles("USER")
  @ApiOperation({ summary: "Get current patient's appointments" })
  @ApiResponse({ status: 200, description: "List of patient appointments" })
  mine(@CurrentUser() user: AuthUser) {
    return this.appointments.mine(user.id);
  }

  @Get("doctor")
  @Roles("DOCTOR")
  @ApiOperation({ summary: "Get current doctor's scheduled appointments" })
  @ApiResponse({ status: 200, description: "List of doctor appointments" })
  forDoctor(@CurrentUser() user: AuthUser) {
    return this.appointments.forDoctor(user.id);
  }

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get all clinic appointments (Admin only)" })
  @ApiResponse({ status: 200, description: "List of all appointments in clinic" })
  all() {
    return this.appointments.all();
  }

  @Post(":id/cancel")
  @Roles("USER", "DOCTOR", "ADMIN")
  @ApiOperation({ summary: "Cancel an appointment (Patient, Doctor, or Admin)" })
  @ApiResponse({ status: 200, description: "Appointment cancelled" })
  cancel(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.appointments.cancel(user, id);
  }

  @Post(":id/complete")
  @Roles("DOCTOR")
  @ApiOperation({ summary: "Mark appointment completed and fee collected (Doctor only)" })
  @ApiResponse({ status: 200, description: "Appointment marked completed" })
  complete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.appointments.complete(user.id, id);
  }

  @Post(":id/paid")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Mark appointment fee paid at clinic desk (Admin only)" })
  @ApiResponse({ status: 200, description: "Appointment marked paid" })
  markPaid(@Param("id") id: string) {
    return this.appointments.markPaid(id);
  }
}
