import { Controller, Get, Body, Param, Put, Post, Delete } from '@nestjs/common';
import { QuestionDto } from './interfaces/questions.dto';

@Controller('questions')
export class QuestionsController {
    @Get()
    getDogs() {
        return 'we get all questions';
    }
    @Post()
    create(@Body() questionDto: QuestionDto) {
        return questionDto;
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return `we get the dog with the id ${id}`;
    }

    @Put(':id')
    update(@Param('id') id: string) {
        return `we update the dog with the id ${id}`;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return `we delete the dog with the id ${id}`;
    }
}
