import { UserLocale } from 'src/user/user.types'

export type ChoicesByQuestion = Record<number, Choice>

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
    asakaiChoices?: ChoicesByQuestion
    alterodoUserId?: number
    addedByUserId?: number | null
    userLocale: UserLocale
}

export type Choice = 1 | 2

export type QuestionPoll = {
    choice1UserIds: number[]
    choice2UserIds: number[]
    userChoice: Choice | null
}
