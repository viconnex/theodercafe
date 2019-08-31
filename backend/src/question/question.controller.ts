import { Body, Controller, Delete, Get, Query, Param, Post, Put, NotFoundException, Res } from '@nestjs/common';
import { Response } from 'express';
import { QuestionDto } from './interfaces/question.dto';
import { QuestionService } from './question.service';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    create(@Body() questionDto): Promise<QuestionDto> {
        return this.questionService.create(questionDto);
    }

    @Get('/asakai')
    findAsakaiSet(@Query() query: { maxNumber: number }): Promise<QuestionDto[]> {
        const maxNumber = query.maxNumber || 10;
        return this.questionService.findAsakaiSet(maxNumber);
        // return this.questionService.findInOrder([17, 33, 32, 60, 55, 3, 40, 59, 7, 49]);
    }

    @Get('/all')
    findAll(): Promise<QuestionDto[]> {
        return this.questionService.findAll();
    }

    @Get('')
    async getAdminList(@Res() res: Response): Promise<void> {
        const result = await this.questionService.findAdminList();
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        res.set('X-Total-Count', result.length.toString());
        res.send(result);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<QuestionDto> {
        const question = await this.questionService.findOne(id);
        if (!question) throw new NotFoundException();

        return question;
    }

    @Put(':id/vote')
    updateVote(@Param('id') id: number, @Body() voteBody): Promise<UpdateResult> {
        return this.questionService.vote(id, voteBody.optionIndex);
    }

    @Put(':id/upVote')
    updateUpVote(@Param('id') id: number, @Body() voteBody): Promise<UpdateResult> {
        return this.questionService.upVote(id, voteBody.isUpVote);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<DeleteResult> {
        const deleteResult = await this.questionService.delete(id);
        if (deleteResult.affected === 0) throw new NotFoundException();

        return deleteResult;
    }

    @Put(':id')
    updateQuestion(@Param('id') id: number, @Body() questionBody): Promise<QuestionDto> {
        return this.questionService.update(id, questionBody);
    }
}
