import React, { useCallback, useEffect, useState } from 'react'
import { CircularProgress, MenuItem, Select } from '@material-ui/core'
import { User } from 'services/authentication'
import { QuestionSet } from 'utils/questionSet'
import { fetchRequestResponse } from 'services/api'
import { useSnackbar } from 'notistack'

import { useSelectSetStyle, useSettingsStyle } from './style'

const QuestionSetSelector = ({ user, refreshUser }: { user: User; refreshUser: () => void }) => {
  const [questionSets, setQuestionSets] = useState<QuestionSet[] | null>(null)
  const [selectedQuestionSetId, setSelectedQuestionSetId] = useState(user.selectedQuestionSet.id)
  const { enqueueSnackbar } = useSnackbar()
  const classes = useSelectSetStyle()

  const fetchQuestionSets = useCallback(async () => {
    const response = await fetchRequestResponse(
      { uri: '/question_set', method: 'GET', params: null, body: null },
      200,
      {
        enqueueSnackbar,
        successMessage: null,
      },
    )
    if (response) {
      const questionSetResponse = (await response.json()) as QuestionSet[]
      setQuestionSets(questionSetResponse)
    }
  }, [enqueueSnackbar])

  useEffect(() => {
    void fetchQuestionSets()
  }, [fetchQuestionSets])

  const onChange = (newId: number) => {
    if (newId === selectedQuestionSetId) {
      return
    }
    setSelectedQuestionSetId(newId)
    void fetchRequestResponse(
      { uri: '/users/settings', method: 'POST', params: null, body: { selectedQuestionSetId: newId } },
      201,
      {
        enqueueSnackbar,
        successMessage: 'Changements enregistrés',
      },
    )
    refreshUser()
  }

  if (!questionSets) {
    return <CircularProgress color="secondary" />
  }
  return (
    <div className={classes.container}>
      <h3>Set de questions</h3>
      <Select value={selectedQuestionSetId} onChange={(event) => onChange(event.target.value as number)}>
        {questionSets?.map((questionSet) => (
          <MenuItem key={questionSet.id} value={questionSet.id}>
            {questionSet.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}

const Settings = ({ user, refreshUser }: { user: User; refreshUser: () => void }) => {
  console.log('object', refreshUser)
  const classes = useSettingsStyle()
  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <QuestionSetSelector user={user} refreshUser={refreshUser} />
      </div>
    </div>
  )
}

export default Settings
