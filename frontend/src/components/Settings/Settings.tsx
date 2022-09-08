import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { CircularProgress } from '@material-ui/core'
import { User } from 'services/authentication'
import { QuestionSet } from 'utils/questionSet'
import { fetchRequestResponse } from 'services/api'
import { useSnackbar } from 'notistack'
import QuestionSetSelector from 'components/Settings/QuestionSetSelector'
import { useSelectSetWrapperStyle, useSettingsStyle } from './style'

const QuestionSetWrapper = ({ user, refreshUser }: { user: User; refreshUser: () => void }) => {
  const [questionSets, setQuestionSets] = useState<QuestionSet[] | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const classes = useSelectSetWrapperStyle()

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

  if (!questionSets) {
    return <CircularProgress color="secondary" />
  }
  return (
    <div className={classes.container}>
      <h3>
        <FormattedMessage id="settings.questionSet" />
      </h3>
      <QuestionSetSelector questionSets={questionSets} user={user} refreshUser={refreshUser} />
    </div>
  )
}

const Settings = ({ user, refreshUser }: { user: User; refreshUser: () => void }) => {
  const classes = useSettingsStyle()
  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <QuestionSetWrapper user={user} refreshUser={refreshUser} />
      </div>
    </div>
  )
}

export default Settings
