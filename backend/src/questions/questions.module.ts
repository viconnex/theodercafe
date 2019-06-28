import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { QuestionRepository } from './questions.repository';
import { CategoryRepository } from '../categories/category.repository';
import { Questions } from './questions.entity';
import { QuestionsService } from './questions.service';

@Module({
    imports: [TypeOrmModule.forFeature([Questions, QuestionRepository, CategoryRepository])],
    controllers: [QuestionsController],
    providers: [QuestionsService],
})
export class QuestionsModule {}
