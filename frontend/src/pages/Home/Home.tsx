import React, { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import { AddQuestionDialog } from 'components/AddQuestionDialog'
import { ModeSelector } from 'components/ModeSelector'

import AsakaiQuestioning from 'components/Questioning/AsakaiQuestioning'
import AllQuestioning from 'components/Questioning/AllQuestioning'
import { ALL_QUESTIONS_MODE } from 'utils/constants/questionConstants'
import { fetchRequestResponse } from 'services/api'
import { User } from 'services/authentication'
import useStyles from './style'

const Home = ({ user }: { user: User | null }) => {
  const [questions, setQuestions] = useState([])
  const [addQuestionDialog, setAddQuestionDialog] = useState(false)
  const [isAsakaiMode, setIsAsakaiMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

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
    const data = await response.json()
    setQuestions(data)
    setIsLoading(false)
  }

  useEffect(() => {
    void fetchQuestions()
    // eslint-disable-next-line
  }, [])

  const handleModeChange = (isAsakai: boolean) => {
    setIsAsakaiMode(isAsakai)
  }

  const toggleModal = (open: boolean) => setAddQuestionDialog(open)
  const classes = useStyles()
  return (
    <div className={classes.pageContainer}>
      <ModeSelector isAsakaiMode={isAsakaiMode} handleModeChange={handleModeChange} />
      <div className={classes.questioningContainer}>
        {isAsakaiMode ? (
          <AsakaiQuestioning user={user} />
        ) : (
          <AllQuestioning user={user} questions={questions} isLoading={isLoading} />
        )}
      </div>
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
