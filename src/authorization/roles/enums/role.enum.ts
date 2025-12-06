import { registerEnumType } from "@nestjs/graphql";

export enum RolesEnum {
    ADMIN = "ADMIN",
    INSTALLER = "INSTALLER",
    SUPERVISOR = "SUPERVISOR",
    GUEST = "GUEST",
    OTHER = "OTHER",
}

registerEnumType(RolesEnum, {
    name: "Role",
});
