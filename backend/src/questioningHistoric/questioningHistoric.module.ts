import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { QuestionSetModule } from 'src/questionSet/questionSet.module'
import { QuestioningHistoric } from './questioningHistoric.entity'
import { QuestioningHistoricRepository } from './questioningHistoric.repository'
import { QuestioningHistoricService } from './questioningHistoric.service'

@Module({
    imports: [TypeOrmModule.forFeature([QuestioningHistoric, QuestioningHistoricRepository]), QuestionSetModule],
    providers: [QuestioningHistoricService],
    exports: [QuestioningHistoricService],
})
export class QuestioningHistoricModule {}
