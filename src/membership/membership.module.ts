import { Module } from "@nestjs/common";
import { MembershipService } from "./membership.service";
import { MembershipController } from "./membership.controller";
import { PrismaService } from "../prisma/prisma.service";
import { MembershipResolver } from "./membership.resolver";

@Module({
    imports: [],
    controllers: [MembershipController],
    providers: [MembershipService, PrismaService, MembershipResolver],
})
export class MembershipModule {}
