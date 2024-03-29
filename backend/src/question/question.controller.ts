import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Request,
    Res,
    UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { DeleteResult } from 'typeorm'
import { AuthGuard } from '@nestjs/passport'
import { ADMIN_STRATEGY } from 'src/auth/jwt.admin.strategy'
import { USER_STRATEGY } from 'src/auth/jwt.user.strategy'
import { QuestionService } from './question.service'
import { Question } from './question.entity'
import { QuestionPostDTO, QuestionUpdateBody } from './interfaces/question.dto'
import { User } from '../user/user.entity'

@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    @UseGuards(AuthGuard(USER_STRATEGY))
    create(@Request() { user }: { user: User }, @Body() questionDto: QuestionPostDTO): Promise<Question> {
        return this.questionService.create(questionDto, user)
    }

    @Get('/asakai')
    findAsakaiSet(@Query() query: { maxNumber?: number; questionSetId?: number }) {
        const maxNumber = query.maxNumber ?? 10
        if (!query.questionSetId) {
            throw new BadRequestException('questionSetId is required')
        }

        return this.questionService.findAsakaiSetWithVotes({
            maxNumber,
            findFromHistoricIfExists: true,
            questionSetId: query.questionSetId,
        })
    }

    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    @Get('/asakai/reset')
    resetAsakaiSet(@Query() query: { maxNumber?: number; questionSetId?: number }) {
        const maxNumber = query.maxNumber ?? 10
        if (!query.questionSetId) {
            throw new BadRequestException('questionSetId is required')
        }

        return this.questionService.findAsakaiSetWithVotes({
            maxNumber,
            findFromHistoricIfExists: false,
            questionSetId: query.questionSetId,
        })
    }

    @Get('/all')
    findAll(@Query() query: { questionSetId?: number }) {
        return this.questionService.findAll({ questionSetId: query.questionSetId })
    }

    @Get('')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    async getAdminList(@Res() res: Response) {
        const result = await this.questionService.findAdminList()
        res.set('Access-Control-Expose-Headers', 'X-Total-Count')
        res.set('X-Total-Count', result.length.toString())
        res.send(result)
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
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
    updateQuestion(@Param('id') id: string, @Body() questionBody: QuestionUpdateBody): Promise<Question> {
        return this.questionService.update(Number(id), questionBody)
    }

    @Post('/questioning-historic')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    createNewHistoric(@Body() body: { questionIds: number[]; questionSetId: number }) {
        return this.questionService.createNewHistoric({
            questionIds: body.questionIds,
            questionSetId: body.questionSetId,
        })
    }
}
