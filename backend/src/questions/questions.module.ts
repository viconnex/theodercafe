import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { QuestionRepository } from './questions.repository';
import { Question } from './questions.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Question, QuestionRepository])],
    controllers: [QuestionsController],
})
export class QuestionsModule {}
