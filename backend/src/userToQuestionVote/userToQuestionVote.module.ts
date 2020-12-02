import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserToQuestionVote } from './userToQuestionVote.entity'
import { UserToQuestionVoteRepository } from './userToQuestionVote.repository'
import { UserToQuestionVoteService } from './userToQuestionVote.service'
import { UserToQuestionVoteController } from './userToQuestionVote.controller'

@Module({
    imports: [TypeOrmModule.forFeature([UserToQuestionVote, UserToQuestionVoteRepository])],
    providers: [UserToQuestionVoteService],
    controllers: [UserToQuestionVoteController],
})
export class UserToQuestionVoteModule {}
