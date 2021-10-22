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
import { fetchRequest } from 'services/api'
import useStyles from './style'

const Home = ({ user }: { user: User | null }) => {
  const [addQuestionDialog, setAddQuestionDialog] = useState(false)
  const [isAsakaiMode, setIsAsakaiMode] = useState([1, 5].includes(new Date().getDay()))
  const [showMbtiInitially, setShowMbtiInitially] = useState(false)
  const [usersPictures, setUsersPictures] = useState<UsersPictures | null>(null)

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
      <ModeSelector
        label={new Date().getHours() >= 11 ? 'Mode Asakai' : 'Mode Dojo'}
        isModeOn={isAsakaiMode}
        handleModeChange={handleModeChange}
        tooltipContent="En mode Asakai, réponds à 10 questions pour connaître ton Alterodo"
        withMargin
      />
      {isAsakaiMode ? (
        <AsakaiQuestioning user={user} usersPictures={usersPictures} />
      ) : (
        <AllQuestioning showMbtiInitially={showMbtiInitially} usersPictures={usersPictures} user={user} />
      )}
      <Fab className={classes.addButton} size="small" onClick={() => toggleModal(true)}>
        <AddIcon />
      </Fab>
      <AddQuestionDialog
        className={classes.modal}
        open={addQuestionDialog}
        onClose={() => toggleModal(false)}
        handleQuestionAdded={() => setAddQuestionDialog(false)}
      />
    </div>
  )
}

export default Home
