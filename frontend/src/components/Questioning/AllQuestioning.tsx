import React, { ChangeEvent, useEffect, useState } from 'react'
import { Question } from 'components/Question'
import { USER_TO_QUESTIONS_CHOICES_URI, USER_TO_QUESTIONS_VOTES_URI } from 'utils/constants/apiConstants'
import { useSnackbar } from 'notistack'
import TuneIcon from '@material-ui/icons/Tune'

import { LoginDialog } from 'components/Login'
import { fetchRequestResponse, postChoice } from 'services/api'
import { Button, CircularProgress } from '@material-ui/core'
import { FilterDrawer } from 'components/FilterDrawer'
import Browser from 'components/Questioning/Browser'
import { Choice, QuestionResponse, UserChoice, UserVote } from 'components/Questioning/types'
import { User } from 'services/authentication'
import { ALL_QUESTIONS_MODE } from 'utils/constants/questionConstants'
import Voter from './Voter'
import useStyle from './style'

const QuestioningContent = ({
  areChoicesFetched,
  choices,
  chose,
  isLoading,
  question,
  questionIndex,
  changeQuestion,
  filteredQuestions,
  vote,
  votes,
}: {
  areChoicesFetched: boolean
  choices: Record<number, Choice>
  isLoading: boolean
  chose: (questionId: number, choice: Choice) => void
  question: QuestionResponse | undefined
  questionIndex: number
  changeQuestion: (increment: number) => void
  filteredQuestions: QuestionResponse[]
  vote: (questionId: number, isUpVote: boolean) => void
  votes: Record<number, boolean>
}) => {
  const classes = useStyle()
  const getValidationInformation = (questionValidation: boolean) => {
    if (questionValidation === null) {
      return 'Question en attente de validation'
    }
    return questionValidation ? 'Question validée' : 'Question invalidée'
  }

  if (isLoading) {
    return <CircularProgress color="secondary" />
  }
  if (question) {
    return (
      <React.Fragment>
        <Question question={question} chose={chose} choice={choices[question.id]} />
        <Browser
          questionIndex={questionIndex}
          changeQuestion={changeQuestion}
          questionLength={filteredQuestions.length}
        />
        <div className={classes.filterOption}>{getValidationInformation(question.isValidated)}</div>
        <Voter questionId={question.id} isUpVote={votes[question.id]} vote={vote} />
      </React.Fragment>
    )
  }
  if (areChoicesFetched) {
    return <div>Aucune question pour les filtres sélectionnés</div>
  }
  return <CircularProgress color="secondary" />
}

