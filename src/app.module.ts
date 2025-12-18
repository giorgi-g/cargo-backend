import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
// import { EventEmitterModule } from "@nestjs/event-emitter";
import { GraphQLModule } from "@nestjs/graphql";
import { DirectiveLocation } from "graphql/language";
import { GraphQLDirective } from "graphql/type";
import { AuthModule } from "./authorization/auth.module";
import { GqlAuthGuard } from "./authorization/auth/guards/gql-auth.guard";
import { JwtAuthGuard } from "./authorization/auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "./authorization/permissions/guards/permissions.guard";
import { RolesGuard } from "./authorization/roles/guards/roles.guard";
import { upperDirectiveTransformer } from "./common/directives/upper-case.directive";
import { SerializerInterceptor } from "./common/interceptors/serialize.interceptor";
import appConfig from "./config/app.config";
import { HealthModule } from "./health/health.module";
import { UserModule } from "./users/user.module";
import { CompanyModule } from "./company/company.module";
import { FolderModule } from "./folder/folder.module";
import { FileModule } from "./file/file.module";
import { LanguageModule } from "./language/language.module";
import { CurrencyModule } from "./currency/currency.module";
import { CountryModule } from "./country/country.module";
import { PageModule } from "./page/page.module";
import { ContentModule } from "./content/content.module";
import { S3Module } from "nestjs-s3";
import { CommandsModule } from "./commands/commands.module";
import { TransportModule } from "./transport/transport.module";
import { LicenseModule } from "./license/license.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { OrderModule } from "./order/order.module";
import { ShipmentModule } from "./shipment/shipment.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
        }),
        // EventEmitterModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: "./src/schema.gql",
            sortSchema: true,
            transformSchema: (schema) =>
                upperDirectiveTransformer(schema, "upper"),
            installSubscriptionHandlers: false,
            buildSchemaOptions: {
                directives: [
                    new GraphQLDirective({
                        name: "upper",
                        locations: [DirectiveLocation.FIELD_DEFINITION],
                    }),
                ],
            },
            context: ({ req }) => ({ req }),
        }),
        S3Module.forRootAsync({
            useFactory: () => ({
                config: {
                    credentials: {
                        accessKeyId: process.env.S3_ACCESS_KEY_ID,
                        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                    },
                    region: process.env.S3_BUCKET_REGION,
                    endpoint: process.env.S3_BUCKET_URL,
                    forcePathStyle: true,
                    signatureVersion: "v4",
                },
            }),
        }),
        AuthModule,
        UserModule,
        HealthModule,
        CompanyModule,
        LanguageModule,
        FolderModule,
        FileModule,
        CurrencyModule,
        CountryModule,
        PageModule,
        ContentModule,
        OrderModule,
        TransportModule,
        LicenseModule,
        CommandsModule,
        DashboardModule,
        ShipmentModule,
    ],
    providers: [
        // {
        //     provide: APP_PIPE,
        //     useValue: new ValidationPipe({
        //         whitelist: true,
        //         transform: true,
        //         forbidNonWhitelisted: true,
        //     }),
        // },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: GqlAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        {
            provide: APP_GUARD,
            useClass: PermissionsGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: SerializerInterceptor,
        },
    ],
    controllers: [],
})
export class AppModule {
    constructor() {}
}
