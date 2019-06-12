import { Controller, Get, Body, Param, Post } from '@nestjs/common';
import { QuestionDto } from './interfaces/questions.dto';
import { QuestionRepository } from 'dist/questions/questions.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('questions')
export class QuestionsController {
    constructor(@InjectRepository(QuestionRepository) private readonly questionRepository: QuestionRepository) {}

    @Get()
    getDogs(): string {
        return 'we get all questions';
    }
    @Post()
    create(@Body() questionDto: QuestionDto): Promise<QuestionDto> {
        return this.questionRepository.createQuestion(questionDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string): string {
        return `we get the dog with the id ${id}`;
    }
}
