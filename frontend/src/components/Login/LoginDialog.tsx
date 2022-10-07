import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import { login } from 'services/authentication'
import { FormattedMessage, useIntl } from 'react-intl'

const LoginDialog = ({
  isOpen,
  handleClose,
  actionText,
}: {
  isOpen: boolean
  handleClose: () => void
  actionText: string
}) => {
  const intl = useIntl()
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{`${intl.formatMessage({ id: 'loginDialog.mustLogin' })} ${actionText}`}</DialogTitle>
      <DialogActions>
        <Button onClick={() => handleClose()}>
          <FormattedMessage id="loginDialog.cancel" />
        </Button>
        <Button variant="contained" color="primary" onClick={login}>
          Login Google
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginDialog
