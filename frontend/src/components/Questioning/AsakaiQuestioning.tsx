import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Question } from 'components/Question'
import { ASAKAI_MODE, ASAKAI_QUESTION_COUNT } from 'utils/constants/questionConstants'
import { useSnackbar } from 'notistack'
import { Alterodo } from 'components/Alterodo'
import { fetchRequest, fetchRequestResponse, postChoice, postVote } from 'services/api'
import EmailSnackbar from 'components/EmailSnackbar/EmailSnackbar'
import { Button, CircularProgress } from '@material-ui/core'
import { LoginDialog } from 'components/Login'
import {
  Alterodos,
  AsakaiChoices,
  AsakaiVotes,
  Choice,
  QuestionResponse,
  UsersAnswers,
  UsersPictures,
  UsersVotes,
} from 'components/Questioning/types'
import { answerQuestioning, onAnswerChange } from 'services/firebase/requests'
import { useFirebaseAuth } from 'services/firebase/authentication'
import { AuthRole, login, User } from 'services/authentication'
import Browser from 'components/Questioning/Browser'
import { ModeSelector } from 'components/ModeSelector'
import Voter from 'components/Voter/Voter'
import { computeDefaultQuestionSet, QuestionSet } from 'utils/questionSet'

import useStyle from './style'

export const IS_LIVE_ACTIVATED_BY_DEFAULT = true

const QuestionContent = ({
  isLoading,
  chose,
  vote,
  questions,
  question,
  user,
  questionIndex,
  usersAnswers,
  usersVotes,
  asakaiChoices,
  changeQuestion,
  usersPictures,
  asakaiVotes,
}: {
  isLoading: boolean
  chose: (questionId: number, choice: Choice) => void
  vote: (questionId: number, vote: boolean) => void
  questions: QuestionResponse[]
  question: QuestionResponse | undefined
  user: User | null
  questionIndex: number
  usersAnswers: UsersAnswers | null
  usersVotes: UsersVotes | null
  asakaiChoices: AsakaiChoices
  changeQuestion: (increment: number) => Promise<void>
  usersPictures: UsersPictures | null
  asakaiVotes: AsakaiVotes
}) => {
  const classes = useStyle()
  if (!question || isLoading) {
    return <CircularProgress color="secondary" />
  }
  const choice = asakaiChoices[question.id]

  const questionVote = {
    isUserUpVote: asakaiVotes[question.id] ?? null,
    upVoteCount: usersVotes?.upVotes ?? 0,
    downVoteCount: usersVotes?.downVotes ?? 0,
  }
  return (
    <React.Fragment>
      {!user && questionIndex === 0 && (
        <Button className={classes.activateLive} onClick={login} variant="contained" color="secondary">
          <FormattedMessage id="asakai.activateLive" />
        </Button>
      )}
      <Question
        usersPictures={usersPictures}
        usersAnswers={usersAnswers}
        hideCategory
        question={question}
        choice={choice}
        chose={chose}
      />
      <Browser
        hideRightArrow={!choice}
        questionIndex={questionIndex}
        changeQuestion={changeQuestion}
        questionLength={questions.length}
      />
      <Voter questionId={question.id} questionVote={questionVote} vote={vote} />
    </React.Fragment>
  )
}

