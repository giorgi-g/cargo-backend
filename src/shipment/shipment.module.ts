import { Module } from "@nestjs/common";
import { ShipmentService } from "./shipment.service";
import { ShipmentController } from "./shipment.controller";
import { ShipmentResolver } from "./shipment.resolver";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    controllers: [ShipmentController],
    providers: [ShipmentService, ShipmentResolver, PrismaService],
    exports: [ShipmentService],
})
export class ShipmentModule {}
