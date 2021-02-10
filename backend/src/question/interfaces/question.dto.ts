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
}
