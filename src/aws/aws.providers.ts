import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";

export const AwsProviders: Provider[] = [
    {
        provide: "S3",
        useFactory: (configService: ConfigService) => {
            const awsConfig = {
                accessKeyId: configService.get("AWS_ACCESS_KEY_ID"),
                secretAccessKey: configService.get("AWS_SECRET_ACCESS_KEY"),
                region: configService.get("AWS_REGION"),
            };

            AWS.config.update(awsConfig);
            return new AWS.S3();
        },
        inject: [ConfigService],
    },
];
