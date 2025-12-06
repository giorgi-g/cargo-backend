import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "../users/user.service";
import { AuthService } from "./auth.service";
import { Public } from "../common/decorators/public.decorator";
import { SignInDto } from "./auth/dtos/sign-in.dto";
import { AuthResponse } from "./auth.response";
import { UserEntity } from "@generated";
import { GqlAuthGuard } from "./auth/guards/gql-auth.guard";
import { CurrentUser } from "../users/decorators/user.decorator";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
    constructor(
        private readonly usersService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Post("/me")
    @UseGuards(GqlAuthGuard)
    async getProfile(@CurrentUser() user: UserEntity): Promise<UserEntity> {
        return this.usersService.findByEmail(user.email);
    }

    @Public()
    @Post("/sign-in")
    async signIn(@Body() request: SignInDto): Promise<AuthResponse> {
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
}
