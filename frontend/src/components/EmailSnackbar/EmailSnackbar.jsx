import React, { useState } from 'react'

import { CircularProgress, IconButton, InputBase, Paper, Slide } from '@material-ui/core'
import { Send } from '@material-ui/icons'
import { USERS_URI } from 'utils/constants/apiConstants'
import { fetchRequest } from 'utils/helpers'
import { useSnackbar } from 'notistack'
import useStyles from './style'

const EmailSnackbar = () => {
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
    const uri = `/${USERS_URI}`
    const body = { email }
    setIsSendingEmail(true)
    try {
      const response = await fetchRequest({ uri, method: 'POST', body })
      if (!response || response.status === 400) {
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
          autocorrect="off"
          autocapitalize="none"
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
