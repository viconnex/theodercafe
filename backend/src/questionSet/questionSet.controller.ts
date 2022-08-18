import { Controller, Get } from '@nestjs/common'
import { QuestionSetService } from './questionSet.service'

@Controller('question_set')
export class QuestionSetController {
    constructor(private readonly questionSetService: QuestionSetService) {}

    @Get()
    findAll() {
        return this.questionSetService.findAll()
    }
}
