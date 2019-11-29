import { Controller, Post, Body } from '@nestjs/common';
import { UserToQuestionChoiceService } from './userToQuestionChoice.service';
import { AsakaiChoices, TotemSimilarity, Totem } from './userToQuestionChoice.entity';

@Controller('user_to_question_choices')
export class UserToQuestionChoiceController {
    constructor(private readonly userToQuestionChoiceService: UserToQuestionChoiceService) {}

    @Post('asakai')
    async findTotem(@Body() asakaiChoices: AsakaiChoices): Promise<Totem> {
        return this.userToQuestionChoiceService.findTotem(asakaiChoices);
    }
}
