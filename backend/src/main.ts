import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
    console.log('node_env', process.env.NODE_ENV)
    console.log('BACKEND_URL', process.env.BACKEND_URL)
    const app = await NestFactory.create(AppModule)
    app.enableCors()

    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle('Theodercafe API')
        .setDescription(
            'This is the Theodercafe API description. You can find here all the endpoints to interact with the Theodercafe backend',
        )
        .addTag('questions')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    await app.listen(8080)
}
// eslint-disable-next-line
bootstrap()
