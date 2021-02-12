export type QuestionVote = {
    questionId: number
    upVoteCount: string | null
    downVoteCount: string | null
    isUserUpVote: boolean | null
}

export type FormattedQuestionVote = {
    upVoteCount: number
    downVoteCount: number
    isUserUpVote: boolean | null
}
