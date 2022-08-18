import { Test, TestingModule } from '@nestjs/testing'
import { QuestionSetService } from './questionSet.service'

describe('QuestionSetService', () => {
    let service: QuestionSetService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [QuestionSetService],
        }).compile()

        service = module.get<QuestionSetService>(QuestionSetService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
