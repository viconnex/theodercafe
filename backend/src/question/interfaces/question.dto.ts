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

export type RawAdminListQuestion = {
    questions_id: number
    questions_categoryId: number | null
    questions_option1: string
    questions_option2: string
    questions_isClassic: boolean
    questions_isDeleted: boolean
    questions_isJokeOnSomeone: boolean
    questions_isValidated: boolean | null
    questions_isJoke: boolean
    questions_addedByUserId: number | null
    questionSet_id: number | null
    questionSet_name: 'Theodo FR'
    choice1count: null | number
    choice2count: null | number
    upvotescount: null | number
    downvotescount: null | number
}

export type AdminListQuestion = {
    id: number
    categoryId: number | null
    option1: string
    option2: string
    isClassic: boolean
    isDeleted: boolean
    isJokeOnSomeone: boolean
    isValidated: boolean | null
    isJoke: boolean
    addedByUserId: number | null
    questionSetIds: number[]
    choice1Count: null | number
    choice2Count: null | number
    upVotesCount: null | number
    downVotesCount: null | number
}

export type QuestionUpdateBody = {
    id: number
    addedByUserId: number
    option1: string
    option2: string
    isClassic: boolean
    isJokeOnSomeone: boolean
    isValidated: boolean | null
    isJoke: boolean
    category: { id: number; name: string } | null
    questionSetIds: number[]
}
