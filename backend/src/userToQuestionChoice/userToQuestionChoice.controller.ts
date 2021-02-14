import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JwtPayload as RequestUser } from 'src/auth/auth.types'
import { User } from '../user/user.entity'
import { UserToQuestionChoiceService } from './userToQuestionChoice.service'
import { UserToQuestionChoice } from './userToQuestionChoice.entity'
import { AlterodoResponse, AsakaiChoices, AsakaiEmailDTO, QuestionFilters, UserMap } from './userToQuestionChoice.types'
import { USER_STRATEGY } from '../auth/jwt.user.strategy'

@Controller('user_to_question_choices')
export class UserToQuestionChoiceController {
    constructor(private readonly userToQuestionChoiceService: UserToQuestionChoiceService) {}

    @Post('asakai')
    async findAsakaiAlterodos(
        @Body()
        { asakaiChoices, excludedUserId }: { asakaiChoices: AsakaiChoices; excludedUserId?: string },
    ): Promise<AlterodoResponse> {
        return this.userToQuestionChoiceService.findAsakaiAlterodos(asakaiChoices, excludedUserId)
    }

    @Get('')
    @UseGuards(AuthGuard(USER_STRATEGY))
    @UseInterceptors(ClassSerializerInterceptor)
    async getChoices(@Request() req: { user: RequestUser }) {
        return await this.userToQuestionChoiceService.getQuestionsPolls(req.user.id)
    }

    @Put(':id/choice')
    @UseGuards(AuthGuard(USER_STRATEGY))
    @UseInterceptors(ClassSerializerInterceptor)
    async chose(
        @Param('id') questionId: number,
        @Body() body: { choice: number },
        @Request() req: { user: RequestUser },
    ): Promise<UserToQuestionChoice> {
        return this.userToQuestionChoiceService.saveChoice(questionId, req.user.id, body.choice)
    }

    @Get('alterodos')
    @UseGuards(AuthGuard(USER_STRATEGY))
    async getUserAlterodos(@Request() req: { user: RequestUser }): Promise<AlterodoResponse> {
        return await this.userToQuestionChoiceService.getUserAlterodos(req.user.id)
    }

    @Get('map')
    @UseGuards(AuthGuard(USER_STRATEGY))
    async createMap(@Query() questionFilters: QuestionFilters): Promise<UserMap[]> {
        return await this.userToQuestionChoiceService.createMap(questionFilters)
    }

    @Post('asakai/email')
    create(@Body() asakaiEmailDTO: AsakaiEmailDTO): Promise<string> {
        if (!asakaiEmailDTO.email) {
            throw new BadRequestException('you must provide an email address')
        }
        return this.userToQuestionChoiceService.handleAsakaiEmailSending(asakaiEmailDTO)
    }

    @Get('mbti')
    @UseGuards(AuthGuard(USER_STRATEGY))
    getMBTIprofiles(@Request() req: { user: RequestUser }) {
        return this.userToQuestionChoiceService.getMBTIprofiles(req.user)
    }
}
