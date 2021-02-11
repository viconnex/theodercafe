import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserToQuestionChoice } from './userToQuestionChoice.entity'
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository'
import { UserToQuestionChoiceService } from './userToQuestionChoice.service'
import { UserToQuestionChoiceController } from './userToQuestionChoice.controller'
import { UserModule } from '../user/user.module'
import { UserToQuestionVoteModule } from '../userToQuestionVote/userToQuestionVote.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([UserToQuestionChoice, UserToQuestionChoiceRepository]),
        UserModule,
        UserToQuestionVoteModule,
    ],
    providers: [UserToQuestionChoiceService],
    controllers: [UserToQuestionChoiceController],
    exports: [UserToQuestionChoiceService],
})
export class UserToQuestionChoiceModule {}
