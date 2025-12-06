import { Module } from "@nestjs/common";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AwsModule } from "../aws/aws.module";
import { Logger } from "@nestjs/common";
import { FileResolver } from "./file.resolver";

@Module({
    imports: [PrismaModule, AwsModule],
    controllers: [FileController],
    providers: [FileService, Logger, FileResolver],
    exports: [FileService],
})
export class FileModule {}
