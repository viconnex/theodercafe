import { factorizeMatrix, buildCompletedMatrix } from 'matrix-factorization';

import { UserToQuestionChoice } from '../userToQuestionChoice.entity';
import { UserToQuestionChoiceRepository } from '../userToQuestionChoice.repository';
import { AsakaiChoices, AlterodoSimilarity, Alterodo } from '../userToQuestionChoice.types';
import { BadRequestException } from '@nestjs/common';

export const findAlterodoFromCommonChoices = async (
    userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
    asakaiChoices: AsakaiChoices,
): Promise<Alterodo> => {
    const answeredQuestionsIds = Object.keys(asakaiChoices);
    const totems: { [id: number]: AlterodoSimilarity } = {};

    const userToQuestionChoices = await userToQuestionChoiceRepository.findByQuestionIds(answeredQuestionsIds);
    if (userToQuestionChoices.length === 0) {
        throw new BadRequestException('no choices have been made by other users');
    }

    userToQuestionChoices.forEach((userToQuestionChoice: UserToQuestionChoice): void => {
        const isSameChoice = asakaiChoices[userToQuestionChoice.questionId] === userToQuestionChoice.choice;
        const totemIncrement = {
            similarity: isSameChoice ? 1 : 0,
            sameAnswerCount: isSameChoice ? 1 : 0,
            squareNorm: 1,
        };
        if (!totems.hasOwnProperty(userToQuestionChoice.userId)) {
            totems[userToQuestionChoice.userId] = totemIncrement;
            return;
        }
        const currentAlterodo = totems[userToQuestionChoice.userId];
        totems[userToQuestionChoice.userId] = {
            similarity: currentAlterodo.similarity + totemIncrement.similarity,
            sameAnswerCount: currentAlterodo.sameAnswerCount + totemIncrement.sameAnswerCount,
            squareNorm: currentAlterodo.squareNorm + totemIncrement.squareNorm,
        };
    });
    const asakaiNorm = Math.sqrt(Object.keys(asakaiChoices).length);

    let bestSimilarity = -1;
    let bestTotemIds = [];
    for (const userId in totems) {
        const similarity = totems[userId].similarity / (Math.sqrt(totems[userId].squareNorm) * asakaiNorm);
        totems[userId].similarity = similarity;
        if (similarity > bestSimilarity) {
            bestTotemIds = [userId];
            bestSimilarity = similarity;
        } else if (similarity === bestSimilarity) {
            bestTotemIds.push(userId);
        }
    }
    console.log('totems', totems);
    const totemIdIndex = Math.floor(Math.random() * bestTotemIds.length);

    const totem = {
        user: { userId: parseInt(bestTotemIds[totemIdIndex]) },
        similarity: totems[parseInt(bestTotemIds[totemIdIndex])],
    };

    return totem;
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
