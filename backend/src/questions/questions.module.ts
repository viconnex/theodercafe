import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { QuestionRepository } from './questions.repository';
import { Questions } from './questions.entity';
import { QuestionsService } from './questions.service';

@Module({
    imports: [TypeOrmModule.forFeature([Questions, QuestionRepository])],
    controllers: [QuestionsController],
    providers: [QuestionsService],
})
export class QuestionsModule {}
