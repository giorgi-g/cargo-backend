import { Module } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CompanyController } from "./company.controller";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";
import { CompanyResolver } from "./company.resolver";

@Module({
    imports: [PrismaModule],
    controllers: [CompanyController],
    providers: [CompanyService, CompanyResolver, PrismaService],
})
export class CompanyModule {}
