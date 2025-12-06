import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AwsProviders } from "./aws.providers";

@Module({
    imports: [ConfigModule],
    providers: [...AwsProviders],
    exports: [...AwsProviders],
})
export class AwsModule {}
