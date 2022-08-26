import { InjectRepository } from '@nestjs/typeorm'
import { Between } from 'typeorm'
import { QuestioningHistoricRepository } from './questioningHistoric.repository'
import { QuestioningHistoric } from './questioningHistoric.entity'
import { QuestionSet } from '../questionSet/questionSet.entity'
import { QuestionSetService } from '../questionSet/questionSet.service'

export class QuestioningHistoricService {
    constructor(
        @InjectRepository(QuestioningHistoricRepository)
        private readonly questioningHistoricRepository: QuestioningHistoricRepository,
        private readonly questionSetService: QuestionSetService,
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
        const questionSet = await this.questionSetService.findOneOrFail(questionSetId)
        return this.questioningHistoricRepository.findOne({
            where: { date: Between(todayAtMidnight, tomorrowAtMidnight), questionSet },
            order: { date: 'DESC' },
        })
    }
}
