import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";

@Module({
    imports: [],
    providers: [RolesService],
    controllers: [],
    exports: [RolesService],
})
export class RolesModule {}
