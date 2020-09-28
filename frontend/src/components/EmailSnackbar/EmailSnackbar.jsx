import React, { useState } from 'react'

import { CircularProgress, IconButton, InputBase, Paper, Slide } from '@material-ui/core'
import { Send } from '@material-ui/icons'
import { ASAKAI_EMAIL_PATH, USER_TO_QUESTIONS_CHOICES_URI } from 'utils/constants/apiConstants'
import { fetchRequest } from 'utils/helpers'
import { useSnackbar } from 'notistack'
import { getUserId } from 'services/jwtDecode'
import useStyles from './style'

const EmailSnackbar = ({ asakaiChoices, alterodoUserId }) => {
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [showInput, setShowInput] = useState(true)

  const onEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const onSendClick = async (event) => {
    event.preventDefault()
    const uri = `/${USER_TO_QUESTIONS_CHOICES_URI}/${ASAKAI_EMAIL_PATH}`
    const body = { email, asakaiChoices, alterodoUserId, addedByUserId: getUserId() }
    setIsSendingEmail(true)
    try {
      const response = await fetchRequest({ uri, method: 'POST', body })
      if (!response || response.status !== 201) {
        enqueueSnackbar('Email invalide ou déjà existant', { variant: 'error' })
      } else {
        setShowInput(false)
        enqueueSnackbar('Email envoyé !', { variant: 'success' })
      }
    } catch (e) {
      enqueueSnackbar('Problème de connexion au serveur', { variant: 'error' })
    }
    setIsSendingEmail(false)
  }
  return (
    <Slide direction="right" in={showInput}>
      <Paper component="form" className={classes.root}>
        <InputBase
          type="email"
          label="email"
          autoCorrect="off"
          autoCapitalize="none"
          onChange={onEmailChange}
          value={email}
          className={classes.input}
          placeholder="email du coaché"
        />
        <IconButton type="submit" className={classes.iconButton} aria-label="search" onClick={onSendClick}>
          {!isSendingEmail ? <Send /> : <CircularProgress size={24} />}
        </IconButton>
      </Paper>
    </Slide>
  )
}

export default EmailSnackbar
