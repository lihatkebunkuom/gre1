import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { JemaatService } from './src/jemaat/jemaat.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const jemaatService = app.get(JemaatService);
  
  try {
    const data = await jemaatService.findAll();
    console.log("Success! Data length:", data.length);
  } catch (error) {
    console.error("Error from JemaatService:", error);
  } finally {
    await app.close();
  }
}

bootstrap();