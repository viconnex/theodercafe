import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import { login } from 'services/authentication'

const LoginDialog = ({ isOpen, handleClose }) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Tu dois te logger pour sauvegarder ton choix</DialogTitle>
      <DialogActions>
        <Button onClick={() => handleClose()}>Annuler</Button>
        <Button variant="contained" color="primary" onClick={login}>
          Login Google
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginDialog
