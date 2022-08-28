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
import { UserToQuestionChoiceService } from './userToQuestionChoice.service'
import { UserToQuestionChoice } from './userToQuestionChoice.entity'
import {
    AlterodoResponse,
    AsakaiChoices,
    AsakaiEmailDTO,
    Choice,
    QuestionFilters,
    UserMap,
} from './userToQuestionChoice.types'
import { USER_STRATEGY } from '../auth/jwt.user.strategy'
import { User } from '../user/user.entity'

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
    async getChoices(@Request() req: { user: User }, @Query() query: { questionSetId?: number }) {
        return await this.userToQuestionChoiceService.getQuestionsPolls({
            user: req.user,
            questionSetId: query.questionSetId,
        })
    }

    @Put(':id/choice')
    @UseGuards(AuthGuard(USER_STRATEGY))
    @UseInterceptors(ClassSerializerInterceptor)
    async chose(
        @Param('id') questionId: number,
        @Body() body: { choice: Choice },
        @Request() req: { user: User },
    ): Promise<UserToQuestionChoice> {
        if (![1, 2].includes(body.choice)) {
            throw new BadRequestException('choice must be 1 or 2')
        }
        return this.userToQuestionChoiceService.saveChoice(questionId, req.user.id, body.choice)
    }

    @Get('alterodos')
    @UseGuards(AuthGuard(USER_STRATEGY))
    async getUserAlterodos(@Request() req: { user: User }): Promise<AlterodoResponse> {
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
    getMBTIprofiles(@Request() req: { user: User }) {
        return this.userToQuestionChoiceService.getMBTIprofiles(req.user)
    }
}
