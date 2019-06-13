import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException } from '@nestjs/common';
import { QuestionsDto } from './interfaces/questions.dto';
import { QuestionRepository } from './questions.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
    constructor(
        @InjectRepository(QuestionRepository) private readonly questionRepository: QuestionRepository,
        private readonly questionsService: QuestionsService,
    ) {}

    @Post()
    create(@Body() questionsDto: QuestionsDto): Promise<QuestionsDto> {
        return this.questionsService.create(questionsDto);
    }

    @Get()
    findAll(): Promise<QuestionsDto[]> {
        return this.questionsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<QuestionsDto> {
        const question = await this.questionsService.findOne(id);
        if (!question) throw new NotFoundException();

        return question;
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() questionsDto: QuestionsDto): Promise<QuestionsDto> {
        return this.questionsService.update(id, questionsDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<DeleteResult> {
        const deleteResult = await this.questionsService.delete(id);
        if (deleteResult.affected === 0) throw new NotFoundException();

        return deleteResult;
    }
}
