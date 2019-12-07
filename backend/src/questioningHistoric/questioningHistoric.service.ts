import { InjectRepository } from '@nestjs/typeorm';
import { QuestioningHistoricRepository } from './questioningHistoric.repository';
import { QuestioningHistoric } from './questioningHistoric.entity';
import { Between } from 'typeorm';

export class QuestioningHistoricService {
    constructor(
        @InjectRepository(QuestioningHistoricRepository)
        private readonly questioningHistoricRepository: QuestioningHistoricRepository,
    ) {}

    async saveNew(questionIds: string[]): Promise<QuestioningHistoric> {
        return this.questioningHistoricRepository.save({
            date: new Date(),
            questioning: questionIds,
        });
    }

    async findLastOfTheDay(): Promise<QuestioningHistoric> {
        const todayAtMidnight = new Date();
        const tomorrowAtMidnight = new Date();
        todayAtMidnight.setHours(0, 0, 0, 0);
        tomorrowAtMidnight.setHours(24, 0, 0, 0);
        return this.questioningHistoricRepository.findOne({
            where: { date: Between(todayAtMidnight, tomorrowAtMidnight) },
            order: { date: 'DESC' },
        });
    }
}
