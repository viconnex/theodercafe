import { QuestionResponse } from 'components/Questioning/types'

export const ASAKAI_MODE = 'asakai'
export const ALL_QUESTIONS_MODE = 'all'

export const NOT_ANSWERED = 'notAnswered'
export const ALL_QUESTIONS_OPTION = 'all'
export const VALIDATED_OPTION = 'validated'
const IN_VALIDATION_OPTION = 'inValidation'
const NOT_VALIDATED_OPTION = 'notValidated'

export const FILTER_OPTIONS = [
  { value: VALIDATED_OPTION, label: 'Validées', isValidated: true },
  { value: NOT_ANSWERED, label: 'Pas encore répondu', isValidated: null },
  { value: ALL_QUESTIONS_OPTION, label: 'Toutes les questions', isValidated: true },
  { value: IN_VALIDATION_OPTION, label: 'En attente de validation', isValidated: null },
  { value: NOT_VALIDATED_OPTION, label: 'Invalidées', isValidated: false },
]

export const ASAKAI_QUESTION_COUNT = 10

export const MBTIcategoryName = 'MBTI'

export const MBTI_EXTRAVERSION = 'Extraverti (E)'
export const MBTI_INTROVERSION = 'Introverti (I)'
export const MBTI_SENSATION = 'Sensation (S)'
export const MBTI_INTUITION = 'Intuition (N)'
export const MBTI_THINKING = 'Thinking (T)'
export const MBTI_FEELING = 'Feeling (F)'
export const MBTI_JUGEMENT = 'Jugement (J)'
export const MBTI_PERCEPTION = 'Perception (P)'

const MBTI_SORT = {
  [MBTI_EXTRAVERSION]: 0,
  [MBTI_INTROVERSION]: 0,
  [MBTI_SENSATION]: 1,
  [MBTI_INTUITION]: 1,
  [MBTI_THINKING]: 2,
  [MBTI_FEELING]: 2,
  [MBTI_JUGEMENT]: 3,
  [MBTI_PERCEPTION]: 3,
}
export const sortMBTI = (question1: QuestionResponse, question2: QuestionResponse) => {
  // eslint-disable-next-line
  // @ts-ignore
  return MBTI_SORT[question1.option1] - MBTI_SORT[question2.option2] || 0
}
