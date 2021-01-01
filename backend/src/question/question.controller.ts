import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { DeleteResult } from 'typeorm'
import { AuthGuard } from '@nestjs/passport'
import { ADMIN_STRATEGY } from 'src/auth/jwt.admin.strategy'
import { QuestionService } from './question.service'
import { Question } from './question.entity'
import { AsakaiQuestioning, QuestionPostDTO, QuestionWithCategoryNameDto } from './interfaces/question.dto'

@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    create(@Body() questionDto: QuestionPostDTO): Promise<Question> {
        return this.questionService.create(questionDto)
    }

    @Get('/asakai')
    findAsakaiSet(@Query() query: { maxNumber: number; newSet: boolean }): Promise<AsakaiQuestioning> {
        const maxNumber = query.maxNumber || 10
        const findFromHistoricIfExists = query.newSet ? false : true

        return this.questionService.findAsakaiSet(maxNumber, findFromHistoricIfExists)
        // return this.questionService.findInOrder([17, 33, 32, 60, 55, 3, 40, 59, 7, 49]);
    }

    @Get('/all')
    findAll(): Promise<QuestionWithCategoryNameDto[]> {
        return this.questionService.findAll()
    }

    @Get('')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    async getAdminList(@Res() res: Response): Promise<void> {
        const result = await this.questionService.findAdminList()
        res.set('Access-Control-Expose-Headers', 'X-Total-Count')
        res.set('X-Total-Count', result.length.toString())
        res.send(result)
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Question> {
        const question = await this.questionService.findOne(id)
        if (!question) {
            throw new NotFoundException()
        }

        return question
    }

    @Delete(':id')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    async remove(@Param('id') id: string): Promise<DeleteResult> {
        const deleteResult = await this.questionService.delete(id)
        if (deleteResult.affected === 0) {
            throw new NotFoundException()
        }

        return deleteResult
    }

    @Put(':id')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    updateQuestion(@Param('id') id: number, @Body() questionBody): Promise<Question> {
        return this.questionService.update(id, questionBody)
    }
}
