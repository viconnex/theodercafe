import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Request,
    BadRequestException,
    Put,
    Param,
} from '@nestjs/common';
import { UserToQuestionChoiceService } from './userToQuestionChoice.service';
import { AsakaiChoices, Alterodo, UserToQuestionChoice } from './userToQuestionChoice.entity';
import { AuthGuard } from '@nestjs/passport';
import { QuestionService } from 'src/question/question.service';

@Controller('user_to_question_choices')
export class UserToQuestionChoiceController {
    constructor(
        private readonly userToQuestionChoiceService: UserToQuestionChoiceService,
        private readonly questionService: QuestionService,
    ) {}

    @Post('asakai')
    async findAlterodo(@Body() asakaiChoices: AsakaiChoices): Promise<Alterodo> {
        return this.userToQuestionChoiceService.findAlterodo(asakaiChoices);
    }

    @Get('user')
    @UseGuards(AuthGuard('registered_user'))
    @UseInterceptors(ClassSerializerInterceptor)
    async getChoices(@Request() req): Promise<UserToQuestionChoice[]> {
        if (!req || !req.user || !req.user.id) {
            throw new BadRequestException('user not found');
        }

        return await this.userToQuestionChoiceService.getAllUserChoices(req.user.id);
    }

    @Put(':id/choice')
    @UseGuards(AuthGuard('registered_user'))
    @UseInterceptors(ClassSerializerInterceptor)
    async chose(
        @Param('id') questionId: number,
        @Body() body: { choice: number },
        @Request() req,
    ): Promise<UserToQuestionChoice> {
        if (!req || !req.user || !req.user.id) {
            throw new BadRequestException('user not found');
        }
        return this.userToQuestionChoiceService.saveChoice(questionId, req.user.id, body.choice);
    }
}
