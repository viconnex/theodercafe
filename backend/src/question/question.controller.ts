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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { QuestionService } from './question.service'
import { Question } from './question.entity'
import { QuestionPostDTO, QuestionUpdateBody } from './interfaces/question.dto'
import { User } from '../user/user.entity'

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @ApiOperation({ summary: 'Create a new question (Accessible by: User)' })
    @ApiResponse({ status: 201, description: 'The question has been successfully created.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error: Category save failed.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error: No question sets found.' })
    @Post()
    @UseGuards(AuthGuard(USER_STRATEGY))
    create(@Request() { user }: { user: User }, @Body() questionDto: QuestionPostDTO): Promise<Question> {
        return this.questionService.create(questionDto, user)
    }

    @ApiOperation({ summary: 'Retrieve a set of Asakai questions with votes (Accessible publicly)' })
    @ApiQuery({
        name: 'maxNumber',
        required: false,
        type: Number,
        description: 'Maximum number of questions to retrieve',
    })
    @ApiQuery({ name: 'questionSetId', required: true, type: Number, description: 'ID of the question set' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved the Asakai question set' })
    @ApiResponse({ status: 400, description: 'Bad Request: questionSetId is required' })
    @ApiResponse({ status: 500, description: 'Internal Server Error: No questions found for asakai set' })
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

    @ApiOperation({ summary: 'Reset the Asakai question set (Accessible by: Admin)' })
    @ApiQuery({
        name: 'maxNumber',
        required: false,
        type: Number,
        description: 'Maximum number of questions to retrieve',
    })
    @ApiQuery({ name: 'questionSetId', required: true, type: Number, description: 'ID of the question set' })
    @ApiResponse({ status: 200, description: 'Successfully reset the Asakai question set' })
    @ApiResponse({ status: 400, description: 'Bad Request: questionSetId is required' })
    @ApiResponse({ status: 500, description: 'Internal Server Error: No questions found for asakai set' })
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

    @ApiOperation({ summary: 'Retrieve all questions (Accessible by: User)' })
    @ApiQuery({ name: 'questionSetId', required: false, type: Number, description: 'ID of the question set' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved all questions' })
    @Get('/all')
    findAll(@Query() query: { questionSetId?: number }) {
        return this.questionService.findAll({ questionSetId: query.questionSetId })
    }

    @ApiOperation({ summary: 'Retrieve the admin list of questions (Accessible publicly)' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved the admin list' })
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    @Get('')
    async getAdminList(@Res() res: Response) {
        const result = await this.questionService.findAdminList()
        res.set('Access-Control-Expose-Headers', 'X-Total-Count')
        res.set('X-Total-Count', result.length.toString())
        res.send(result)
    }

    @ApiOperation({ summary: 'Retrieve a specific question by ID (Accessible publicly)' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved the question' })
    @ApiResponse({ status: 404, description: 'Not Found: Question does not exist' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const question = await this.questionService.findOne(id)
        if (!question) {
            throw new NotFoundException()
        }

        return question
    }

    @ApiOperation({ summary: 'Delete a question by ID (Accessible by: Admin)' })
    @ApiResponse({ status: 200, description: 'Successfully deleted the question' })
    @ApiResponse({ status: 404, description: 'Not Found: Question does not exist' })
    @Delete(':id')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    async remove(@Param('id') id: string): Promise<DeleteResult> {
        const deleteResult = await this.questionService.delete(id)
        if (deleteResult.affected === 0) {
            throw new NotFoundException()
        }

        return deleteResult
    }

    @ApiOperation({ summary: 'Update a question by ID (Accessible by: Admin)' })
    @ApiResponse({ status: 200, description: 'Successfully updated the question' })
    @Put(':id')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    updateQuestion(@Param('id') id: string, @Body() questionBody: QuestionUpdateBody): Promise<Question> {
        return this.questionService.update(Number(id), questionBody)
    }

    @ApiOperation({ summary: 'Create a new questioning historic (Accessible by: Admin)' })
    @ApiResponse({ status: 201, description: 'Successfully created the questioning historic' })
    @ApiResponse({ status: 400, description: 'Bad Request: Invalid data or not all questions found' })
    @Post('/questioning-historic')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    createNewHistoric(@Body() body: { questionIds: number[]; questionSetId: number }) {
        return this.questionService.createNewHistoric({
            questionIds: body.questionIds,
            questionSetId: body.questionSetId,
        })
    }
}
