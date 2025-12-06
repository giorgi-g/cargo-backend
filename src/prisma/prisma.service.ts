import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "src/prisma-client";
// import { withOptimize } from "@prisma/extension-optimize";

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    async onModuleInit() {
        await this.$connect();
        // this.$extends(withOptimize({ apiKey: "" }));
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
