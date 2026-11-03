import { Controller, Get } from "@nestjs/common";
import { CurrentUser } from "../common/current-user.decorator";
import { Roles } from "../common/decorators";
import { AuthUser } from "../common/constants";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get("admin")
  @Roles("ADMIN")
  admin() {
    return this.dashboard.admin();
  }

  @Get("doctor")
  @Roles("DOCTOR")
  doctor(@CurrentUser() user: AuthUser) {
    return this.dashboard.doctor(user.id);
  }
}