const AsakaiQuestioning = ({
  user,
  usersPictures,
  isDataLoading,
  questionSets,
}: {
  user: User | null
  usersPictures: UsersPictures | null
  questionSets: QuestionSet[] | null
  isDataLoading: boolean
}) => {
  const [questions, setQuestions] = useState<QuestionResponse[]>([])
  const [questioningId, setQuestioningId] = useState<null | number>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [asakaiChoices, setAsakaiChoices] = useState<AsakaiChoices>({})
  const [asakaiVotes, setAsakaiVotes] = useState<AsakaiVotes>({})
  const [alterodos, setAlterodos] = useState<Alterodos | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCoachMode, setIsCoachMode] = useState(false)
  const [firebaseUid, setFirebaseUid] = useState<null | string>(null)
  const [usersAnswers, setUsersAnswers] = useState<UsersAnswers | null>(null)
  const [usersVotes, setUsersVotes] = useState<UsersVotes | null>(null)
  const [openLoginDialog, setOpenLoginDialog] = useState(false)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const intl = useIntl()

  const question = questions[questionIndex]

  const fetchAndSetQuestions = async (changeQuestioning: boolean) => {
    setIsLoading(true)
    if (isDataLoading || !questionSets) {
      return
    }
    const basePath = changeQuestioning ? `/questions/${ASAKAI_MODE}/reset` : `/questions/${ASAKAI_MODE}`
    const params: { maxNumber: number; questionSetId?: number } = { maxNumber: ASAKAI_QUESTION_COUNT }
    const selectedQuestionSet = computeDefaultQuestionSet({ user, questionSets })
    if (selectedQuestionSet) {
      params.questionSetId = selectedQuestionSet.id
    }
    const response = await fetchRequestResponse(
      {
        uri: `${basePath}?maxNumber=${ASAKAI_QUESTION_COUNT}`,
        method: 'GET',
        params,
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

  useEffect(() => {
    void fetchAndSetQuestions(false)
    // eslint-disable-next-line
  }, [isDataLoading, user, questionSets])

  useFirebaseAuth(setFirebaseUid, user, enqueueSnackbar)

  useEffect(() => {
    if (!question || !firebaseUid || !questioningId) {
      return
    }
    setUsersAnswers(null)
    setUsersVotes(null)
    const unsubscribe = onAnswerChange({
      questioningId,
      questionId: question.id,
      setUsersAnswers,
      setUsersVotes,
    })
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [questioningId, question, firebaseUid])

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
      if (!user) {
        setQuestionIndex(0)
      } else {
        await handleAsakaiFinish()
      }
    }
  }

  const handleAsakaiFinish = async () => {
    if (!user) {
      return
    }
    let response
    const excludedUserId = user.id
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
      return enqueueSnackbar(intl.formatMessage({ id: 'asakai.finish.error' }), { variant: 'error' })
    }
    if (response.status !== 201) {
      setIsLoading(false)
      return enqueueSnackbar(intl.formatMessage({ id: 'asakai.finish.error' }), { variant: 'error' })
    }
    const data = (await response.json()) as Alterodos
    setIsLoading(false)
    setAlterodos(data)
    enqueueSnackbar(intl.formatMessage({ id: 'asakai.finish.feedback' }), {
      autoHideDuration: null,
      // eslint-disable-next-line
      action: (snackbarId) => (
        <>
          <div onClick={() => closeSnackbar(snackbarId)}>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://docs.google.com/forms/d/e/1FAIpQLSeClG7ZquVyfCakUaAMlpScSWaGx197wIGyS6FMpLxN2v3T_Q/viewform?usp=sf_link"
            >
              {intl.formatMessage({ id: 'asakai.finish.feedback.here' })}
            </a>
          </div>
          <div style={{ marginLeft: '12px' }} onClick={() => closeSnackbar(snackbarId)}>
            ❌
          </div>
        </>
      ),
      variant: 'info',
    })
  }

  const chose = (questionId: number, choice: Choice) => {
    if (asakaiChoices[questionId] === choice) {
      void changeQuestion(1)
      return
    }

    const choices = { ...asakaiChoices }
    choices[questionId] = choice
    setAsakaiChoices(choices)

    if (firebaseUid) {
      void answerQuestioning({
        questioningId,
        questionId,
        choice,
        userId: firebaseUid,
      })
    }

    if (!isCoachMode && user) {
      void postChoice(questionId, choice, enqueueSnackbar, null)
    }

    if (!firebaseUid) {
      void changeQuestion(1)
    }
  }

  const vote = (questionId: number, vote: boolean) => {
    if (!user) {
      return setOpenLoginDialog(true)
    }
    const upVote = asakaiVotes[questionId] === vote ? null : vote
    const votes = { ...asakaiVotes }
    votes[questionId] = upVote
    setAsakaiVotes(votes)

    if (firebaseUid) {
      void answerQuestioning({
        questioningId,
        questionId,
        upVote,
        userId: firebaseUid,
      })
    }

    if (user) {
      void postVote(questionId, upVote, enqueueSnackbar, null)
    }
  }

  const classes = useStyle()

  return (
    <div className={classes.questioningContainer}>
      <div className={classes.asakaiSubtitle}>
        {user && (
          <ModeSelector
            label={intl.formatMessage({ id: 'asakai.modeSelector.coach' })}
            isModeOn={isCoachMode}
            handleModeChange={setIsCoachMode}
            tooltipContent={intl.formatMessage({ id: 'asakai.modeSelector.coach.tooltip' })}
            withMargin={false}
          />
        )}
        {user?.role === AuthRole.Admin && (
          <div className={classes.asakaiNewSetButton} onClick={changeAsakaiSet}>
            <FormattedMessage id="asakai.changeTodaySet" />
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
            usersAnswers={usersAnswers}
            usersVotes={usersVotes}
            asakaiChoices={asakaiChoices}
            asakaiVotes={asakaiVotes}
            changeQuestion={changeQuestion}
            usersPictures={usersPictures}
            vote={vote}
          />
        ) : (
          <React.Fragment>
            {(isCoachMode || !user) && (
              <div className={classes.email}>
                <EmailSnackbar
                  connectedUserId={user?.id}
                  asakaiChoices={asakaiChoices}
                  alterodoUserId={alterodos?.alterodo.userId}
                />
              </div>
            )}
            <Alterodo className={classes.alterodo} alterodos={alterodos} resetQuestioning={resetQuestioning} isAsakai />
          </React.Fragment>
        )}
      </div>
      <LoginDialog isOpen={openLoginDialog} handleClose={() => setOpenLoginDialog(false)} />
    </div>
  )
}

export default AsakaiQuestioning
