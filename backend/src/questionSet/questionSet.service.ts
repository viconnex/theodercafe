import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PresetQuestionSet, QuestionSet } from './questionSet.entity'
import { QuestionSetRepository } from './questionSet.repository'

@Injectable()
export class QuestionSetService {
    constructor(
        @InjectRepository(QuestionSetRepository)
        private readonly questionSetRepository: QuestionSetRepository,
    ) {}
    findAll() {
        return this.questionSetRepository.find()
    }
    async getOrCreateQuestionSets(questionSetBody: { id: number | null; label: string }[]) {
        const questionSets: QuestionSet[] = []
        for (const { id, label } of questionSetBody) {
            if (id !== null) {
                const questionSet = await this.questionSetRepository.findOne(id)
                if (!questionSet) {
                    throw new Error('The questionSet could not be found')
                }
                questionSets.push(questionSet)
            } else {
                const questionSet = this.questionSetRepository.create({ name: label })
                await this.questionSetRepository.save(questionSet)
                questionSets.push(questionSet)
            }
        }
        return questionSets
    }

    async findFromName(name: PresetQuestionSet) {
        return await this.questionSetRepository.findOne({ name })
    }
}
