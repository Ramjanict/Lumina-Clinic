import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "./common/decorators";

@ApiTags("System")
@Controller()
export class AppController {
  @Get("health")
  @Public()
  @ApiOperation({ summary: "System health check" })
  @ApiResponse({ status: 200, description: "System is healthy", schema: { example: { ok: true } } })
  health() {
    return { ok: true };
  }
}
