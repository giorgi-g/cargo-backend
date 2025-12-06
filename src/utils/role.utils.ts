import { ForbiddenException } from "@nestjs/common";
import { RoleEnum, UserEntity } from "src/generated";
import { CurrentUserDto } from "../users/dtos/current-user.dto";

export const isRoot = (roleId: string): boolean => {
    return RoleEnum.ROOT.toString() === roleId;
};

export const isAdmin = (roleId: string): boolean => {
    return RoleEnum.ADMIN.toString() === roleId;
};

export const isCurrentUser = (
    user: CurrentUserDto,
    userId: string,
): boolean => {
    return user.id === userId;
};

export const canUpdateUser = (
    user: CurrentUserDto,
    userId: string,
): boolean => {
    const canView =
        isCurrentUser(user, userId) ||
        isAdmin(user.roleId) ||
        isRoot(user.roleId);

    if (canView) {
        return true;
    }

    throw new ForbiddenException();
};
