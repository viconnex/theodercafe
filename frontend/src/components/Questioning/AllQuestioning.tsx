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
import { Choice, QuestionResponse, QuestionsPolls, QuestionsVotes } from 'components/Questioning/types'
import { User } from 'services/authentication'
import { ALL_QUESTIONS_MODE } from 'utils/constants/questionConstants'
import Voter from '../Voter/Voter'
import useStyle from './style'

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
  const [questionsPolls, setQuestionsPolls] = useState<QuestionsPolls>({})
  const [questionsVotes, setQuestionsVotes] = useState<QuestionsVotes>({})
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
      setAreChoicesFetched(true)
      return
    }
    setAreChoicesFetched(false)
    const response = await fetchRequestResponse(
      { uri: `/${USER_TO_QUESTIONS_CHOICES_URI}`, method: 'GET', body: null, params: null },
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
    const questionPolls = (await response.json()) as QuestionsPolls
    setQuestionsPolls(questionPolls)
    setAreChoicesFetched(true)
  }
  const fetchVotes = async () => {
    if (!localStorage.jwt_token) {
      return
    }
    const response = await fetchRequestResponse(
      { uri: `/${USER_TO_QUESTIONS_VOTES_URI}`, method: 'GET', body: null, params: null },
      200,
      {
        enqueueSnackbar,
        successMessage: null,
      },
    )
    if (!response) {
      return
    }
    const questionsVotes = (await response.json()) as QuestionsVotes
    setQuestionsVotes(questionsVotes)
  }
  useEffect(() => {
    void fetchChoices()
    void fetchVotes()
    // eslint-disable-next-line
  }, [user])

  useEffect(() => {
    void fetchQuestions()
    // eslint-disable-next-line
  }, [])

  const isNotAnsweredQuestion = (question: QuestionResponse) => {
    return areChoicesFetched ? !questionsPolls[question.id]?.userChoice : false
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

  const chose = (questionId: number, choice: Choice) => {
    if (!user) {
      return setOpenLoginDialog(true)
    }

    if (questionsPolls[questionId]?.userChoice !== choice) {
      void postChoice(questionId, choice, enqueueSnackbar, null)

      const newQuestionsPolls = { ...questionsPolls }
      const choiceField = `choice${choice}Count` as 'choice1Count'
      const otherChoiceField = `choice${choice === 1 ? 2 : 1}Count` as 'choice2Count'

      if (questionsPolls[questionId]?.userChoice) {
        // user is changing its mind
        newQuestionsPolls[questionId] = {
          userChoice: choice,
          [choiceField]: questionsPolls[questionId][choiceField] + 1,
          [otherChoiceField]: Math.max(questionsPolls[questionId][otherChoiceField] - 1, 0),
        }
      } else {
        newQuestionsPolls[questionId] = {
          userChoice: choice,
          [choiceField]: questionsPolls[questionId][choiceField] + 1,
          [otherChoiceField]: questionsPolls[questionId][otherChoiceField],
        }
      }

      setQuestionsPolls(newQuestionsPolls)
    } else {
      changeQuestion(1)
    }
  }
  const vote = (questionId: number, isUpVote: boolean) => {
    if (!user) {
      return setOpenLoginDialog(true)
    }
    const uri = `/${USER_TO_QUESTIONS_VOTES_URI}/${questionId}/vote`
    let method = 'PUT'
    let body: undefined | { isUpVote: boolean } = { isUpVote }
    const newQuestionsVotes = { ...questionsVotes }

    const voteField = `${isUpVote ? 'up' : 'down'}VoteCount` as 'upVoteCount'
    const otherChoiceField = `${isUpVote ? 'down' : 'up'}VoteCount` as 'downVoteCount'

    if (!(questionId in questionsVotes) || questionsVotes[questionId].isUserUpVote === null) {
      // user adds a vote
      newQuestionsVotes[questionId] = {
        isUserUpVote: isUpVote,
        [voteField]: questionId in questionsVotes ? questionsVotes[questionId][voteField] + 1 : 1,
        [otherChoiceField]: questionId in questionsVotes ? questionsVotes[questionId][otherChoiceField] : 0,
      }
    } else if (questionsVotes[questionId].isUserUpVote !== isUpVote) {
      // user changes its vote
      newQuestionsVotes[questionId] = {
        isUserUpVote: isUpVote,
        [voteField]: questionsVotes[questionId][voteField] + 1,
        [otherChoiceField]: Math.max(questionsVotes[questionId][otherChoiceField] - 1, 0),
      }
    } else {
      // user removes its vote
      method = 'DELETE'
      body = undefined

      newQuestionsVotes[questionId] = {
        isUserUpVote: null,
        [voteField]: Math.max(questionsVotes[questionId][voteField] - 1, 0),
        [otherChoiceField]: questionsVotes[questionId][otherChoiceField],
      }
    }

    setQuestionsVotes(newQuestionsVotes)
    void fetchRequestResponse({ uri, method, body, params: null }, 200, { enqueueSnackbar, successMessage: null })
  }

  const classes = useStyle()

  const renderQuestionContent = () => {
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
          <Question
            questioningAnswers={
              questionsPolls[question.id] && {
                choice1: questionsPolls[question.id]?.choice1Count,
                choice2: questionsPolls[question.id]?.choice2Count,
              }
            }
            question={question}
            chose={chose}
            choice={questionsPolls[question.id]?.userChoice}
          />
          <Browser
            questionIndex={questionIndex}
            changeQuestion={changeQuestion}
            questionLength={filteredQuestions.length}
          />
          <div className={classes.filterOption}>{getValidationInformation(question.isValidated)}</div>
          <Voter questionId={question.id} questionVote={questionsVotes[question.id]} vote={vote} />
        </React.Fragment>
      )
    }
    if (areChoicesFetched) {
      return <div>Aucune question pour les filtres sélectionnés</div>
    }
    return <CircularProgress color="secondary" />
  }

  return (
    <div className={classes.questioningContainer}>
      <div className={classes.asakaiSubtitle}>
        <Button startIcon={<TuneIcon />} color="secondary" variant="text" onClick={() => setIsDrawerOpen(true)}>
          Filtres
        </Button>
      </div>
      <div className={`${classes.questioningContent}`}>{renderQuestionContent()}</div>
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
