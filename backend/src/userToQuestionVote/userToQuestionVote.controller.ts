import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Put,
    Request,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { DeleteResult } from 'typeorm'
import { UserToQuestionVoteService } from './userToQuestionVote.service'
import { UserToQuestionVote } from './userToQuestionVote.entity'
import { USER_STRATEGY } from '../auth/jwt.user.strategy'

@Controller('user_to_question_votes')
export class UserToQuestionVoteController {
    constructor(private readonly userToQuestionVoteService: UserToQuestionVoteService) {}

    @Get('user')
    @UseGuards(AuthGuard(USER_STRATEGY))
    @UseInterceptors(ClassSerializerInterceptor)
    async getChoices(@Request() req): Promise<UserToQuestionVote[]> {
        if (!req || !req.user || !req.user.id) {
            throw new BadRequestException('user not found')
        }

        return await this.userToQuestionVoteService.getAllUserVotes(req.user.id)
    }

    @Put(':id/vote')
    @UseGuards(AuthGuard(USER_STRATEGY))
    @UseInterceptors(ClassSerializerInterceptor)
    async vote(
        @Param('id') questionId: number,
        @Body() { isUpVote }: { isUpVote: boolean },
        @Request() req,
    ): Promise<UserToQuestionVote> {
        if (!req || !req.user || !req.user.id) {
            throw new BadRequestException('user not found')
        }
        return this.userToQuestionVoteService.saveVote(questionId, req.user.id, isUpVote)
    }

    @Delete(':id/vote')
    @UseGuards(AuthGuard(USER_STRATEGY))
    @UseInterceptors(ClassSerializerInterceptor)
    async unVote(@Param('id') questionId: number, @Request() req): Promise<DeleteResult> {
        if (!req || !req.user || !req.user.id) {
            throw new BadRequestException('user not found')
        }
        return this.userToQuestionVoteService.unVote(questionId, req.user.id)
    }
}
