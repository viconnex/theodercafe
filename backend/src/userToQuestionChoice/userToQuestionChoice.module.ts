import { Module } from '@nestjs/common';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository';
import { UserToQuestionChoiceService } from './userToQuestionChoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserToQuestionChoice, UserToQuestionChoiceRepository]), UserModule],
    providers: [UserToQuestionChoiceService],
    exports: [UserToQuestionChoiceService],
})
export class UserToQuestionChoiceModule {}
