import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentUser } from "../common/current-user.decorator";
import { Roles } from "../common/decorators";
import { AuthUser } from "../common/constants";
import { AppointmentsService } from "./appointments.service";
import { BookAppointmentDto } from "./dto";

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointments: AppointmentsService) {}

  @Post()
  @Roles("USER")
  book(@CurrentUser() user: AuthUser, @Body() dto: BookAppointmentDto) {
    return this.appointments.book(user.id, dto);
  }

  @Get("me")
  @Roles("USER")
  mine(@CurrentUser() user: AuthUser) {
    return this.appointments.mine(user.id);
  }

  @Get("doctor")
  @Roles("DOCTOR")
  forDoctor(@CurrentUser() user: AuthUser) {
    return this.appointments.forDoctor(user.id);
  }

  @Get()
  @Roles("ADMIN")
  all() {
    return this.appointments.all();
  }

  @Post(":id/cancel")
  @Roles("USER", "DOCTOR", "ADMIN")
  cancel(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.appointments.cancel(user, id);
  }

  @Post(":id/complete")
  @Roles("DOCTOR")
  complete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.appointments.complete(user.id, id);
  }

  @Post(":id/paid")
  @Roles("ADMIN")
  markPaid(@Param("id") id: string) {
    return this.appointments.markPaid(id);
  }
}
