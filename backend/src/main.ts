import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

require('dotenv').config();

async function bootstrap(): Promise<void> {
    console.log('node_env', process.env.NODE_ENV);
    console.log('front base url', process.env.FRONT_BASE_URL);
    const app = await NestFactory.create(AppModule);
    app.enableCors({ credentials: true, origin: process.env.FRONT_BASE_URL });
    await app.listen(4000);
}
bootstrap();
