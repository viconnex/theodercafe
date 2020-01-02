import { Alterodos, SimilarityWithUserId } from './userToQuestionChoice.types';

export const getBestAlterodos = (similarityWithUsers: SimilarityWithUserId[], userNorm: number): Alterodos => {
    let bestSimilarity = -1;
    let bestAlterodoIndexes = [];
    let bestDifference = -1;
    let bestVarietoIndexes = [];

    similarityWithUsers.forEach((similarityWithUser, similarityWithUserIndex): void => {
        const currentUserNorm = Math.sqrt(similarityWithUser.commonQuestionCount);
        const similarity = similarityWithUser.sameAnswerCount / (currentUserNorm * userNorm);
        const difference = similarityWithUser.commonQuestionCount / (currentUserNorm * userNorm) - similarity;

        similarityWithUser.similarity = similarity;

        if (similarity > bestSimilarity) {
            bestAlterodoIndexes = [similarityWithUserIndex];
            bestSimilarity = similarity;
        } else if (similarity === bestSimilarity) {
            bestAlterodoIndexes.push(similarityWithUserIndex);
        }
        if (difference > bestDifference) {
            bestVarietoIndexes = [similarityWithUserIndex];
            bestDifference = difference;
        } else if (difference === bestSimilarity) {
            bestVarietoIndexes.push(similarityWithUserIndex);
        }
    });

    const alterodoIndex = bestAlterodoIndexes[Math.floor(Math.random() * bestAlterodoIndexes.length)];
    const varietoIndex = bestVarietoIndexes[Math.floor(Math.random() * bestVarietoIndexes.length)];

    return {
        alterodo: {
            ...similarityWithUsers[alterodoIndex],
        },
        varieto: {
            ...similarityWithUsers[varietoIndex],
            similarity: bestDifference,
        },
    };
};

// export const findAlterodoFromMatrixFactorization = async (
//     userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
//     asakaiChoices: AsakaiChoices,
// ): Promise<Alterodo> => {
//     const userToQuestionChoices = await userToQuestionChoiceRepository.findByValidatedQuestions();
//     console.log(userToQuestionChoices);

//     const questionIdIndex = {};
//     const questionIds = [];

//     let currentQuestionIndex = 0;

//     for (const questionId in asakaiChoices) {
//         questionIdIndex[questionId] = currentQuestionIndex;
//         questionIds.push(questionId);
//         currentQuestionIndex += 1;
//     }

//     for (const userToQuestionChoice of userToQuestionChoices) {
//         if (!questionIdIndex.hasOwnProperty(userToQuestionChoice.questionId)) {
//             questionIdIndex[userToQuestionChoice.questionId] = currentQuestionIndex;
//             questionIds.push(userToQuestionChoice.questionId);
//             currentQuestionIndex += 1;
//         }
//     }

//     const userIdIndex = { 0: 0 };
//     let currentUserIndex = 1;

//     const n = questionIds.length;

//     const userChoicesMatrix = [Array.from({ length: n }, (): number => 0)];

//     for (const questionId in asakaiChoices) {
//         userChoicesMatrix[0][questionIdIndex[questionId]] = asakaiChoices[questionId] === 1 ? -1 : 1;
//     }

//     for (const userToQuestionChoice of userToQuestionChoices) {
//         if (!userIdIndex.hasOwnProperty(userToQuestionChoice.userId)) {
//             userIdIndex[userToQuestionChoice.userId] = currentUserIndex;
//             currentUserIndex += 1;
//             userChoicesMatrix.push(Array.from({ length: n }, (): number => 0));
//         }
//         userChoicesMatrix[userIdIndex[userToQuestionChoice.userId]][questionIdIndex[userToQuestionChoice.questionId]] =
//             userToQuestionChoice.choice === 1 ? -1 : 1;
//     }
//     console.log('asakai choices', asakaiChoices);
//     console.log('questionIndex', questionIdIndex);
//     console.log('userIndex', userIdIndex);
//     console.log('initial matrix', userChoicesMatrix);
//     const factors = factorizeMatrix(userChoicesMatrix, 2);
//     const completeMatrix = buildCompletedMatrix(factors);
//     console.log('factorized matrix', completeMatrix);
//     return;
// };
