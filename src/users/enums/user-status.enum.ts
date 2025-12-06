import { registerEnumType } from "@nestjs/graphql";

export enum UserStatusEnum {
    ACTIVE = "ACTIVE",
    DELETED = "DELETED",
    PENDING = "PENDING",
    SUSPENDED = "SUSPENDED",
}

registerEnumType(UserStatusEnum, {
    name: "UserStatus",
});
