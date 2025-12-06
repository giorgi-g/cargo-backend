import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "../decorators/permission.decorator";
import { Permission } from "../enums/permission.enum";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<
            Permission[]
        >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredPermissions) {
            // console.log(">>> permission check is not required!");
            return true;
        }

        const request = context.switchToHttp().getRequest();
        // console.log(">>> request", request);
        const authHeader = request?.header("Authorization");

        if (!authHeader) {
            return false;
        }

        const [, body] = authHeader.split(".");

        if (!body) return false;

        const user = JSON.parse(Buffer.from(body, "base64").toString());

        return requiredPermissions.some((permission: Permission) =>
            user?.permissions?.includes(permission),
        );
    }
}
