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
  category: { name: string } | null
  isValidated: boolean
  option1: string
  option2: string
  isJoke: boolean
  isJokeOnSomeone: boolean
}

export type UsersAnswers = {
  choice1: number[]
  choice2: number[]
}

export type UsersVotes = {
  downVotes: number
  upVotes: number
}

export type Choice = 1 | 2
export type UpVote = boolean | null

export type AsakaiChoices = { [questionId: number]: Choice }
export type AsakaiVotes = { [questionId: number]: UpVote }

export type QuestionPoll = {
  choice1UserIds: number[]
  choice2UserIds: number[]
  userChoice: Choice | null
}
export type QuestionVote = {
  upVoteCount: number
  downVoteCount: number
  isUserUpVote: boolean | null
}

export type QuestionsPolls = Record<string, QuestionPoll>
export type QuestionsVotes = Record<string, QuestionVote>

export type Filters = {
  isValidated: boolean
  isNotValidated: boolean
  isInValidation: boolean
  isNotJoke: boolean
  isJoke: boolean
  isJokeOnSomeone: boolean
  isNotJokeOnSomeone: boolean
  isNotAnswered: boolean
  isAnswered: boolean
  isMBTI: boolean
}

export type UsersPictures = Record<string, string | null>
