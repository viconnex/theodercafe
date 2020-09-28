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
import { MailerModule } from '@nestjs-modules/mailer'
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'

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
        MailerModule.forRoot({
            transport: `smtps://theodercafe@gmail.com:${process.env.GMAIL_SECRET}@smtp.gmail.com`,
            defaults: {
                from: '"nest-modules" <modules@nestjs.com>',
            },
            template: {
                dir: __dirname + '/../templates',
                adapter: new PugAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
