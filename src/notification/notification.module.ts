import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationResolver } from "./notification.resolver";

@Module({
    imports: [],
    controllers: [NotificationController],
    providers: [NotificationService, PrismaService, NotificationResolver],
    exports: [NotificationService],
})
export class NotificationModule {}
