import React, { useEffect, useState } from 'react'
import { Question } from 'components/Question'
import { ASAKAI_MODE, ASAKAI_QUESTION_COUNT } from 'utils/constants/questionConstants'
import { useSnackbar } from 'notistack'
import { Alterodo } from 'components/Alterodo'
import { fetchRequest, fetchRequestResponse, postChoice } from 'services/api'
import EmailSnackbar from 'components/EmailSnackbar/EmailSnackbar'
import { Button, CircularProgress } from '@material-ui/core'
import { Alterodos, AsakaiChoices, Choice, QuestioningAnswers, QuestionResponse } from 'components/Questioning/types'
import { answerQuestioning, onAnswerChange } from 'services/firebase/requests'
import { useFirebaseAuth } from 'services/firebase/authentication'
import { AuthRole, login, User } from 'services/authentication'
import Browser from 'components/Questioning/Browser'
import { ModeSelector } from 'components/ModeSelector'
import useStyle from './style'

const QuestionContent = ({
  isLoading,
  chose,
  questions,
  question,
  user,
  questionIndex,
  questioningAnswers,
  asakaiChoices,
  changeQuestion,
}: {
  isLoading: boolean
  chose: (questionId: number, choice: Choice) => void
  questions: QuestionResponse[]
  question: QuestionResponse | undefined
  user: User | null
  questionIndex: number
  questioningAnswers: QuestioningAnswers | null
  asakaiChoices: AsakaiChoices
  changeQuestion: (increment: number) => Promise<void>
}) => {
  const classes = useStyle()
  if (!question || isLoading) {
    return <CircularProgress color="secondary" />
  }
  return (
    <React.Fragment>
      {!user && questionIndex === 0 && (
        <Button className={classes.activateLive} onClick={login} variant="contained" color="secondary">
          Activer le live
        </Button>
      )}
      <Question
        questioningAnswers={questioningAnswers}
        hideCategory
        question={question}
        choice={asakaiChoices[question.id]}
        chose={chose}
        plusOneEnabled
      />
      <Browser
        hideArrows={!asakaiChoices[question.id]}
        questionIndex={questionIndex}
        changeQuestion={changeQuestion}
        questionLength={questions.length}
      />
    </React.Fragment>
  )
}

const AsakaiQuestioning = ({ user }: { user: User | null }) => {
  const [questions, setQuestions] = useState<QuestionResponse[]>([])
  const [questioningId, setQuestioningId] = useState<null | number>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [asakaiChoices, setAsakaiChoices] = useState<AsakaiChoices>({})
  const [alterodos, setAlterodos] = useState<Alterodos | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCoachMode, setIsCoachMode] = useState(false)
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

  const changeQuestion = async (increment: number) => {
    let index = questionIndex + increment
    if (index < 0) {
      index = 0
    }
    if (index < questions.length && index >= 0) {
      setQuestionIndex(index)
    }
    if (index === questions.length) {
      await handleAsakaiFinish()
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

  const chose = (questionId: number, choice: Choice) => {
    const choices = { ...asakaiChoices }
    choices[questionId] = choice
    setAsakaiChoices(choices)

    if (firebaseUid) {
      void answerQuestioning({ questioningId, questionId, choice, userId: firebaseUid })
    }

    if (!isCoachMode && user) {
      void postChoice(questionId, choice, enqueueSnackbar, null)
    }

    if (!firebaseUid) {
      void changeQuestion(1)
    }
  }

  const classes = useStyle()

  return (
    <div className={classes.questioningContainer}>
      <div className={classes.asakaiSubtitle}>
        {user && (
          <ModeSelector
            label="Mode Coach"
            isModeOn={isCoachMode}
            handleModeChange={setIsCoachMode}
            tooltipContent={null}
            withMargin={false}
          />
        )}
        {user?.role === AuthRole.Admin && (
          <div className={classes.asakaiNewSetButton} onClick={changeAsakaiSet}>
            Changer le set du jour
          </div>
        )}
      </div>
      <div className={classes.questioningContent}>
        {!alterodos ? (
          <QuestionContent
            isLoading={isLoading}
            chose={chose}
            questions={questions}
            question={question}
            user={user}
            questionIndex={questionIndex}
            questioningAnswers={questioningAnswers}
            asakaiChoices={asakaiChoices}
            changeQuestion={changeQuestion}
          />
        ) : (
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
        )}
      </div>
    </div>
  )
}

export default AsakaiQuestioning
