import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from './question.controller';
import { QuestionRepository } from './question.repository';
import { CategoryRepository } from '../category/category.repository';
import { Question } from './question.entity';
import { QuestionService } from './question.service';
import { UserToQuestionChoiceModule } from '../userToQuestionChoice/userToQuestionChoice.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Question, QuestionRepository, CategoryRepository]),
        UserToQuestionChoiceModule,
        UserModule,
    ],
    controllers: [QuestionController],
    providers: [QuestionService],
})
export class QuestionModule {}
