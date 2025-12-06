import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private moduleRef: ModuleRef,
    ) {
        super({
            passReqToCallback: true,
        });
    }

    // async validate(email: string, password: string): Promise<any> {
    //     const user = await this.authService.validateUser(email, password);
    //     if (!user) {
    //         throw new UnauthorizedException();
    //     }
    //     return user;
    // }

    // async validate(request: Request, email: string, password: string) {
    //     const contextId = ContextIdFactory.getByRequest(request);
    //     // "AuthService" is a request-scoped provider
    //     const authService = await this.moduleRef.resolve(
    //         AuthService,
    //         contextId,
    //     );
    //
    //     console.log(">>> auth service", authService);
    //
    //     return authService;
    // }
}
