import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException } from '@nestjs/common';
import { QuestionDto } from './interfaces/question.dto';
import { DeleteResult } from 'typeorm';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    create(@Body() questionDto): Promise<QuestionDto> {
        return this.questionService.create(questionDto);
    }

    @Get()
    findAll(): Promise<QuestionDto[]> {
        return this.questionService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<QuestionDto> {
        const question = await this.questionService.findOne(id);
        if (!question) throw new NotFoundException();

        return question;
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() questionDto: QuestionDto): Promise<QuestionDto> {
        return this.questionService.update(id, questionDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<DeleteResult> {
        const deleteResult = await this.questionService.delete(id);
        if (deleteResult.affected === 0) throw new NotFoundException();

        return deleteResult;
    }
}
