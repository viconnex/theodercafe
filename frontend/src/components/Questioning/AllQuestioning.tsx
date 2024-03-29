import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Question } from 'components/Question'
import { USER_TO_QUESTIONS_CHOICES_URI, USER_TO_QUESTIONS_VOTES_URI } from 'utils/constants/apiConstants'
import { useSnackbar } from 'notistack'
import TuneIcon from '@material-ui/icons/Tune'
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew'

import { LoginDialog } from 'components/Login'
import { fetchRequestResponse, postChoice, postVote } from 'services/api'
import { Button, CircularProgress } from '@material-ui/core'
import { FilterDrawer } from 'components/FilterDrawer'
import Browser from 'components/Questioning/Browser'
import { Choice, QuestionResponse, QuestionsPolls, QuestionsVotes, UsersPictures } from 'components/Questioning/types'
import { User } from 'services/authentication'
import { ALL_QUESTIONS_MODE, sortMBTI } from 'utils/constants/questionConstants'
import Voter from 'components/Voter/Voter'
import colors from 'ui/colors'
import { filterQuestion } from 'components/Questioning/utils'
import { useHistory } from 'react-router-dom'
import { ExploreOutlined } from '@material-ui/icons'
import { computeDefaultQuestionSet, QuestionSet } from 'utils/questionSet'

import useStyle from './style'

