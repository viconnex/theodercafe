import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    console.log(process.env.NODE_ENV);
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
bootstrap();
