import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "../../../common/decorators/public.decorator";

@Injectable()
export class GqlAuthGuard extends AuthGuard("jwt") {
    constructor(private reflector: Reflector) {
        super();
    }

    getRequest(context: ExecutionContextHost) {
        const ctx = GqlExecutionContext.create(context);

        return ctx.switchToHttp().getRequest();
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        // console.log(">>>> gql can activate");
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();

        if (!req?.header("Authorization")) {
            return false;
        }

        return super.canActivate(new ExecutionContextHost([req]));
    }
}
