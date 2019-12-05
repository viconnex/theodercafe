import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';
import { findAlterodoFromCommonChoices } from './helpers/alterodoStrategies';
import { AsakaiChoices, Alterodo, AlterodoResponse } from './userToQuestionChoice.types';

import { QuestionService } from '../question/question.service';
import { UserService } from '../user/user.service';

@Injectable()
export class UserToQuestionChoiceService {
    constructor(
        @InjectRepository(UserToQuestionChoiceRepository)
        private readonly userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
        private readonly questionService: QuestionService,
        private readonly userService: UserService,
    ) {}

    async saveChoice(questionId: number, userId: number, choice: number): Promise<UserToQuestionChoice> {
        const initialChoice = await this.userToQuestionChoiceRepository.findOne({
            userId,
            questionId,
        });

        if (!initialChoice) {
            this.questionService.updateQuestionChoicesCount(questionId, { 1: 0, 2: 0, [choice]: 1 });

            const newChoice = this.userToQuestionChoiceRepository.create({
                userId,
                questionId,
                choice,
            });

            return this.userToQuestionChoiceRepository.save(newChoice);
        }

        if (initialChoice && initialChoice.choice === choice) {
            return;
        }

        this.questionService.updateQuestionChoicesCount(questionId, {
            1: 0,
            2: 0,
            [initialChoice.choice]: -1,
            [choice]: 1,
        });

        initialChoice.choice = choice;

        return this.userToQuestionChoiceRepository.save(initialChoice);
    }

    async getAllUserChoices(userId: number): Promise<UserToQuestionChoice[]> {
        return await this.userToQuestionChoiceRepository.find({ userId });
    }

    async findAlterodo(asakaiChoices: AsakaiChoices): Promise<AlterodoResponse> {
        const answeredQuestionsIds = Object.keys(asakaiChoices);
        if (answeredQuestionsIds.length === 0)
            throw new BadRequestException('user must answer to at least one question');

        // return findAlterodoFromCommonChoices(this.userToQuestionChoiceRepository, asakaiChoices);
        const alterodo = await findAlterodoFromCommonChoices(this.userToQuestionChoiceRepository, asakaiChoices);
        const user = await this.userService.findOne(alterodo.user.userId);

        const alterodoResponse: AlterodoResponse = {
            ...alterodo,
            user: {
                email: user.email,
                givenName: user.givenName,
                familyName: user.familyName,
                pictureUrl: user.pictureUrl,
            },
        };

        return alterodoResponse;
    }
}
