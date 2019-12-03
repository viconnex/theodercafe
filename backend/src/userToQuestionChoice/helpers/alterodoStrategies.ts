import { UserToQuestionChoice, AsakaiChoices, AlterodoSimilarity, Alterodo } from '../userToQuestionChoice.entity';
import { UserToQuestionChoiceRepository } from '../userToQuestionChoice.repository';

export const findAlterodoFromCommonChoices = async (
    userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
    asakaiChoices: AsakaiChoices,
): Promise<Alterodo> => {
    const answeredQuestionsIds = Object.keys(asakaiChoices);
    const totems: { [id: number]: AlterodoSimilarity } = {};

    const userToQuestionChoices = await userToQuestionChoiceRepository.findByQuestionIds(answeredQuestionsIds);

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
    let totemId = '0';
    for (const userId in totems) {
        const similarity = totems[userId].similarity / (Math.sqrt(totems[userId].squareNorm) * asakaiNorm);
        totems[userId].similarity = similarity;
        if (similarity > bestSimilarity) {
            totemId = userId;
            bestSimilarity = similarity;
        }
    }
    const totem = {
        user: { userId: parseInt(totemId) },
        similarity: totems[parseInt(totemId)],
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

    const userChoicesMatrix = [Array.from({ length: 2 * n }, (): number => 0)];

    for (const questionId in asakaiChoices) {
        userChoicesMatrix[0][questionIdIndex[questionId] * 2 + asakaiChoices[questionId] - 1] = 1;
    }

    for (const userToQuestionChoice of userToQuestionChoices) {
        if (!userIdIndex.hasOwnProperty(userToQuestionChoice.userId)) {
            userIdIndex[userToQuestionChoice.userId] = currentUserIndex;
            currentUserIndex += 1;
            userChoicesMatrix.push(Array.from({ length: 2 * n }, (): number => 0));
        }
        userChoicesMatrix[userIdIndex[userToQuestionChoice.userId]][
            questionIdIndex[userToQuestionChoice.questionId] * 2 + userToQuestionChoice.choice - 1
        ] = 1;
    }
    console.log('asakai choices', asakaiChoices);
    console.log('questionIndex', questionIdIndex);
    console.log('userIndex', userIdIndex);
    console.log('matrix', userChoicesMatrix);
    return;
};
