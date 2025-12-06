import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
} from "@nestjs/common";
import { TransportService } from "./transport.service";
import { TransportInput } from "@generated";
import { CreateTransportInput, UpdateTransportInput } from "./types";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";

@Controller("transports")
export class TransportController {
    constructor(private readonly transportService: TransportService) {}

    @Post("/transport/:userId")
    create(
        @Param("userId") userId: string,
        @Body() createTransportDto: CreateTransportInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.transportService.create(userId, createTransportDto, user);
    }

    @Get("/transports")
    findAll(@Query() input: TransportInput) {
        return this.transportService.findAll(input);
    }

    @Get("/transports/:userId")
    findAllByUserId(
        @Param("userId") userId: string,
        @Query() input: TransportInput,
    ) {
        return this.transportService.findAllByUserId(userId);
    }

    @Get("/transport/:id")
    findOne(@Param("id") id: string) {
        return this.transportService.findOne(id);
    }

    @Put("/transport/:id")
    update(@Param("id") id: string, @Body() data: UpdateTransportInput) {
        return this.transportService.update(id, data);
    }

    @Delete("/transport/:id")
    remove(@Param("id") id: string) {
        return this.transportService.remove(id);
    }
}
