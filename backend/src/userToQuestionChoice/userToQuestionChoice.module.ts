import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from '../user/user.repository'
import { UserToQuestionChoice } from './userToQuestionChoice.entity'
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository'
import { UserToQuestionChoiceService } from './userToQuestionChoice.service'
import { UserToQuestionChoiceController } from './userToQuestionChoice.controller'
import { UserModule } from '../user/user.module'
import { UserToQuestionVoteModule } from '../userToQuestionVote/userToQuestionVote.module'
import { QuestionModule } from '../question/question.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([UserToQuestionChoice, UserToQuestionChoiceRepository, UserRepository]),
        UserModule,
        UserToQuestionVoteModule,
        QuestionModule,
    ],
    providers: [UserToQuestionChoiceService],
    controllers: [UserToQuestionChoiceController],
    exports: [UserToQuestionChoiceService],
})
export class UserToQuestionChoiceModule {}
