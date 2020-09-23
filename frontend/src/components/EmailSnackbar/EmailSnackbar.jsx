import React, { useState } from 'react'

import { IconButton, InputBase, Paper } from '@material-ui/core'
import './style.css'
import { Send } from '@material-ui/icons'
import useStyles from './style'

const EmailSnackbar = () => {
  const classes = useStyles()
  return (
    <Paper component="form" className={classes.root}>
      <InputBase className={classes.input} placeholder="email du coaché" />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <Send />
      </IconButton>
    </Paper>
  )
}

export default EmailSnackbar
