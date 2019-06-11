import { Controller, Get, Body, Param, Post } from '@nestjs/common';
import { QuestionDto } from './interfaces/questions.dto';

@Controller('questions')
export class QuestionsController {
    @Get()
    getDogs(): string {
        return 'we get all questions';
    }
    @Post()
    create(@Body() questionDto: QuestionDto): QuestionDto {
        return questionDto;
    }

    @Get(':id')
    findOne(@Param('id') id: string): string {
        return `we get the dog with the id ${id}`;
    }
}
