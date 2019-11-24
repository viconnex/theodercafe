import {
    Controller,
    Get,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Request,
    BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserToQuestionChoiceService } from '../userToQuestionChoice/userToQuestionChoice.service';
import { UserToQuestionChoice } from '../userToQuestionChoice/userToQuestionChoice.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userToQuestionChoiceService: UserToQuestionChoiceService) {}

    @Get('choices')
    @UseGuards(AuthGuard('registered_user'))
    @UseInterceptors(ClassSerializerInterceptor)
    async getChoices(@Request() req): Promise<UserToQuestionChoice[]> {
        if (!req || !req.user || !req.user.id) {
            throw new BadRequestException('user not found');
        }

        return await this.userToQuestionChoiceService.getAllUserChoices(req.user.id);
    }
}
