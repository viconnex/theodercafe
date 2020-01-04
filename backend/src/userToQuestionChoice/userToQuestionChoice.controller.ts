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
import { UserToQuestionChoice } from './userToQuestionChoice.entity';
import { AuthGuard } from '@nestjs/passport';
import { AlterodoResponse, AsakaiChoices } from './userToQuestionChoice.types';

@Controller('user_to_question_choices')
export class UserToQuestionChoiceController {
    constructor(private readonly userToQuestionChoiceService: UserToQuestionChoiceService) {}

    @Post('asakai')
    async findAsakaiAlterodos(@Body() asakaiChoices: AsakaiChoices): Promise<AlterodoResponse> {
        return this.userToQuestionChoiceService.findAsakaiAlterodos(asakaiChoices);
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

    @Get('alterodos')
    @UseGuards(AuthGuard('registered_user'))
    async getUserAlterodos(@Request() req): Promise<AlterodoResponse> {
        if (!req || !req.user || !req.user.id) {
            throw new BadRequestException('user not found');
        }

        return await this.userToQuestionChoiceService.getUserAlterodos(req.user.id);
    }

    @Get('map')
    async createMap(): Promise<any> {
        return await this.userToQuestionChoiceService.createMap();
    }
}
