export type AsakaiChoices = Record<number, number>

type UserAlterodoResponse = {
    givenName: string
    familyName: string
    pictureUrl: string
}

export interface Alterodos {
    alterodo: SimilarityWithUserId
    varieto: SimilarityWithUserId
}

export interface SimilarityWithUserId {
    userId: number
    commonQuestionCount: number
    sameAnswerCount: number
    similarity: number
}
// @ts-ignore
export type AlterodoResponse = {
    baseQuestionCount: number
    alterodo: SimilarityWithUserId & UserAlterodoResponse
    varieto: SimilarityWithUserId & UserAlterodoResponse
}

export interface UserMap {
    x: number
    y: number
    id: number
    givenName: string
    familyName: string
    pictureUrl: string
}

export interface QuestionFilters {
    isValidated?: 'true'
    isNotValidated?: 'true'
    isInValidation?: 'true'
    isJoke?: 'true'
    isNotJoke?: 'true'
    isJokeOnSomeone?: 'true'
    isNotJokeOnSomeone?: 'true'
}

export interface AsakaiEmailDTO {
    email: string
    asakaiChoices?: AsakaiChoices
    alterodoUserId?: number
    addedByUserId?: number | null
}

export type QuestionPoll = {
    questionId: number
    choice1Count: string | null
    choice2Count: string | null
    userChoice: number | null
}

export type FormattedQuestionPoll = {
    choice1Count: number
    choice2Count: number
    userChoice: number | null
}
