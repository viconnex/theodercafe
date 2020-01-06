import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserToQuestionChoiceRepository } from './userToQuestionChoice.repository';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';
import {
    AsakaiChoices,
    AlterodoResponse,
    Alterodos,
    SimilarityWithUserId,
    UserMapResponse,
} from './userToQuestionChoice.types';

import { UserService } from '../user/user.service';
import { getBestAlterodos, createUsersChoicesMatrix } from './userToQuestionChoice.helpers';

// eslint-disable-next-line
const PCA = require('pca-js');

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

        const alterodos = await this.findAlterodosFromAsakaiChoices(asakaiChoices);

        return this.createAlterodosResponse(answeredQuestionsIds.length, alterodos);
    }

    async getUserAlterodos(userId: number): Promise<AlterodoResponse> {
        const baseQuestionCount = await this.userToQuestionChoiceRepository.countUserQuestionChoices(userId);
        const similarityWithUserIds = await this.userToQuestionChoiceRepository.selectSimilarityWithUserIds(userId);

        const alterodos = await getBestAlterodos(similarityWithUserIds, Math.sqrt(baseQuestionCount));

        return this.createAlterodosResponse(baseQuestionCount, alterodos);
    }

    async createMap(): Promise<UserMapResponse> {
        const { count: questionCount } = await this.userToQuestionChoiceRepository.getValidatedQuestionsCount();
        const userToQuestionChoices = await this.userToQuestionChoiceRepository.findByValidatedQuestions();
        const userQuestionMatrixWithUserIndex = createUsersChoicesMatrix(userToQuestionChoices, questionCount);
        const data = userQuestionMatrixWithUserIndex.usersChoicesMatrix;

        const vectors = PCA.getEigenVectors(data);
        // const topTwo = PCA.computePercentageExplained(vectors, vectors[0], vectors[1]);
        // console.log('topTwo', topTwo);
        const adData = PCA.computeAdjustedData(data, vectors[0], vectors[1]);

        const usersMap = adData.formattedAdjustedData[0].map((x: number): [number] => [x]);
        adData.formattedAdjustedData[1].forEach((y: number, index: number): void => {
            usersMap[index].push(y);
        });

        return { map: usersMap };
    }

    private async createAlterodosResponse(baseQuestionCount: number, alterodos: Alterodos): Promise<AlterodoResponse> {
        const userAlterodos = await this.userService.findWithPublicFields([
            alterodos.alterodo.userId,
            alterodos.varieto.userId,
        ]);

        return {
            baseQuestionCount,
            alterodo: {
                ...alterodos.alterodo,
                ...userAlterodos.find((user): boolean => user.id === alterodos.alterodo.userId),
            },
            varieto: {
                ...alterodos.varieto,
                ...userAlterodos.find((user): boolean => user.id === alterodos.varieto.userId),
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

        return getBestAlterodos(Object.values(commonAnswersWithUsers), Math.sqrt(Object.keys(asakaiChoices).length));
    }
}
