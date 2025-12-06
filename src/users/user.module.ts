import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { CompanyService } from "../company/company.service";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, UserResolver, CompanyService],
    exports: [UserService],
})
export class UserModule {}
