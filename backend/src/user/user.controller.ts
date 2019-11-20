import {
    Controller,
    Get,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Request,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserToQuestionChoiceService } from '../userToQuestionChoice/userToQuestionChoice.service';
import { UserToQuestionChoice } from '../userToQuestionChoice/userToQuestionChoice.entity';

@Controller('users')
export class UserController {
    constructor(
        private readonly userToQuestionChoiceService: UserToQuestionChoiceService,
        private readonly userService: UserService,
    ) {}

    @Get('choices')
    @UseGuards(AuthGuard('registered_user'))
    @UseInterceptors(ClassSerializerInterceptor)
    async getChoices(@Request() req): Promise<UserToQuestionChoice[]> {
        if (!req || !req.user || !req.user.email) {
            throw new BadRequestException('user email not provided in request token');
        }
        const user = await this.userService.findByEmail(req.user.email);

        if (!user) throw new NotFoundException('user not found');

        return this.userToQuestionChoiceService.getAllUserChoices(user);
    }
}
