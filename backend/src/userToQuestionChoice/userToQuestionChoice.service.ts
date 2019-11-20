import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository';
import { Question } from '../question/question.entity';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';
import { User } from '../user/user.entity';

@Injectable()
export class UserToQuestionChoiceService {
    constructor(
        @InjectRepository(UserToQuestionChoiceRepository)
        private readonly userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
    ) {}

    async saveChoice(question: Question, user: User, choice: number): Promise<UserToQuestionChoice> {
        const initialChoice = await this.userToQuestionChoiceRepository.findOne({
            user,
            question,
        });

        if (initialChoice) {
            initialChoice.choice = choice;

            return this.userToQuestionChoiceRepository.save(initialChoice);
        }

        const newChoice = this.userToQuestionChoiceRepository.create({
            user,
            question,
            choice,
        });
        this.userToQuestionChoiceRepository.save(newChoice);

        return newChoice;
    }

    async getAllUserChoices(user: User): Promise<UserToQuestionChoice[]> {
        return this.userToQuestionChoiceRepository.find({ user });
    }
}
