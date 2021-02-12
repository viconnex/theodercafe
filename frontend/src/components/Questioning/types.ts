type UserAlterodoResponse = {
  givenName: string
  familyName: string
  pictureUrl: string
}

export interface SimilarityWithUserId {
  userId: number
  commonQuestionCount: number
  sameAnswerCount: number
  similarity: number
}

export type Alterodos = {
  baseQuestionCount: number
  alterodo: SimilarityWithUserId & UserAlterodoResponse
  varieto: SimilarityWithUserId & UserAlterodoResponse
}

export type QuestionResponse = {
  id: number
  categoryName?: string
  isValidated: boolean
  option1: string
  option2: string
  isJoke: boolean
  isJokeOnSomeone: boolean
}

export type QuestioningAnswers = {
  choice1: number
  choice2: number
}

export type Choice = 1 | 2

export type AsakaiChoices = { [questionId: number]: Choice }

export type QuestionPoll = {
  choice1Count: number
  choice2Count: number
  userChoice: Choice | null
}
export type QuestionVote = {
  upVoteCount: number
  downVoteCount: number
  isUserUpVote: boolean | null
}

export type QuestionsPolls = Record<string, QuestionPoll>
export type QuestionsVotes = Record<string, QuestionVote>
