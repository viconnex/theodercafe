import { Body, Controller, Get, Query, Param, Post, Put, NotFoundException } from '@nestjs/common';
import { QuestionDto } from './interfaces/question.dto';
import { QuestionService } from './question.service';
import { UpdateResult } from 'typeorm';

@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    create(@Body() questionDto): Promise<QuestionDto> {
        return this.questionService.create(questionDto);
    }

    @Get('/asakai')
    findAllClassicsAndRest(@Query() query: { maxNumber: number }): Promise<QuestionDto[]> {
        const maxNumber = query.maxNumber || 10;
        return this.questionService.findAllClassicsAndRest(maxNumber);
    }

    @Get('/all')
    findAll(): Promise<QuestionDto[]> {
        return this.questionService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<QuestionDto> {
        const question = await this.questionService.findOne(id);
        if (!question) throw new NotFoundException();

        return question;
    }

    @Put(':id/vote')
    update(@Param('id') id: number, @Body() voteBody): Promise<UpdateResult> {
        return this.questionService.vote(id, voteBody.optionIndex);
    }

    // @Delete(':id')
    // async remove(@Param('id') id: string): Promise<DeleteResult> {
    //     const deleteResult = await this.questionService.delete(id);
    //     if (deleteResult.affected === 0) throw new NotFoundException();

    //     return deleteResult;
    // }
}
