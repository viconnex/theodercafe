import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    console.log(process.env.NODE_ENV);
    const app = await NestFactory.create(AppModule);
    app.enableCors({ credentials: true, origin: 'http://localhost:3000' });
    await app.listen(4000);
}
bootstrap();
