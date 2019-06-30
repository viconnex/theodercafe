import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { CategoryModule } from './category/category.module';

@Module({
    imports: [TypeOrmModule.forRoot(), QuestionModule, CategoryModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
