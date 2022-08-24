import { InjectRepository } from '@nestjs/typeorm'
import { Between } from 'typeorm'
import { QuestioningHistoricRepository } from './questioningHistoric.repository'
import { QuestioningHistoric } from './questioningHistoric.entity'
import { QuestionSet } from '../questionSet/questionSet.entity'

export class QuestioningHistoricService {
    constructor(
        @InjectRepository(QuestioningHistoricRepository)
        private readonly questioningHistoricRepository: QuestioningHistoricRepository,
    ) {}

    async saveNew({
        questionIds,
        questionSet,
    }: {
        questionIds: string[]
        questionSet: QuestionSet
    }): Promise<QuestioningHistoric> {
        return this.questioningHistoricRepository.save({
            date: new Date(),
            questioning: questionIds,
            questionSet,
        })
    }

    async findLastOfTheDay({ questionSetId }: { questionSetId: number }) {
        const todayAtMidnight = new Date()
        const tomorrowAtMidnight = new Date()
        todayAtMidnight.setHours(0, 0, 0, 0)
        tomorrowAtMidnight.setHours(24, 0, 0, 0)
        return this.questioningHistoricRepository.findOne({
            where: { date: Between(todayAtMidnight, tomorrowAtMidnight), questionSetId },
            order: { date: 'DESC' },
        })
    }
}
