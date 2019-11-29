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
} from '@nestjs/common';
import { UserToQuestionChoiceService } from './userToQuestionChoice.service';
import { AsakaiChoices, Totem, UserToQuestionChoice } from './userToQuestionChoice.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('user_to_question_choices')
export class UserToQuestionChoiceController {
    constructor(private readonly userToQuestionChoiceService: UserToQuestionChoiceService) {}

    @Post('asakai')
    async findTotem(@Body() asakaiChoices: AsakaiChoices): Promise<Totem> {
        return this.userToQuestionChoiceService.findTotem(asakaiChoices);
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
}
