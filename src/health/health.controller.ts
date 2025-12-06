import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../common/decorators/public.decorator";

@Controller("health")
@ApiTags("Health")
export class HealthController {
    @Public()
    @Get("/check")
    async check() {
        return {
            message: "The service is up and running!",
            status: 200,
        };
    }
}
