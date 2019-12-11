import { Module } from '@nestjs/common';
import { UserToQuestionVote } from './userToQuestionVote.entity';
import { UserToQuestionVoteRepository } from './userToQuestionVote.repository';
import { UserToQuestionVoteService } from './userToQuestionVote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToQuestionVoteController } from './userToQuestionVote.controller';
import { QuestionModule } from '../question/question.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserToQuestionVote, UserToQuestionVoteRepository]), QuestionModule, UserModule],
    providers: [UserToQuestionVoteService],
    controllers: [UserToQuestionVoteController],
})
export class UserToQuestionVoteModule {}
