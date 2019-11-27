import { Module } from '@nestjs/common';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository';
import { UserToQuestionChoiceService } from './userToQuestionChoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToQuestionChoiceController } from './userToQuestionChoice.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserToQuestionChoice, UserToQuestionChoiceRepository])],
    providers: [UserToQuestionChoiceService],
    exports: [UserToQuestionChoiceService],
    controllers: [UserToQuestionChoiceController],
})
export class UserToQuestionChoiceModule {}
