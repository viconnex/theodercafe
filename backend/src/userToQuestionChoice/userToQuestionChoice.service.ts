import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository';
import { User } from 'src/user/user.entity';
import { Question } from 'src/question/question.entity';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';

@Injectable()
export class UserToQuestionChoiceService {
    constructor(
        @InjectRepository(UserToQuestionChoiceRepository)
        private readonly userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
    ) {}

    create(user: User, question: Question, choice: number): Promise<UserToQuestionChoice> {
        return this.userToQuestionChoiceRepository.save({
            user,
            question,
            choice,
        });
    }
}
