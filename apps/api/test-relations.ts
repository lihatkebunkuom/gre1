import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prismaService = app.get(PrismaService);
  
  try {
    console.log("Mencoba fetch Jemaat tanpa relasi...");
    await prismaService.jemaat.findMany({ take: 1 });
    console.log("Jemaat OK!");

    console.log("Mencoba fetch Wilayah...");
    await prismaService.wilayah.findMany({ take: 1 });
    console.log("Wilayah OK!");

    console.log("Mencoba fetch Kelompok...");
    await prismaService.kelompok.findMany({ take: 1 });
    console.log("Kelompok OK!");

  } catch (error) {
    console.error("Error ditemukan:", error);
  } finally {
    await app.close();
  }
}

bootstrap();