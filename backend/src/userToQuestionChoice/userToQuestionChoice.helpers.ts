import { Alterodos, SimilarityWithUserId } from './userToQuestionChoice.types'
import { UserToQuestionChoice } from './userToQuestionChoice.entity'

export const getBestAlterodos = (similarityWithUsers: SimilarityWithUserId[], userNorm: number): Alterodos => {
    let bestSimilarity = -1
    let bestAlterodoIndexes = []
    let bestDifference = -1
    let bestVarietoIndexes = []

    similarityWithUsers.forEach((similarityWithUser, similarityWithUserIndex): void => {
        const currentUserNorm = Math.sqrt(similarityWithUser.commonQuestionCount)
        const similarity = similarityWithUser.sameAnswerCount / (currentUserNorm * userNorm)
        const difference = similarityWithUser.commonQuestionCount / (currentUserNorm * userNorm) - similarity

        similarityWithUser.similarity = similarity

        if (similarity > bestSimilarity) {
            bestAlterodoIndexes = [similarityWithUserIndex]
            bestSimilarity = similarity
        } else if (similarity === bestSimilarity) {
            bestAlterodoIndexes.push(similarityWithUserIndex)
        }
        if (difference > bestDifference) {
            bestVarietoIndexes = [similarityWithUserIndex]
            bestDifference = difference
        } else if (difference === bestSimilarity) {
            bestVarietoIndexes.push(similarityWithUserIndex)
        }
    })

    const alterodoIndex = bestAlterodoIndexes[Math.floor(Math.random() * bestAlterodoIndexes.length)]
    const varietoIndex = bestVarietoIndexes[Math.floor(Math.random() * bestVarietoIndexes.length)]

    return {
        alterodo: {
            ...similarityWithUsers[alterodoIndex],
        },
        varieto: {
            ...similarityWithUsers[varietoIndex],
            similarity: bestDifference,
        },
    }
}

export const createUsersChoicesMatrix = (
    userToQuestionChoices: UserToQuestionChoice[],
    questionCount: number,
): { usersChoicesMatrix: number[][]; userIds: number[] } => {
    const questionIdIndex = {}
    const userIdIndex = {}
    const userIds = []
    let currentUserIdIndex = 0
    let currentQuestionIdIndex = 0

    const usersChoicesMatrix = []

    for (const userToQuestionChoice of userToQuestionChoices) {
        if (!userIdIndex.hasOwnProperty(userToQuestionChoice.userId)) {
            userIdIndex[userToQuestionChoice.userId] = currentUserIdIndex
            userIds.push(userToQuestionChoice.userId)
            currentUserIdIndex += 1
            usersChoicesMatrix.push(Array.from({ length: questionCount }, (): number => 0))
        }
        if (!questionIdIndex.hasOwnProperty(userToQuestionChoice.questionId)) {
            questionIdIndex[userToQuestionChoice.questionId] = currentQuestionIdIndex
            currentQuestionIdIndex += 1
        }
        usersChoicesMatrix[userIdIndex[userToQuestionChoice.userId]][questionIdIndex[userToQuestionChoice.questionId]] =
            userToQuestionChoice.choice === 1 ? -1 : 1
    }

    return {
        usersChoicesMatrix,
        userIds,
    }
}
