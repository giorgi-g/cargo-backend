import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../users/user.module";
import { AuthController } from "./auth.controller";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./auth/constants/constants";
import { JwtStrategy } from "./auth/strategies/jwt.strategy";
import { LocalStrategy } from "./auth/strategies/local.strategy";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "7d" },
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, AuthResolver],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
