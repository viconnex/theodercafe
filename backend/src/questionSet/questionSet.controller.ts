import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'
import { QuestionSetService } from './questionSet.service'

@Controller('question_set')
export class QuestionSetController {
    constructor(private readonly questionSetService: QuestionSetService) {}

    @Get()
    async findAll(@Res() res: Response) {
        const questionSets = await this.questionSetService.findAll()
        res.set('Access-Control-Expose-Headers', 'X-Total-Count')
        res.set('X-Total-Count', questionSets.length.toString())
        res.send(questionSets)
    }
}
