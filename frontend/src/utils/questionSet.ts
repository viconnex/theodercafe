import { User } from 'services/authentication'

export type QuestionSet = {
  id: string | number
  name: string
}
export enum PresetQuestionSet {
  TheodoFR = 'Theodo FR',
  TheodoUS = 'Theodo US',
}

export const computeDefaultQuestionSet = ({
  user,
  questionSets,
}: {
  user: User | null
  questionSets: QuestionSet[] | null
}) => {
  if (user) {
    const defaultQuestionSet = questionSets?.find((questionSet) => questionSet.id === user.selectedQuestionSet.id)
    if (defaultQuestionSet) {
      return defaultQuestionSet
    }
  }
  if (navigator.language.includes('en')) {
    const theodoUs = questionSets?.find((questionSet) => questionSet.name === 'Theodo US')
    if (theodoUs) {
      return theodoUs
    }
  }
  return questionSets?.find((questionSet) => questionSet.name === 'Theodo FR') ?? null
}
