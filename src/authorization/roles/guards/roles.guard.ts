import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ROLES_KEY } from "../decorators/role.decorator";
import { RoleEnum } from "@generated";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext | ExecutionContextHost): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            // console.log(">>> role check is not required!");
            return true;
        }

        let request = context.switchToHttp().getRequest();
        if (request == null) {
            const ctx = GqlExecutionContext.create(context);
            request = ctx.getContext().req;
        }

        const authHeader = request?.header("Authorization");
        if (!authHeader) {
            return false;
        }
        const [, body] = authHeader.split(".");

        if (!body) return false;

        const user = JSON.parse(Buffer.from(body, "base64").toString());

        return requiredRoles.some((role) => user?.roleId === role);
    }
}
