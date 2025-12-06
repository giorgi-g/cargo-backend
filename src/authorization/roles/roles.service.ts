import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { RoleEnum, UserEntity } from "@generated";

@Injectable()
export class RolesService {
    async findAll(): Promise<RoleEnum[]> {
        const roles: RoleEnum[] = [];
        Object.keys(RoleEnum).forEach((role) => {
            roles.push(role as RoleEnum);
        });

        return roles;
    }

    async findOne(id: string): Promise<RoleEnum> {
        const roles = await this.findAll();
        const role = roles.find((x) => x === id);

        if (!role) {
            throw new BadRequestException(
                `The role with the id ${id} does not exists`,
            );
        }

        return role;
    }

    isAdmin(roleId: string): boolean {
        return RoleEnum.ADMIN.toString() === roleId;
    }

    isCurrentUser(user: UserEntity, userId: string): boolean {
        return user.id === userId;
    }

    isCurrentUserOrRealAdmin(user: UserEntity, userId: string): boolean {
        const canView =
            this.isCurrentUser(user, userId) || this.isAdmin(user.role);

        if (canView) {
            return true;
        }

        throw new ForbiddenException();
    }
}
