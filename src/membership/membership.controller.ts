import { Controller, Get, Post, Body, Param, Put } from "@nestjs/common";
import { MembershipService } from "./membership.service";
import { CreateMembershipPlanDto, UpdateMembershipPlanDto } from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";

@Controller("membership")
export class MembershipController {
    constructor(private readonly membershipService: MembershipService) {}

    @Post("/plan")
    create(
        @Body() request: CreateMembershipPlanDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.membershipService.create(request, user.id);
    }

    @Get("/plans")
    findAll() {
        return this.membershipService.findAll();
    }

    @Get("/plan/:id")
    findOne(@Param("id") id: string) {
        return this.membershipService.findOne(id);
    }

    @Put("/plan/:id")
    update(
        @Param("id") id: string,
        @Body() updateMembershipPlanDto: UpdateMembershipPlanDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.membershipService.update(id, updateMembershipPlanDto);
    }
}
