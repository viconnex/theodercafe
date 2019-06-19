import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './questions/questions.module';
import { Questions } from './questions/questions.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            keepConnectionAlive: true,
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'the',
            password: 'cafe',
            database: 'theodercafe',
            entities: [Questions],
            synchronize: false,
        }),
        QuestionsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
