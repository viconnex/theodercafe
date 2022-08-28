import React, { useState } from 'react'
import { MenuItem, OutlinedInput as MuiOutlinedInput, Select } from '@material-ui/core'
import { User } from 'services/authentication'
import { QuestionSet } from 'utils/questionSet'
import { fetchRequestResponse } from 'services/api'
import { useSnackbar } from 'notistack'
import { useSelectSetStyle } from 'components/Settings/style'

const QuestionSetSelector = ({
  user,
  refreshUser,
  questionSets,
  isWhite = false,
}: {
  user: User
  refreshUser: () => void
  questionSets: QuestionSet[]
  isWhite?: boolean
}) => {
  const [selectedQuestionSetId, setSelectedQuestionSetId] = useState(user.selectedQuestionSet.id)
  const { enqueueSnackbar } = useSnackbar()
  const classes = useSelectSetStyle()

  const onChange = async (newId: number) => {
    if (newId === selectedQuestionSetId) {
      return
    }
    setSelectedQuestionSetId(newId)
    await fetchRequestResponse(
      { uri: '/users/settings', method: 'POST', params: null, body: { selectedQuestionSetId: newId } },
      201,
      {
        enqueueSnackbar,
        successMessage: 'Changements enregistrés',
      },
    )
    refreshUser()
  }

  return (
    <Select
      variant="outlined"
      value={selectedQuestionSetId}
      onChange={(event) => onChange(event.target.value as number)}
      input={isWhite ? <MuiOutlinedInput classes={{ notchedOutline: classes.notchedOutline }} /> : undefined}
      classes={isWhite ? { root: classes.root, icon: classes.icon } : undefined}
    >
      {questionSets?.map((questionSet) => (
        <MenuItem key={questionSet.id} value={questionSet.id}>
          {questionSet.name}
        </MenuItem>
      ))}
    </Select>
  )
}

export default QuestionSetSelector
