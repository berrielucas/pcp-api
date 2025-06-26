import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
    })
  )

  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('Planejamento e Controle da Produção (PCP) API')
    .setDescription('Documentação completa da API do Sistema PCP')
    .setVersion('1.0.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, documentBuilderConfig);

  // writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
