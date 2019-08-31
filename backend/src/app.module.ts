import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { CategoryModule } from './category/category.module';
import { AccumulusModule } from './accumulus/accumulus.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [TypeOrmModule.forRoot(), QuestionModule, CategoryModule, AccumulusModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