const AllQuestioning = ({
  user,
  showMbtiInitially,
  usersPictures,
  questionSets,
  isDataLoading,
}: {
  user: User | null
  showMbtiInitially: boolean
  usersPictures: UsersPictures | null
  questionSets: QuestionSet[] | null
  isDataLoading: boolean
}) => {
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
    isMBTI: showMbtiInitially,
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
  const intl = useIntl()

  const handleFilterChange = (option: keyof typeof filters) => (checked: boolean) => {
    setFilters({ ...filters, [option]: checked })
    setQuestionIndex(0)
  }

  useEffect(() => {
    if (showMbtiInitially) {
      handleFilterChange('isMBTI')(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMbtiInitially])

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true)
    if (isDataLoading || !questionSets) {
      return
    }
    const questionSet = computeDefaultQuestionSet({ user, questionSets })

    const response = await fetchRequestResponse(
      {
        uri: `/questions/${ALL_QUESTIONS_MODE}`,
        method: 'GET',
        params: questionSet !== undefined ? { questionSetId: questionSet?.id ?? null } : {},
        body: null,
      },
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
    // eslint-disable-next-line
  }, [user, questionSets, isDataLoading])

  useEffect(() => {
    void fetchQuestions()
  }, [fetchQuestions])

  /* eslint-disable complexity */
  useEffect(() => {
    const newFilteredQuestions = questions
      .filter(filterQuestion(filters, areChoicesFetched, questionsPolls))
      .sort(sortMBTI)

    setFilteredQuestions(newFilteredQuestions)
    // eslint-disable-next-line
  }, [filters, questions, areChoicesFetched])

  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const questionSet = computeDefaultQuestionSet({ user, questionSets })
    const fetchChoices = async () => {
      setAreChoicesFetched(false)
      const response = await fetchRequestResponse(
        {
          uri: `/${USER_TO_QUESTIONS_CHOICES_URI}`,
          method: 'GET',
          body: null,
          params: questionSet !== undefined ? { questionSetId: questionSet?.id ?? null } : {},
        },
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
      const response = await fetchRequestResponse(
        {
          uri: `/${USER_TO_QUESTIONS_VOTES_URI}`,
          method: 'GET',
          body: null,
          params: questionSet !== undefined ? { questionSetId: questionSet?.id ?? null } : {},
        },
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
    if (user) {
      void fetchChoices()
      void fetchVotes()
    } else {
      setAreChoicesFetched(true)
    }
    // eslint-disable-next-line
  }, [user, questionSets, isDataLoading])

  const history = useHistory()

  const changeQuestion = (increment: number) => {
    let index = questionIndex + increment
    if (index < 0) {
      index = 0
    }
    if (index < filteredQuestions.length && index >= 0) {
      setQuestionIndex(index)
    } else if (filters.isMBTI && index === filteredQuestions.length) {
      history.push('mbti')
    }
  }

  const question = filteredQuestions[questionIndex]

  const getValidationInformation = (questionValidation: boolean | null) => {
    if (questionValidation === null) {
      return intl.formatMessage({ id: 'allQuestioning.awaitingValidation' })
    }
    return questionValidation
      ? intl.formatMessage({ id: 'allQuestioning.validated' })
      : intl.formatMessage({ id: 'allQuestioning.notValidated' })
  }

  const chose = (questionId: number, choice: Choice) => {
    if (!user) {
      return setOpenLoginDialog(true)
    }

    if (questionsPolls[questionId]?.userChoice !== choice) {
      void postChoice(questionId, choice, enqueueSnackbar, null)

      const newQuestionsPolls = { ...questionsPolls }
      const choiceField = `choice${choice}UserIds` as 'choice1UserIds'
      const otherChoiceField = `choice${choice === 1 ? 2 : 1}UserIds` as 'choice2UserIds'

      if (questionId in questionsPolls) {
        questionsPolls[questionId][choiceField].push(user.id)

        newQuestionsPolls[questionId] = {
          userChoice: choice,
          [choiceField]: questionsPolls[questionId][choiceField],
          [otherChoiceField]:
            questionsPolls[questionId].userChoice !== null // user is changing its mind if true
              ? questionsPolls[questionId][otherChoiceField].filter((userId) => userId !== user.id)
              : questionsPolls[questionId][otherChoiceField],
        }
      } else {
        newQuestionsPolls[questionId] = {
          userChoice: choice,
          [choiceField]: [user.id],
          [otherChoiceField]: [],
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
    let upVote: boolean | null = isUpVote
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
      upVote = null

      newQuestionsVotes[questionId] = {
        isUserUpVote: null,
        [voteField]: Math.max(questionsVotes[questionId][voteField] - 1, 0),
        [otherChoiceField]: questionsVotes[questionId][otherChoiceField],
      }
    }

    setQuestionsVotes(newQuestionsVotes)
    void postVote(questionId, upVote, enqueueSnackbar, null)
  }

  const classes = useStyle()

  const renderQuestionContent = () => {
    if (isLoading) {
      return <CircularProgress color="secondary" />
    }
    if (question) {
      return (
        <React.Fragment>
          <Question
            usersAnswers={
              questionsPolls[question.id] && {
                choice1: questionsPolls[question.id]?.choice1UserIds,
                choice2: questionsPolls[question.id]?.choice2UserIds,
              }
            }
            usersPictures={usersPictures}
            question={question}
            chose={chose}
            choice={questionsPolls[question.id]?.userChoice}
          />
          <Browser
            questionIndex={questionIndex}
            changeQuestion={changeQuestion}
            questionLength={filteredQuestions.length}
            hideRightArrow={!filters.isMBTI && questionIndex === filteredQuestions.length - 1}
          />
          <div className={classes.filterOption}>{getValidationInformation(question.isValidated)}</div>
          <Voter questionId={question.id} questionVote={questionsVotes[question.id]} vote={vote} />
        </React.Fragment>
      )
    }
    if (areChoicesFetched) {
      return (
        <div>
          <FormattedMessage id="allQuestioning.noQuestion" />
        </div>
      )
    }
    return <CircularProgress color="secondary" />
  }

  return (
    <div className={classes.questioningContainer}>
      <div className={classes.asakaiSubtitle}>
        <Button startIcon={<TuneIcon />} color="secondary" variant="text" onClick={() => setIsDrawerOpen(true)}>
          <FormattedMessage id="allQuestioning.filters" />
        </Button>
        <Button
          startIcon={<AccessibilityNewIcon style={{ color: filters.isMBTI ? colors.bordeaux : undefined }} />}
          color="secondary"
          variant="text"
          onClick={() => handleFilterChange('isMBTI')(!filters.isMBTI)}
        >
          <FormattedMessage id="allQuestioning.filters.MBTI" />
        </Button>
      </div>
      <div className={`${classes.questioningContent}`}>{renderQuestionContent()}</div>
      {filters.isMBTI && (
        <div className={classes.questioningAction}>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => history.push('mbti')}
            endIcon={<ExploreOutlined />}
          >
            <FormattedMessage id="allQuestioning.MBTI.seeProfiles" />
          </Button>
        </div>
      )}
      <LoginDialog
        isOpen={openLoginDialog}
        handleClose={() => setOpenLoginDialog(false)}
        actionText={intl.formatMessage({ id: 'loginDialog.saveChoice' })}
      />
      <FilterDrawer
        open={isDrawerOpen}
        close={() => setIsDrawerOpen(false)}
        filters={filters}
        handleFilterChange={handleFilterChange}
      />
    </div>
  )
}

export default AllQuestioning
