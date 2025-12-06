import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { useContainer } from "class-validator";
import { AppModule } from "./app.module";
import { json, raw, text, urlencoded } from "express";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useLogger(["error"]);
    app.enableCors();

    const limit = { limit: "50mb" };

    app.use(json(limit));
    app.use(raw(limit));
    app.use(text(limit));
    app.use(urlencoded({ ...limit, extended: true }));
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );
    // validation pipe
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    app.setGlobalPrefix("api");
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    const config = new DocumentBuilder()
        .setTitle("Rubicon Backend")
        .setDescription("Rubicon Backend API")
        .setVersion("1.0")
        .addBearerAuth(
            { type: "http", scheme: "bearer", bearerFormat: "JWT" },
            "access-token",
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/swagger-ui", app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    await app.listen(3000);
}
bootstrap();
