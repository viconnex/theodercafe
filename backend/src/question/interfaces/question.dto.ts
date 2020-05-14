export class QuestionWithCategoryNameDto {
    readonly id: number
    readonly categoryName: string
    readonly option1: string
    readonly option2: string
    readonly isValidated: boolean
}

export class QuestionPostDTO {
    readonly category: string | number
    readonly option1: string
    readonly option2: string
}
