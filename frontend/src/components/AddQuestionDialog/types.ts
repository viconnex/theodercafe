export type Category = {
  id: number
  name: string
}

export type QuestionSet = {
  id: string | number
  name: string
}

export type QuestionSetOption = {
  label: string
  value: string | number
  __isNew__?: boolean
}
