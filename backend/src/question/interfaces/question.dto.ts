export class AsakaiQuestioning {
    questioningId: number
    questions: QuestionWithCategoryNameDto[]
}

export class QuestionWithCategoryNameDto {
    readonly id: number
    readonly categoryName?: string
    readonly option1: string
    readonly option2: string
    readonly isValidated: boolean
    readonly isJoke: boolean
    readonly isJokeOnSomeone: boolean
}

export class QuestionPostDTO {
    readonly category: string | number
    readonly option1: string
    readonly option2: string
    readonly questionSets: { id: number | null; label: string }[]
}

export type QuestionAdmin = {
    id: number
    categoryId: number
    choice1count: number | null
    choice2count: number | null
    downVotes: number | null
    isClassic: boolean
    isValidated: boolean
    isJoke: boolean
    isJokeOnSomeone: boolean
    option1: string
    option2: string
    upVotes: number | null
}
