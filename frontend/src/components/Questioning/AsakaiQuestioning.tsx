import React, { useEffect, useState } from 'react'
import { Question } from 'components/Question'
import { ASAKAI_MODE, ASAKAI_QUESTION_COUNT } from 'utils/constants/questionConstants'
import { useSnackbar } from 'notistack'
import { Alterodo } from 'components/Alterodo'
import { fetchRequest, fetchRequestResponse } from 'services/api'
import EmailSnackbar from 'components/EmailSnackbar/EmailSnackbar'
import { CircularProgress } from '@material-ui/core'
import { Alterodos, Choice, QuestioningAnswers, QuestionResponse } from 'components/Questioning/types'
import { answerQuestioning, onAnswerChange } from 'services/firebase/requests'
import { useFirebaseAuth } from 'services/firebase/authentication'
import { AuthRole, User } from 'services/authentication'
import Browser from 'components/Questioning/Browser'
import useStyle from './style'

const AsakaiQuestioning = ({ user }: { user: User | null }) => {
  const [questions, setQuestions] = useState<QuestionResponse[]>([])
  const [questioningId, setQuestioningId] = useState<null | number>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [asakaiChoices, setAsakaiChoices] = useState<{ [questionId: number]: Choice }>({})
  const [alterodos, setAlterodos] = useState<Alterodos | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [firebaseUid, setFirebaseUid] = useState<null | string>(null)
  const [questioningAnswers, setQuestioningAnswers] = useState<QuestioningAnswers | null>(null)

  const { enqueueSnackbar } = useSnackbar()

  const question = questions[questionIndex]

  const fetchAndSetQuestions = async (changeQuestioning: boolean) => {
    setIsLoading(true)
    const basePath = changeQuestioning ? `/questions/${ASAKAI_MODE}/reset` : `/questions/${ASAKAI_MODE}`
    const response = await fetchRequestResponse(
      {
        uri: `${basePath}?maxNumber=${ASAKAI_QUESTION_COUNT}`,
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
    if (!question || !firebaseUid) {
      return
    }
    const unsubscribe = onAnswerChange({
      questioningId,
      questionId: question.id,
      setQuestioningAnswers,
    })
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [questioningId, question, firebaseUid])

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
    void fetchAndSetQuestions(true)
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
    const excludedUserId = user?.id
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
    const choices = { ...asakaiChoices }
    choices[questionId] = choice
    setAsakaiChoices(choices)

    if (firebaseUid) {
      await answerQuestioning({ questioningId, questionId, choice, userId: firebaseUid })
    }

    if (questionIndex === questions.length - 1) {
      await handleAsakaiFinish()
      return
    }
    // changeQuestion(1)
  }

  const classes = useStyle()

  const QuestionContent = () => {
    if (isLoading) {
      return <CircularProgress color="secondary" />
    }
    if (question && !alterodos) {
      return (
        <React.Fragment>
          <Question hideCategory question={question} choice={asakaiChoices[question.id]} chose={chose} plusOneEnabled />
          <Browser
            hideArrows={!asakaiChoices[question.id]}
            questionIndex={questionIndex}
            changeQuestion={changeQuestion}
            questionLength={questions.length}
          />
        </React.Fragment>
      )
    }
    if (alterodos) {
      return (
        <React.Fragment>
          <div className={classes.email}>
            <EmailSnackbar
              connectedUserId={user?.id}
              asakaiChoices={asakaiChoices}
              alterodoUserId={alterodos?.alterodo.userId}
            />
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
        {user?.role === AuthRole.Admin && (
          <div className={classes.asakaiNewSetButton} onClick={changeAsakaiSet}>
            Changer le set du jour
          </div>
        )}
      </div>
      <div className={classes.questioningContent}>
        <QuestionContent />
      </div>
    </div>
  )
}

export default AsakaiQuestioning
