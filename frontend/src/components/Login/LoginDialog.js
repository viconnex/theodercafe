import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import { API_BASE_URL, GOOGLE_AUTH_URI } from 'utils/constants/apiConstants'

const LoginDialog = ({ isOpen, handleClose }) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Tu dois te logger pour sauvegarder ton choix</DialogTitle>
      <DialogActions>
        <Button onClick={() => handleClose()}>Annuler</Button>
        <Button variant="contained" color="primary" onClick={() => (window.location = API_BASE_URL + GOOGLE_AUTH_URI)}>
          Login Google
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginDialog
