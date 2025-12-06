import { Injectable } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { Public } from "../common/decorators/public.decorator";
import { HealthDto } from "./dtos/Health.dto";

@Injectable()
@Resolver(() => HealthDto)
export class HealthResolver {
    @Public()
    @Query(() => HealthDto)
    async check(): Promise<HealthDto> {
        return {
            message: "The service is up and running!",
            status: 200,
        };
    }
}
