import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
    console.log('node_env', process.env.NODE_ENV)
    console.log('JWT_SECRET_KEY', process.env.JWT_SECRET_KEY)
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    await app.listen(8080)
}
// eslint-disable-next-line
bootstrap()
