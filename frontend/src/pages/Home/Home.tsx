import React, { useState } from 'react'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import { AddQuestionDialog } from 'components/AddQuestionDialog'
import { ModeSelector } from 'components/ModeSelector'

import AsakaiQuestioning from 'components/Questioning/AsakaiQuestioning'
import AllQuestioning from 'components/Questioning/AllQuestioning'
import { User } from 'services/authentication'
import useStyles from './style'

const Home = ({ user }: { user: User | null }) => {
  const [addQuestionDialog, setAddQuestionDialog] = useState(false)
  const [isAsakaiMode, setIsAsakaiMode] = useState(new Date().getDay() === 1)

  const handleModeChange = (isAsakai: boolean) => {
    setIsAsakaiMode(isAsakai)
  }

  const toggleModal = (open: boolean) => setAddQuestionDialog(open)
  const classes = useStyles()
  return (
    <div className={classes.pageContainer}>
      <ModeSelector
        label="Mode Asakai"
        isModeOn={isAsakaiMode}
        handleModeChange={handleModeChange}
        tooltipContent="En mode Asakai, réponds à 10 questions pour connaître ton Alterodo"
        withMargin
      />
      {isAsakaiMode ? <AsakaiQuestioning user={user} /> : <AllQuestioning user={user} />}
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
