import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { QuestionController } from './question.controller'
import { QuestionRepository } from './question.repository'
import { CategoryRepository } from '../category/category.repository'
import { Question } from './question.entity'
import { QuestionService } from './question.service'
import { QuestioningHistoricModule } from '../questioningHistoric/questioningHistoric.module'
import { QuestionSetModule } from '../questionSet/questionSet.module'
import { UserToQuestionVoteModule } from '../userToQuestionVote/userToQuestionVote.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Question, QuestionRepository, CategoryRepository]),
        QuestioningHistoricModule,
        QuestionSetModule,
        UserToQuestionVoteModule,
    ],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService],
})
export class QuestionModule {}
