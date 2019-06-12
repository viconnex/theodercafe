import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './questions/questions.module';

@Module({
    imports: [
        TypeOrmModule
            .forRoot
            //     {
            //     keepConnectionAlive: true,
            //     type: 'postgres',
            //     host: '127.0.0.1',
            //     port: 5432,
            //     username: 'the',
            //     password: 'cafe',
            //     database: 'theodercafe',
            //     entities: [Questions],
            //     synchronize: true,
            // }
            // ),
            (),
        QuestionsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
