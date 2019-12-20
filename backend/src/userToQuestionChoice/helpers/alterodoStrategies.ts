import { factorizeMatrix, buildCompletedMatrix } from 'matrix-factorization';

import { UserToQuestionChoice } from '../userToQuestionChoice.entity';
import { UserToQuestionChoiceRepository } from '../userToQuestionChoice.repository';
import { AsakaiChoices, Alterodo, Totems, SimilarityWithUser } from '../userToQuestionChoice.types';
import { BadRequestException } from '@nestjs/common';

const computeTotemsFromSimilarityWithUsers = (similarityWithUsers: SimilarityWithUser[], userNorm: number): Totems => {
    let bestSimilarity = -1;
    let bestTotemIndexes = [];
    let worstSimilarity = -1;
    let worstSimilarityCommonQuestion = 0;
    let worstTotemIndexes = [];

    similarityWithUsers.forEach((similarityWithUser, similarityWithUserIndex): void => {
        const similarity =
            similarityWithUser.sameAnswerCount / (Math.sqrt(similarityWithUser.commonQuestionCount) * userNorm);
        similarityWithUser.similarity = similarity;
        if (similarity > bestSimilarity) {
            bestTotemIndexes = [similarityWithUserIndex];
            bestSimilarity = similarity;
        } else if (similarity === bestSimilarity) {
            bestTotemIndexes.push(similarityWithUserIndex);
        }
        if (
            similarityWithUser.commonQuestionCount > worstSimilarityCommonQuestion ||
            (similarity < worstSimilarity &&
                similarityWithUser.commonQuestionCount === worstSimilarityCommonQuestion) ||
            worstSimilarity === -1
        ) {
            worstTotemIndexes = [similarityWithUserIndex];
            worstSimilarity = similarity;
            worstSimilarityCommonQuestion = similarityWithUser.commonQuestionCount;
        } else if (
            similarityWithUser.commonQuestionCount === worstSimilarityCommonQuestion &&
            similarity === worstSimilarity
        ) {
            worstTotemIndexes.push([similarityWithUserIndex]);
        }
    });

    const alterodoIndex = bestTotemIndexes[Math.floor(Math.random() * bestTotemIndexes.length)];
    const varietoIndex = worstTotemIndexes[Math.floor(Math.random() * worstTotemIndexes.length)];

    return {
        alterodo: {
            ...similarityWithUsers[alterodoIndex],
        },
        varieto: {
            ...similarityWithUsers[varietoIndex],
        },
    };
};

export const findAlterodoFromCommonChoices = async (
    userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
    asakaiChoices: AsakaiChoices,
): Promise<Totems> => {
    const answeredQuestionsIds = Object.keys(asakaiChoices);
    const commonAnswersWithUsers: { [id: number]: SimilarityWithUser } = {};

    const userToQuestionChoices = await userToQuestionChoiceRepository.findByQuestionIds(answeredQuestionsIds);
    if (userToQuestionChoices.length === 0) {
        throw new BadRequestException('no choices have been made by other users');
    }
    console.log('common ', userToQuestionChoices);

    userToQuestionChoices.forEach((userToQuestionChoice: UserToQuestionChoice): void => {
        const isSameChoice = asakaiChoices[userToQuestionChoice.questionId] === userToQuestionChoice.choice;
        if (!commonAnswersWithUsers.hasOwnProperty(userToQuestionChoice.userId)) {
            commonAnswersWithUsers[userToQuestionChoice.userId] = {
                userId: userToQuestionChoice.userId,
                sameAnswerCount: isSameChoice ? 1 : 0,
                commonQuestionCount: 1,
            };
        } else {
            commonAnswersWithUsers[userToQuestionChoice.userId].sameAnswerCount += isSameChoice ? 1 : 0;
            commonAnswersWithUsers[userToQuestionChoice.userId].commonQuestionCount += 1;
        }
    });

    return computeTotemsFromSimilarityWithUsers(
        Object.values(commonAnswersWithUsers),
        Math.sqrt(Object.keys(asakaiChoices).length),
    );
};

export const findAlterodoFromMatrixFactorization = async (
    userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
    asakaiChoices: AsakaiChoices,
): Promise<Alterodo> => {
    const userToQuestionChoices = await userToQuestionChoiceRepository.findByValidatedQuestions();
    console.log(userToQuestionChoices);

    const questionIdIndex = {};
    const questionIds = [];

    let currentQuestionIndex = 0;

    for (const questionId in asakaiChoices) {
        questionIdIndex[questionId] = currentQuestionIndex;
        questionIds.push(questionId);
        currentQuestionIndex += 1;
    }

    for (const userToQuestionChoice of userToQuestionChoices) {
        if (!questionIdIndex.hasOwnProperty(userToQuestionChoice.questionId)) {
            questionIdIndex[userToQuestionChoice.questionId] = currentQuestionIndex;
            questionIds.push(userToQuestionChoice.questionId);
            currentQuestionIndex += 1;
        }
    }

    const userIdIndex = { 0: 0 };
    let currentUserIndex = 1;

    const n = questionIds.length;

    const userChoicesMatrix = [Array.from({ length: n }, (): number => 0)];

    for (const questionId in asakaiChoices) {
        userChoicesMatrix[0][questionIdIndex[questionId]] = asakaiChoices[questionId] === 1 ? -1 : 1;
    }

    for (const userToQuestionChoice of userToQuestionChoices) {
        if (!userIdIndex.hasOwnProperty(userToQuestionChoice.userId)) {
            userIdIndex[userToQuestionChoice.userId] = currentUserIndex;
            currentUserIndex += 1;
            userChoicesMatrix.push(Array.from({ length: n }, (): number => 0));
        }
        userChoicesMatrix[userIdIndex[userToQuestionChoice.userId]][questionIdIndex[userToQuestionChoice.questionId]] =
            userToQuestionChoice.choice === 1 ? -1 : 1;
    }
    console.log('asakai choices', asakaiChoices);
    console.log('questionIndex', questionIdIndex);
    console.log('userIndex', userIdIndex);
    console.log('initial matrix', userChoicesMatrix);
    const factors = factorizeMatrix(userChoicesMatrix, 2);
    const completeMatrix = buildCompletedMatrix(factors);
    console.log('factorized matrix', completeMatrix);
    return;
};
