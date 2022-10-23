import { Filters, QuestionResponse, QuestionsPolls } from 'components/Questioning/types'
import { MBTI_CATEGORY_NAME } from 'utils/constants/questionConstants'

const isNotAnsweredQuestion = (
  question: QuestionResponse,
  areChoicesFetched: boolean,
  questionsPolls: QuestionsPolls,
) => {
  return areChoicesFetched ? !questionsPolls[question.id]?.userChoice : false
}

export const filterQuestion =
  (filters: Filters, areChoicesFetched: boolean, questionsPolls: QuestionsPolls) => (question: QuestionResponse) => {
    if (filters.isMBTI) {
      return question.category?.name === MBTI_CATEGORY_NAME
    }
    if (
      !(
        (!filters.isValidated && !filters.isNotValidated && !filters.isInValidation) ||
        (filters.isValidated && question.isValidated === true) ||
        (filters.isNotValidated && question.isValidated === false) ||
        (filters.isInValidation && question.isValidated === null)
      )
    ) {
      return false
    }
    if (
      !(
        (!filters.isNotAnswered && !filters.isAnswered) ||
        (filters.isNotAnswered && isNotAnsweredQuestion(question, areChoicesFetched, questionsPolls)) ||
        (filters.isAnswered && !isNotAnsweredQuestion(question, areChoicesFetched, questionsPolls))
      )
    ) {
      return false
    }

    if (
      !(
        (!filters.isJoke && !filters.isNotJoke) ||
        (filters.isJoke && question.isJoke) ||
        (filters.isNotJoke && question.isJoke === false)
      )
    ) {
      return false
    }

    if (
      !(
        (!filters.isJokeOnSomeone && !filters.isNotJokeOnSomeone) ||
        (filters.isJokeOnSomeone && question.isJokeOnSomeone) ||
        (filters.isNotJokeOnSomeone && question.isJokeOnSomeone === false)
      )
    ) {
      return false
    }

    return true
  }
