import { Module } from '@nestjs/common';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository';
import { UserToQuestionChoiceService } from './userToQuestionChoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToQuestionChoiceController } from './userToQuestionChoice.controller';
import { QuestionModule } from '../question/question.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserToQuestionChoice, UserToQuestionChoiceRepository]),
        QuestionModule,
        UserModule,
    ],
    providers: [UserToQuestionChoiceService],
    controllers: [UserToQuestionChoiceController],
})
export class UserToQuestionChoiceModule {}
