import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { QuestioningHistoric } from './questioningHistoric.entity'
import { QuestioningHistoricRepository } from './questioningHistoric.repository'
import { QuestioningHistoricService } from './questioningHistoric.service'

@Module({
    imports: [TypeOrmModule.forFeature([QuestioningHistoric, QuestioningHistoricRepository])],
    providers: [QuestioningHistoricService],
    exports: [QuestioningHistoricService],
})
export class QuestioningHistoricModule {}
