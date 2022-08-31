import React, { useEffect, useState } from 'react'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import { AddQuestionDialog } from 'components/AddQuestionDialog'
import { ModeSelector } from 'components/ModeSelector'

import AsakaiQuestioning from 'components/Questioning/AsakaiQuestioning'
import AllQuestioning from 'components/Questioning/AllQuestioning'
import { User } from 'services/authentication'
import { MBTI_URL_PARAM } from 'utils/constants/constants'
import { UsersPictures } from 'components/Questioning/types'
import QuestionSetSelector from 'components/Settings/QuestionSetSelector'
import { fetchRequest, fetchRequestResponse } from 'services/api'
import { QuestionSet } from 'utils/questionSet'
import { useIntl } from 'react-intl'

import useStyles from './style'

const Home = ({
  user,
  isLoggedIn,
  refreshUser,
}: {
  user: User | null
  isLoggedIn: boolean
  refreshUser: () => void
}) => {
  const [addQuestionDialog, setAddQuestionDialog] = useState(false)
  const [isAsakaiMode, setIsAsakaiMode] = useState([1, 5].includes(new Date().getDay()))
  const [showMbtiInitially, setShowMbtiInitially] = useState(false)
  const [usersPictures, setUsersPictures] = useState<UsersPictures | null>(null)
  const [questionSets, setQuestionSets] = useState<QuestionSet[] | null>(null)
  const [refreshQuestionSet, setRefreshQuestionSet] = useState(0)
  const intl = useIntl()

  const fetchQuestionSets = async () => {
    const response = await fetchRequestResponse(
      { uri: '/question_set', method: 'GET', params: null, body: null },
      200,
      {
        enqueueSnackbar: null,
        successMessage: null,
      },
    )
    if (response) {
      const questionSetResponse = (await response.json()) as QuestionSet[]
      setQuestionSets(questionSetResponse)
    }
  }

  useEffect(() => {
    void fetchQuestionSets()
  }, [refreshQuestionSet])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get(MBTI_URL_PARAM)) {
      setShowMbtiInitially(true)
      setIsAsakaiMode(false)
    }
  }, [])

  const fetchUsersPictures = async () => {
    if (!user) {
      return
    }
    try {
      const response = await fetchRequest({
        uri: '/users/pictures',
        method: 'GET',
        body: null,
        params: null,
      })
      const pics = (await response.json()) as UsersPictures
      setUsersPictures(pics)
      Object.values(pics).forEach((url) => {
        if (url) {
          const image = new Image()
          image.src = url
        }
      })
    } catch {
      //
    }
  }

  useEffect(() => {
    void fetchUsersPictures()
  }, [user])

  const handleModeChange = (isAsakai: boolean) => {
    setIsAsakaiMode(isAsakai)
  }

  const toggleModal = (open: boolean) => setAddQuestionDialog(open)
  const classes = useStyles()
  return (
    <div className={classes.pageContainer}>
      <div className={classes.modesSelectorContainer}>
        <ModeSelector
          label={intl.formatMessage({ id: 'home.modeSelector.title' })}
          isModeOn={isAsakaiMode}
          handleModeChange={handleModeChange}
          tooltipContent={intl.formatMessage({ id: 'home.modeSelector.tooltip' })}
          withMargin={false}
        />
        {!!user && questionSets ? (
          <QuestionSetSelector user={user} refreshUser={refreshUser} questionSets={questionSets} isWhite={true} />
        ) : (
          <></>
        )}
      </div>
      {isAsakaiMode ? (
        <AsakaiQuestioning
          user={user}
          usersPictures={usersPictures}
          isDataLoading={!questionSets || (isLoggedIn && !user)}
          questionSets={questionSets}
        />
      ) : (
        <AllQuestioning
          showMbtiInitially={showMbtiInitially}
          usersPictures={usersPictures}
          user={user}
          isDataLoading={!questionSets || (isLoggedIn && !user)}
          questionSets={questionSets}
        />
      )}
      <Fab className={classes.addButton} size="small" onClick={() => toggleModal(true)}>
        <AddIcon />
      </Fab>
      <AddQuestionDialog
        open={addQuestionDialog}
        onClose={() => toggleModal(false)}
        handleQuestionAdded={() => setAddQuestionDialog(false)}
        user={user}
        questionSets={questionSets}
        setRefreshQuestionSet={setRefreshQuestionSet}
      />
    </div>
  )
}

export default Home
