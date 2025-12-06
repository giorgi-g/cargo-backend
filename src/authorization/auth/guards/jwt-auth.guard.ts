import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "../../../common/decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext | ExecutionContextHost) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic || this.isGraphQLRequest(context)) {
            // console.log(">>> is public endpoint");
            return true;
        }

        const request = context.switchToHttp().getRequest();
        if (!request?.header("Authorization")) {
            return false;
        }

        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }

    private isGraphQLRequest(
        context: ExecutionContext | ExecutionContextHost,
    ): boolean {
        if (context instanceof ExecutionContextHost) {
            const contextType = context.getType();

            return contextType.toString() === "graphql";
        }

        return false;
    }
}
