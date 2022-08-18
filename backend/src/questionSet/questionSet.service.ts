import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
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
}
