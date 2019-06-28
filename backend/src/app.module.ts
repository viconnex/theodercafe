import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        //     {
        //     keepConnectionAlive: true,
        //     type: 'postgres',
        //     host: 'localhost',
        //     port: 5432,
        //     username: 'the',
        //     password: 'cafe',
        //     database: 'theodercafe',
        //     entities: [Question],
        //     synchronize: false,
        // }),
        QuestionModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
