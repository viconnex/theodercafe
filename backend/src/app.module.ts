import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { QuestionModule } from './question/question.module'
import { CategoryModule } from './category/category.module'
import { AccumulusModule } from './accumulus/accumulus.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { UserToQuestionChoiceModule } from './userToQuestionChoice/userToQuestionChoice.module'
import { UserToQuestionVoteModule } from './userToQuestionVote/userToQuestionVote.module'
import { QuestioningHistoricModule } from './questioningHistoric/questioningHistoric.module'

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        QuestionModule,
        CategoryModule,
        AccumulusModule,
        AuthModule,
        UserModule,
        UserToQuestionChoiceModule,
        UserToQuestionVoteModule,
        QuestioningHistoricModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
