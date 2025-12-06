import { Module } from "@nestjs/common";
import { TransportService } from "./transport.service";
import { TransportController } from "./transport.controller";
import { PrismaService } from "../prisma/prisma.service";
import { TransportResolver } from "./transport.resolver";
import { TransportFilesService } from "./transport-files.service";

@Module({
    imports: [],
    controllers: [TransportController],
    providers: [
        TransportService,
        TransportFilesService,
        TransportResolver,
        PrismaService,
    ],
})
export class TransportModule {}