const AllQuestioning = ({ user }: { user: User | null }) => {
  const [filters, setFilters] = useState({
    isValidated: false,
    isNotValidated: false,
    isInValidation: false,
    isNotJoke: false,
    isJoke: false,
    isJokeOnSomeone: false,
    isNotJokeOnSomeone: false,
    isNotAnswered: true,
    isAnswered: false,
  })
  const [questions, setQuestions] = useState<QuestionResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionResponse[]>([])
  const [choices, setChoices] = useState<Record<number, Choice>>({})
  const [votes, setVotes] = useState<Record<number, boolean>>({})
  const [openLoginDialog, setOpenLoginDialog] = useState(false)
  const [areChoicesFetched, setAreChoicesFetched] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const fetchQuestions = async () => {
    setIsLoading(true)
    const response = await fetchRequestResponse(
      { uri: `/questions/${ALL_QUESTIONS_MODE}`, method: 'GET', params: null, body: null },
      200,
      {
        enqueueSnackbar,
        successMessage: null,
      },
    )
    if (!response) {
      setIsLoading(false)
      return
    }
    const data = (await response.json()) as QuestionResponse[]
    setQuestions(data)
    setIsLoading(false)
  }

  /* eslint-disable complexity */
  useEffect(() => {
    const newFilteredQuestions = questions.filter((question) => {
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
          (filters.isNotAnswered && isNotAnsweredQuestion(question)) ||
          (filters.isAnswered && !isNotAnsweredQuestion(question))
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
    })
    setFilteredQuestions(newFilteredQuestions)
    // eslint-disable-next-line
  }, [filters, questions, areChoicesFetched])

  const { enqueueSnackbar } = useSnackbar()

  const fetchChoices = async () => {
    if (!localStorage.jwt_token) {
      return setAreChoicesFetched(true)
    }
    const response = await fetchRequestResponse(
      { uri: `/${USER_TO_QUESTIONS_CHOICES_URI}/user`, method: 'GET', body: null, params: null },
      200,
      {
        enqueueSnackbar,
        successMessage: null,
      },
    )
    if (!response) {
      setAreChoicesFetched(true)
      return
    }
    const userChoices = (await response.json()) as UserChoice[]
    const choicesDic: Record<number, Choice> = {}
    userChoices.forEach((choice) => {
      choicesDic[choice.questionId] = choice.choice
    })
    setChoices(choicesDic)
    setAreChoicesFetched(true)
  }
  const fetchVotes = async () => {
    if (!localStorage.jwt_token) {
      return
    }
    const response = await fetchRequestResponse(
      { uri: `/${USER_TO_QUESTIONS_VOTES_URI}/user`, method: 'GET', body: null, params: null },
      200,
      {
        enqueueSnackbar,
        successMessage: null,
      },
    )
    if (!response) {
      return
    }
    const userVotes = (await response.json()) as UserVote[]
    const votesDic: Record<number, boolean> = {}
    userVotes.forEach((vote) => {
      votesDic[vote.questionId] = vote.isUpVote
    })
    setVotes(votesDic)
  }
  useEffect(() => {
    void fetchQuestions()
    void fetchChoices()
    void fetchVotes()
    // eslint-disable-next-line
  }, [])

  const isNotAnsweredQuestion = (question: QuestionResponse) => {
    return areChoicesFetched ? !choices[question.id] : false
  }

  const handeFilterChange = (option: keyof typeof filters) => (event: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [option]: event.target.checked })
    setQuestionIndex(0)
  }

  const changeQuestion = (increment: number) => {
    let index = questionIndex + increment
    if (index < 0 || index === filteredQuestions.length) {
      index = 0
    }
    setQuestionIndex(index)
  }

  const question = filteredQuestions[questionIndex]

  const chose = async (questionId: number, choice: Choice) => {
    if (!user) {
      return setOpenLoginDialog(true)
    }
    changeQuestion(1)

    if (choices[questionId] !== choice) {
      await postChoice(questionId, choice, enqueueSnackbar, 'Choix enregistré')

      const newChoices = { ...choices }
      newChoices[questionId] = choice
      setChoices(newChoices)
    }
  }
  const vote = (questionId: number, isUpVote: boolean) => {
    if (!user) {
      return setOpenLoginDialog(true)
    }
    const newVote = { ...votes }
    const uri = `/${USER_TO_QUESTIONS_VOTES_URI}/${questionId}/vote`
    let method = 'PUT'
    let body

    if (questionId in votes && votes[questionId] === isUpVote) {
      Reflect.deleteProperty(newVote, questionId)
      method = 'DELETE'
    } else {
      newVote[questionId] = isUpVote
      body = { isUpVote }
    }
    setVotes(newVote)
    void fetchRequestResponse({ uri, method, body, params: null }, 200, { enqueueSnackbar, successMessage: null })
  }

  const classes = useStyle()

  return (
    <div className={classes.questioningContainer}>
      <div className={classes.asakaiSubtitle}>
        <Button startIcon={<TuneIcon />} color="secondary" variant="text" onClick={() => setIsDrawerOpen(true)}>
          Filtres
        </Button>
      </div>
      <div className={`${classes.questioningContent}`}>
        <QuestioningContent
          isLoading={isLoading}
          question={question}
          questionIndex={questionIndex}
          choices={choices}
          chose={chose}
          areChoicesFetched={areChoicesFetched}
          changeQuestion={changeQuestion}
          filteredQuestions={filteredQuestions}
          votes={votes}
          vote={vote}
        />
      </div>
      <LoginDialog isOpen={openLoginDialog} handleClose={() => setOpenLoginDialog(false)} />
      <FilterDrawer
        open={isDrawerOpen}
        close={() => setIsDrawerOpen(false)}
        filters={filters}
        handeFilterChange={handeFilterChange}
      />
    </div>
  )
}

export default AllQuestioning
