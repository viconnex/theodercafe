import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';
import { findAlterodoFromCommonChoices } from './helpers/alterodoStrategies';
import { AsakaiChoices, AlterodoResponse } from './userToQuestionChoice.types';

import { UserService } from '../user/user.service';

@Injectable()
export class UserToQuestionChoiceService {
    constructor(
        @InjectRepository(UserToQuestionChoiceRepository)
        private readonly userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
        private readonly userService: UserService,
    ) {}

    async saveChoice(questionId: number, userId: number, choice: number): Promise<UserToQuestionChoice> {
        const initialChoice = await this.userToQuestionChoiceRepository.findOne({
            userId,
            questionId,
        });

        if (!initialChoice) {
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
        const totems = await findAlterodoFromCommonChoices(this.userToQuestionChoiceRepository, asakaiChoices);
        const userAlterodo = await this.userService.findOne(totems.alterodo.user.userId);
        const userVarieto = await this.userService.findOne(totems.varieto.user.userId);

        const alterodoResponse: AlterodoResponse = {
            alterodo: {
                similarity: totems.alterodo.similarity,
                user: {
                    givenName: userAlterodo.givenName,
                    familyName: userAlterodo.familyName,
                    pictureUrl: userAlterodo.pictureUrl,
                },
            },
            varieto: {
                similarity: totems.varieto.similarity,
                user: {
                    givenName: userVarieto.givenName,
                    familyName: userVarieto.familyName,
                    pictureUrl: userVarieto.pictureUrl,
                },
            },
        };

        return alterodoResponse;
    }
}
