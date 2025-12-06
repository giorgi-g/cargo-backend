import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OrderController } from "./order.controller";
import { OrderResolver } from "./order.resolver";
import { OrderService } from "./order.service";

@Module({
    controllers: [OrderController],
    providers: [OrderService, OrderResolver, PrismaService],
    exports: [OrderService],
})
export class OrderModule {}
