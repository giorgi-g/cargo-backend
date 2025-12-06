import { registerEnumType } from "@nestjs/graphql";

export enum Permission {
    CREATE_USER = "CREATE_USER",
    CREATE_ROLE = "CREATE_ROLE",
    VIEW_USER = "VIEW_USER",
    VIEW_ROLE = "VIEW_ROLE",
}

registerEnumType(Permission, {
    name: "Permission",
});
