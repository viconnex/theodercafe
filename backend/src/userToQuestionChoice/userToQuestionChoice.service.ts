import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository';
import { Question } from '../question/question.entity';
import { UserToQuestionChoice, AsakaiChoices } from './userToQuestionChoice.entity';
import { In } from 'typeorm';

@Injectable()
export class UserToQuestionChoiceService {
    constructor(
        @InjectRepository(UserToQuestionChoiceRepository)
        private readonly userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
    ) {}

    async saveChoice(question: Question, userId: number, choice: number): Promise<UserToQuestionChoice> {
        const initialChoice = await this.userToQuestionChoiceRepository.findOne({
            userId,
            question,
        });
        if (initialChoice) {
            initialChoice.choice = choice;

            return this.userToQuestionChoiceRepository.save(initialChoice);
        }

        const newChoice = this.userToQuestionChoiceRepository.create({
            userId,
            question,
            choice,
        });

        return this.userToQuestionChoiceRepository.save(newChoice);
    }

    async getAllUserChoices(userId: number): Promise<UserToQuestionChoice[]> {
        return await this.userToQuestionChoiceRepository.find({ userId });
    }

    async findTotem(asakaiChoices: AsakaiChoices): Promise<void> {
        const userToQuestionChoices = await this.userToQuestionChoiceRepository.find({
            where: { questionId: In(Object.keys(asakaiChoices)) },
        });
        console.log(userToQuestionChoices);
        return;
    }
}
