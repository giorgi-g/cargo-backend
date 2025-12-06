import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";
import { Roles } from "../authorization/roles/decorators/role.decorator";
import { CurrentUser } from "./decorators/user.decorator";
import { UserService } from "./user.service";
import { RoleEnum, UserDto } from "@generated";
import { canUpdateUser } from "@utils";
import {
    CurrentUserDto,
    GetUsersInput,
    CreateUserInput,
    UpdateUserInput,
} from "./dtos";

@Injectable()
@Resolver(() => UserDto)
@UseGuards(GqlAuthGuard)
export class UserResolver {
    constructor(private readonly usersService: UserService) {}

    @Query(() => UserDto)
    async getUser(
        @CurrentUser() user: CurrentUserDto,
        @Args("userId") userId: string,
    ) {
        const data = await this.usersService.findOne(userId, user.companyId);

        if (data == null) {
            throw new NotFoundException({
                field: "userid",
                message: "The user does not exist!",
            });
        }

        return data;
    }

    @Mutation(() => UserDto)
    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
    )
    async createUser(
        @CurrentUser() user: CurrentUserDto,
        @Args("request") request: CreateUserInput,
    ): Promise<UserDto> {
        request.companyId = user.companyId;

        return this.usersService.create(request, user);
    }

    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.HR_MANAGER,
    )
    @Mutation(() => UserDto)
    async updateUser(
        @CurrentUser() user: CurrentUserDto,
        @Args("request") request: UpdateUserInput,
        @Args("userId") userId: string,
    ) {
        canUpdateUser(user, userId);
        request.companyId = user.companyId;

        return this.usersService.update(userId, request, user);
    }

    // @Mutation(() => UserDto)
    // async updatePassword(
    //     @CurrentUser() user: User,
    //     @Args("request") request: UpdatePasswordDto,
    //     @Args("userId") userId: string,
    // ) {
    //     this.roleService.isCurrentUserOrRealAdmin(user, userId);
    //
    //     return this.usersService.updatePassword(request, userId);
    // }

    @Mutation(() => Boolean)
    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.DIRECTOR,
        RoleEnum.GENERAL_MANAGER,
    )
    async deleteUser(
        @CurrentUser() user: CurrentUserDto,
        @Args("userId") userId: string,
    ): Promise<boolean> {
        return this.usersService.delete(userId, user.companyId);
    }

    @Query(() => [UserDto])
    @Roles(
        RoleEnum.ROOT,
        RoleEnum.ADMIN,
        RoleEnum.GENERAL_MANAGER,
        RoleEnum.DIRECTOR,
        RoleEnum.ACCOUNTANT,
        RoleEnum.HR_MANAGER,
    )
    async getUsers(
        @CurrentUser() user: CurrentUserDto,
        @Args("request") request: GetUsersInput,
    ) {
        request.companyId = user.companyId;

        return this.usersService.findAll(request);
    }
}
