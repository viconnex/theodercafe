import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { QuestionController } from './question.controller'
import { QuestionRepository } from './question.repository'
import { CategoryRepository } from '../category/category.repository'
import { Question } from './question.entity'
import { QuestionService } from './question.service'
import { QuestioningHistoricModule } from '../questioningHistoric/questioningHistoric.module'
import { QuestionSetRepository } from '../questionSet/questionSet.repository'
import { QuestionSetModule } from '../questionSet/questionSet.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Question, QuestionRepository, CategoryRepository, QuestionSetRepository]),
        QuestioningHistoricModule,
        QuestionSetModule,
    ],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService],
})
export class QuestionModule {}
