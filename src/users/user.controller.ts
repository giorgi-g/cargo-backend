import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { RoleEnum, UserEntity, UserStatusEnum } from "@generated";
import { ApiProperty } from "@nestjs/swagger";
import { CurrentUser } from "./decorators/user.decorator";
import {
    CurrentUserDto,
    GetUsersInput,
    CreateUserInput,
    UpdateUserInput,
} from "./dtos";
import { Roles } from "../authorization/roles/decorators";

@Controller("/users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
    )
    @ApiProperty({
        type: UserEntity,
        isArray: false,
    })
    @Post("/user")
    create(
        @CurrentUser() user: CurrentUserDto,
        @Body() request: CreateUserInput,
    ) {
        console.log(">>> create user request", request);
        request.companyId = user.companyId;
        return this.userService.create(request, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.ACCOUNTANT,
        RoleEnum.HR_MANAGER,
        RoleEnum.RESERVATIONS_MANAGER,
    )
    @Get("/users")
    async findAll(
        @CurrentUser() user: CurrentUserDto,
        @Query("roles") roles?: RoleEnum[],
        @Query("statuses") statuses?: UserStatusEnum[],
        @Query("email") email?: string,
        @Query("id") id?: string,
        @Query("name") name?: string,
        @Query("personalId") personalId?: string,
        @Query("passportNumber") passportNumber?: string,
        @Query("companyId") companyId?: string,
    ) {
        const request: GetUsersInput = {
            companyId:
                user.roleId === RoleEnum.ROOT ? companyId : user.companyId,
            roles,
            statuses,
            email,
            id,
            name,
            personalId,
            passportNumber,
        };

        if (user.roleId === RoleEnum.RESERVATIONS_MANAGER) {
            request.roles = [RoleEnum.RESERVATIONS_MANAGER];
        }

        return this.userService.findAll(request);
    }

    @ApiProperty({
        type: UserEntity,
        isArray: false,
    })
    @Get("/user/:id")
    findOne(@CurrentUser() user: CurrentUserDto, @Param("id") id: string) {
        return this.userService.findOne(id, user.companyId);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
    )
    @Put("/user/:id")
    update(
        @CurrentUser() user: CurrentUserDto,
        @Param("id") id: string,
        @Body() update: UpdateUserInput,
    ) {
        update.companyId = user.companyId;
        return this.userService.update(id, update, user);
    }

    @Delete("/user/:id")
    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.DIRECTOR,
        RoleEnum.GENERAL_MANAGER,
    )
    delete(@CurrentUser() user: CurrentUserDto, @Param("id") id: string) {
        return this.userService.delete(id, user.companyId);
    }
}
