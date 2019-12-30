import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';
import { AsakaiChoices, AlterodoResponse, Alterodos, SimilarityWithUserId } from './userToQuestionChoice.types';

import { UserService } from '../user/user.service';
import { selectAlterodosFromSimilarityWithUserIds } from './userToQuestionChoice.helpers';

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

    async findAsakaiAlterodos(asakaiChoices: AsakaiChoices): Promise<AlterodoResponse> {
        const answeredQuestionsIds = Object.keys(asakaiChoices);
        if (answeredQuestionsIds.length === 0)
            throw new BadRequestException('user must answer to at least one question');

        // return findAlterodoFromCommonChoices(this.userToQuestionChoiceRepository, asakaiChoices);
        const alterodos = await this.findAlterodosFromAsakaiChoices(asakaiChoices);
        const userAlterodo = await this.userService.findOneAndSelectPublicFields(alterodos.alterodo.userId);
        const userVarieto = await this.userService.findOneAndSelectPublicFields(alterodos.varieto.userId);

        return {
            alterodo: {
                ...alterodos.alterodo,
                ...userAlterodo,
            },
            varieto: {
                ...alterodos.varieto,
                ...userVarieto,
            },
        };
    }

    private async findAlterodosFromAsakaiChoices(asakaiChoices: AsakaiChoices): Promise<Alterodos> {
        const answeredQuestionsIds = Object.keys(asakaiChoices);
        const commonAnswersWithUsers: { [id: number]: SimilarityWithUserId } = {};

        const userToQuestionChoices = await this.userToQuestionChoiceRepository.findByQuestionIds(answeredQuestionsIds);
        if (userToQuestionChoices.length === 0) {
            throw new BadRequestException('no choices have been made by other users');
        }

        userToQuestionChoices.forEach((userToQuestionChoice: UserToQuestionChoice): void => {
            const isSameChoice = asakaiChoices[userToQuestionChoice.questionId] === userToQuestionChoice.choice;
            if (!commonAnswersWithUsers.hasOwnProperty(userToQuestionChoice.userId)) {
                commonAnswersWithUsers[userToQuestionChoice.userId] = {
                    commonQuestionCount: 1,
                    sameAnswerCount: isSameChoice ? 1 : 0,
                    similarity: 0,
                    userId: userToQuestionChoice.userId,
                };
            } else {
                commonAnswersWithUsers[userToQuestionChoice.userId].sameAnswerCount += isSameChoice ? 1 : 0;
                commonAnswersWithUsers[userToQuestionChoice.userId].commonQuestionCount += 1;
            }
        });

        return selectAlterodosFromSimilarityWithUserIds(
            Object.values(commonAnswersWithUsers),
            Math.sqrt(Object.keys(asakaiChoices).length),
        );
    }
}
