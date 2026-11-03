import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Lumina Clinic API")
    .setDescription(
      "Comprehensive REST API documentation for the Lumina Clinic appointment booking system, doctor practice management, and administrative portal.",
    )
    .setVersion("2.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter your Bearer JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document, {
    customSiteTitle: "Lumina Clinic API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
  });

  const configured = (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin(
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) {
      if (!origin) {
        callback(null, true);
        return;
      }
      const local = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
      if (local || configured.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  });

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/api`);
  console.log(`Swagger Docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
