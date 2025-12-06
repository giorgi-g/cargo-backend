import { Injectable, UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "../users/decorators/user.decorator";
import { UserService } from "../users/user.service";
import { AuthService } from "./auth.service";
import { Public } from "../common/decorators/public.decorator";
import { SignInDto } from "./auth/dtos/sign-in.dto";
import { GqlAuthGuard } from "./auth/guards/gql-auth.guard";
import { UserEntity } from "@generated";
import { AuthResponse } from "./auth.response";

@Injectable()
@Resolver(() => UserEntity)
export class AuthResolver {
    constructor(
        private readonly usersService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Query(() => UserEntity)
    @UseGuards(GqlAuthGuard)
    async getProfile(@CurrentUser() user: UserEntity): Promise<UserEntity> {
        return this.usersService.findByEmail(user.email);
    }

    @Public()
    @Query(() => AuthResponse)
    async signIn(@Args("request") request: SignInDto): Promise<AuthResponse> {
        const { email, password } = request;

        const user = await this.usersService.findByEmailAndPassword(
            email,
            password,
        );

        const response = await this.authService.logIn(user);

        return {
            user,
            ...response,
        };
    }

    // @Public()
    // @Mutation(() => UserEntity)
    // async signUp(@Args("request") request: CreateUserEntity): Promise<UserEntity> {
    //     // console.log("User dto", userDto);
    //     return this.usersService.createUser(request);
    // }
}
