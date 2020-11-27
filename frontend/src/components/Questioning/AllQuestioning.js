import React, { useEffect, useState } from 'react'
import { Question } from 'components/Question'
import { USER_TO_QUESTIONS_CHOICES_URI, USER_TO_QUESTIONS_VOTES_URI } from 'utils/constants/apiConstants'
import { useSnackbar } from 'notistack'
import IconButton from '@material-ui/core/IconButton'
import ArrowBack from '@material-ui/icons/ArrowBack'
import TuneIcon from '@material-ui/icons/Tune'
import ArrowForward from '@material-ui/icons/ArrowForward'
import { isUser } from 'services/jwtDecode'

import { LoginDialog } from 'components/Login'
import { fetchRequestResponse } from 'services/api'
import { Button, CircularProgress } from '@material-ui/core'
import { FilterDrawer } from 'components/FilterDrawer'
import Voter from './Voter'
import useStyle from './style'

const AllQuestioning = ({ questions, isLoading }) => {
  const [filters, setFilters] = useState({
    isValidated: true,
    isNotValidated: false,
    isInValidation: false,
    isNotJoke: false,
    isJoke: false,
    isJokeOnSomeone: false,
    isNotJokeOnSomeone: false,
    isNotAnswered: true,
    isAnswered: false,
  })

  const [questionIndex, setQuestionIndex] = useState(0)
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [choices, setChoices] = useState({})
  const [votes, setVotes] = useState({})
  const [openLoginDialog, setOpenLoginDialog] = useState(false)
  const [areChoicesFetched, setAreChoicesFetched] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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
    const response = await fetchRequestResponse({ uri: `/${USER_TO_QUESTIONS_CHOICES_URI}/user`, method: 'GET' }, 200, {
      enqueueSnackbar,
    })
    if (!response) {
      setAreChoicesFetched(true)
      return
    }
    const userChoices = await response.json()
    const choicesDic = {}
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
    const response = await fetchRequestResponse({ uri: `/${USER_TO_QUESTIONS_VOTES_URI}/user`, method: 'GET' }, 200, {
      enqueueSnackbar,
    })
    if (!response) {
      return
    }
    const userVotes = await response.json()
    const votesDic = {}
    userVotes.forEach((vote) => {
      votesDic[vote.questionId] = vote.isUpVote
    })
    setVotes(votesDic)
  }
  useEffect(() => {
    fetchChoices()
    fetchVotes()
    // eslint-disable-next-line
  }, [])

  const getValidationInformation = (questionValidation) => {
    if (questionValidation === null) {
      return 'Question en attente de validation'
    }
    return questionValidation ? 'Question validée' : 'Question invalidée'
  }

  const isNotAnsweredQuestion = (question) => {
    return areChoicesFetched ? !choices[question.id] : false
  }

  const handeFilterChange = (option) => (event) => {
    setFilters({ ...filters, [option]: event.target.checked })
    setQuestionIndex(0)
  }

  const changeQuestion = (increment) => {
    let index = questionIndex + increment
    if (index < 0 || index === filteredQuestions.length) {
      index = 0
    }
    setQuestionIndex(index)
  }

  const question = filteredQuestions[questionIndex]

  const chose = async (questionId, choice) => {
    if (!isUser()) {
      return setOpenLoginDialog(true)
    }
    changeQuestion(1)

    if (choices[questionId] !== choice) {
      const uri = `/${USER_TO_QUESTIONS_CHOICES_URI}/${questionId}/choice`
      const body = { choice }

      fetchRequestResponse({ uri, method: 'PUT', body }, 200, {
        enqueueSnackbar,
        successMessage: 'Choix enregistré',
      })

      const newChoices = { ...choices }
      newChoices[questionId] = choice
      setChoices(newChoices)
    }
  }
  const vote = async (questionId, isUpVote) => {
    if (!isUser()) {
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

    return fetchRequestResponse({ uri, method, body }, 200, { enqueueSnackbar })
  }

  const classes = useStyle()

  const QuestioningContent = () => {
    if (isLoading) {
      return <CircularProgress color="secondary" />
    }
    if (question) {
      return (
        <React.Fragment>
          <Question question={question} chose={chose} choice={choices[question.id]} />
          <div className={classes.browser}>
            <IconButton
              disabled={questionIndex === 0}
              classes={{ root: classes.nextButton }}
              onClick={() => changeQuestion(-1)}
            >
              <ArrowBack />
            </IconButton>
            <IconButton classes={{ root: classes.nextButton }} onClick={() => changeQuestion(1)}>
              <ArrowForward />
            </IconButton>
            <div className={classes.counter}>{`${questionIndex + 1} / ${filteredQuestions.length}`}</div>
          </div>
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

  return (
    <React.Fragment>
      <div className={classes.asakaiSubtitle}>
        <Button startIcon={<TuneIcon />} color="secondary" variant="text" onClick={() => setIsDrawerOpen(true)}>
          Filtres
        </Button>
      </div>
      <div className={`${classes.questioningContent} ${classes.allQuestioningContent}`}>
        <QuestioningContent />
      </div>
      <LoginDialog isOpen={openLoginDialog} handleClose={() => setOpenLoginDialog(false)} />
      <FilterDrawer
        open={isDrawerOpen}
        close={() => setIsDrawerOpen(false)}
        filters={filters}
        handeFilterChange={handeFilterChange}
      />
    </React.Fragment>
  )
}

export default AllQuestioning
