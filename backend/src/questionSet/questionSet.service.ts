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

    async findOrCreateFromName(name: PresetQuestionSet) {
        const existingQuestionSet = await this.questionSetRepository.findOne({ name })
        if (existingQuestionSet) {
            return existingQuestionSet
        }
        return this.questionSetRepository.save({ name })
    }

    async findOneOrFail(questionSetId: number) {
        return await this.questionSetRepository.findOneOrFail(questionSetId)
    }

    findByIds(ids: number[]) {
        return this.questionSetRepository.findByIds(ids)
    }
}
