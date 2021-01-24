import { QuestionResponse } from 'components/Questioning/types'

export type AdminQuestionResponse = {
  id: number
  categoryId: number | null
  categoryName?: string
  choice1count: string | null
  choice2count: string | null
  downVotes: string | null
  isClassic: boolean
  isJoke: boolean
  isJokeOnSomeone: boolean
  isValidated: boolean
  option1: string
  option2: string
  upVotes: null | string
}

export type QuestioningResponse = {
  questioningId: number
  questions: QuestionResponse[]
}
