import React, { useEffect, useState } from 'react'
import { Question } from 'components/Question'
import { fetchRequest } from 'utils/helpers'
import { ASAKAI_MODE, ASAKAI_QUESTION_COUNT } from 'utils/constants/questionConstants'
import { useSnackbar } from 'notistack'
import { Alterodo } from 'components/Alterodo'
import { fetchRequestResponse } from 'services/api'
import { getUserId } from 'services/jwtDecode'
import EmailSnackbar from 'components/EmailSnackbar/EmailSnackbar'
import { CircularProgress } from '@material-ui/core'
import { Alterodos, QuestionResponse } from 'components/Questioning/types'
import { answerQuestioning } from 'services/firebase/requests'
import { useFirebaseAuth } from 'services/firebase/authentication'
import useStyle from './style'

const AsakaiQuestioning = () => {
  const [questions, setQuestions] = useState<QuestionResponse[]>([])
  const [questioningId, setQuestioningId] = useState<null | number>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [asakaiChoices, setAsakaiChoices] = useState<{ [choice: number]: number }>({})
  const [alterodos, setAlterodos] = useState<Alterodos | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [firebaseUid, setFirebaseUid] = useState<null | string>(null)

  console.log('render', 'firebaseUid', firebaseUid)

  const { enqueueSnackbar } = useSnackbar()

  const fetchAndSetQuestions = async (newSet: boolean) => {
    setIsLoading(true)
    const response = await fetchRequestResponse(
      {
        uri: `/questions/${ASAKAI_MODE}?maxNumber=${ASAKAI_QUESTION_COUNT}${newSet ? '&newSet=true' : ''}`,
        method: 'GET',
        params: null,
        body: null,
      },
      200,
      { enqueueSnackbar, successMessage: null },
    )
    if (!response) {
      setIsLoading(false)
      return
    }
    const { questioningId, questions } = (await response.json()) as {
      questioningId: number
      questions: QuestionResponse[]
    }
    setIsLoading(false)
    setQuestioningId(questioningId)
    setQuestions(questions)
    setQuestionIndex(0)
  }

  useFirebaseAuth(setFirebaseUid)

  useEffect(() => {
    void fetchAndSetQuestions(false)
    // eslint-disable-next-line
  }, [])

  const resetQuestioning = () => {
    setAlterodos(null)
    setAsakaiChoices({})
    setQuestionIndex(0)
  }

  const changeAsakaiSet = () => {
    resetQuestioning()
    fetchAndSetQuestions(true)
  }

  const changeQuestion = (increment: number) => {
    let index = questionIndex + increment
    if (index < 0) {
      index = 0
    }
    if (index < questions.length && index >= 0) {
      setQuestionIndex(index)
    }
  }

  const handleAsakaiFinish = async () => {
    let response
    const excludedUserId = getUserId() as null | number
    setIsLoading(true)
    try {
      response = await fetchRequest({
        uri: '/user_to_question_choices/asakai',
        method: 'POST',
        body: { asakaiChoices, excludedUserId },
        params: null,
      })
    } catch {
      setIsLoading(false)
      return enqueueSnackbar('Problème de connexion', { variant: 'error' })
    }
    if (response.status !== 201) {
      setIsLoading(false)
      return enqueueSnackbar("Une erreur s'est produite", { variant: 'error' })
    }
    const data = await response.json()
    setIsLoading(false)
    setAlterodos(data)
  }

  const chose = async (questionId: number, choice: 1 | 2) => {
    const choices = asakaiChoices
    choices[questionId] = choice
    setAsakaiChoices(choices)

    if (firebaseUid) {
      try {
        const res = await answerQuestioning({ questioningId, questionId, choice, userId: firebaseUid })
        console.log('res', res)
      } catch (e) {
        console.log('error', e)
        return
      }
    }

    if (questionIndex === questions.length - 1) {
      await handleAsakaiFinish()
      return
    }
    changeQuestion(1)
  }
  const question = questions[questionIndex]

  const classes = useStyle()

  const QuestionContent = () => {
    if (isLoading) {
      return <CircularProgress color="secondary" />
    }
    if (question && !alterodos) {
      return (
        <React.Fragment>
          <Question question={question} choice={null} chose={chose} plusOneEnabled />
          <div className={classes.asakaibrowser}>
            <div className={classes.counter}>{`${questionIndex + 1} / ${questions.length}`}</div>
          </div>
        </React.Fragment>
      )
    }
    if (alterodos) {
      return (
        <React.Fragment>
          <div className={classes.email}>
            <EmailSnackbar asakaiChoices={asakaiChoices} alterodoUserId={alterodos?.alterodo.userId} />
          </div>
          <Alterodo className={classes.alterodo} alterodos={alterodos} resetQuestioning={resetQuestioning} isAsakai />
        </React.Fragment>
      )
    }
    return <CircularProgress color="secondary" />
  }

  return (
    <div className={classes.questioningContainer}>
      <div className={classes.asakaiSubtitle}>
        <div>Le set du jour</div>
        <div className={classes.asakaiNewSetButton} onClick={changeAsakaiSet}>
          Changer le set du jour
        </div>
      </div>
      <div className={classes.questioningContent}>
        <QuestionContent />
      </div>
    </div>
  )
}

export default AsakaiQuestioning
