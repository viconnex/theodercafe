import { Button } from '@material-ui/core'
import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { API_BASE_URL, GOOGLE_AUTH_URI } from 'utils/constants/apiConstants'

import { makeStyles } from '@material-ui/core'

const useStyle = makeStyles(() => ({
  container: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    display: 'flex',
  },
  login: {
    marginTop: '32px',
  },
}))

const RedirectComponent = ({ component: Component, isAdminRoute, userRole, ...props }) => {
  const classes = useStyle()
  if (!userRole) {
    return (
      <div className={classes.container}>
        <div>Il faut te connecter pour voir cette page</div>
        <div className={classes.login}>
          <Button variant="contained" href={API_BASE_URL + GOOGLE_AUTH_URI}>
            Login Google
          </Button>
        </div>
      </div>
    )
  }
  if (isAdminRoute && userRole !== 'admin') {
    return <div>Tu dois être admin pour accéder à cette page</div>
  }

  return <Component {...props} />
}

const PrivateRoute = ({ component, isAdminRoute, userRole, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <RedirectComponent userRole={userRole} component={component} {...props} isAdminRoute={isAdminRoute} />
      )}
    />
  )
}

export default PrivateRoute
