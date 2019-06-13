import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException } from '@nestjs/common';
import { QuestionsDto } from './interfaces/questions.dto';
import { QuestionRepository } from './questions.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';

@Controller('questions')
export class QuestionsController {
    constructor(@InjectRepository(QuestionRepository) private readonly questionRepository: QuestionRepository) {}

    @Post()
    create(@Body() questionsDto: QuestionsDto): Promise<QuestionsDto> {
        return this.questionRepository.createQuestion(questionsDto);
    }

    @Get()
    findAll(): Promise<QuestionsDto[]> {
        return this.questionRepository.find();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<QuestionsDto> {
        const question = await this.questionRepository.findOneQuestion(id);
        if (!question) throw new NotFoundException();

        return question;
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() questionsDto: QuestionsDto): Promise<QuestionsDto> {
        return this.questionRepository.updateQuestion(id, questionsDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<DeleteResult> {
        const deleteResult = await this.questionRepository.removeQuestion(id);
        if (deleteResult.affected === 0) throw new NotFoundException();

        return deleteResult;
    }
}
