import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../common/current-user.decorator";
import { Roles } from "../common/decorators";
import { AuthUser } from "../common/constants";
import { DashboardService } from "./dashboard.service";

@ApiTags("Dashboard & Analytics")
@ApiBearerAuth("JWT-auth")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get("admin")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get clinic executive analytics, metrics, and 14-day trends (Admin only)" })
  @ApiResponse({ status: 200, description: "Clinic analytics data" })
  admin() {
    return this.dashboard.admin();
  }

  @Get("doctor")
  @Roles("DOCTOR")
  @ApiOperation({ summary: "Get doctor practice analytics and appointment trends (Doctor only)" })
  @ApiResponse({ status: 200, description: "Doctor practice data" })
  doctor(@CurrentUser() user: AuthUser) {
    return this.dashboard.doctor(user.id);
  }
}
