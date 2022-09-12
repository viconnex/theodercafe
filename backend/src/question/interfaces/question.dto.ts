export class QuestionWithCategoryDto {
    readonly id: number
    readonly category: { name: string } | null
    readonly option1: string
    readonly option2: string
    readonly isValidated: boolean | null
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
    isValidated: boolean | null
    isJoke: boolean
    isJokeOnSomeone: boolean
    option1: string
    option2: string
    upVotes: number | null
}

export type QuestionUpdateBody = {
    id: number
    option1: string
    option2: string
    isClassic: boolean
    isJokeOnSomeone: boolean
    isValidated: boolean | null
    isJoke: boolean
    category: { id: number; name: string } | null
    questionSetIds: number[]
}
