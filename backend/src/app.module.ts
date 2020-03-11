import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
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
import { join } from 'path'

const ormConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'the',
    password: 'cafe',
    database: 'theodercafe',
    synchronize: false,
    logging: true,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    // entities: ['src/**/*.entity.ts', 'src/*.entity.ts', 'dist/src/**/*.entity.js'],
    migrations: [join(__dirname, '../migration/*.{ts,js}')],
}

@Module({
    imports: [
        // @ts-ignore
        TypeOrmModule.forRoot(ormConfig),
        QuestionModule,
        CategoryModule,
        AccumulusModule,
        AuthModule,
        UserModule,
        UserToQuestionChoiceModule,
        UserToQuestionVoteModule,
        QuestioningHistoricModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
