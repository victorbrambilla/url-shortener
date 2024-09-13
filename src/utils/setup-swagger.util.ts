import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle("Shortener URL")
    .setContact(
        "Victor Brambilla",
        "https://www.linkedin.com/in/victorbrambilla",
        "victor-brambilla@hotmail.com",
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);
}