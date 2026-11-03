import { Controller, Get } from "@nestjs/common";
import { Public } from "./common/decorators";

@Controller()
export class AppController {
  @Get("health")
  @Public()
  health() {
    return { ok: true };
  }
}
