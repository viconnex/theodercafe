import React from 'react'
import Button from '@material-ui/core/Button'
import { API_BASE_URL, GOOGLE_AUTH_URI } from 'utils/constants/apiConstants'

import useStyle from './style'

const LoginPage = () => {
  const classes = useStyle()
  return (
    <div className={classes.container}>
      <div>
        <Button variant="contained" href={API_BASE_URL + GOOGLE_AUTH_URI}>
          Login Google
        </Button>
      </div>
    </div>
  )
}

export default LoginPage
