import React from 'react'
import { Button, CircularProgress } from '@material-ui/core'
import { Route } from 'react-router-dom'
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

const RedirectComponent = ({ component: Component, isAdminRoute, user, isLoggedIn, ...props }) => {
  const classes = useStyle()
  if (isLoggedIn && !user) {
    // user is going to be fetched
    return <CircularProgress style={{ position: 'absolute', left: '50%', top: '50%' }} color="secondary" />
  }

  if (!user) {
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
  if (isAdminRoute && user.role !== 'admin') {
    return <div>Tu dois être admin pour accéder à cette page</div>
  }

  return <Component user={user} {...props} />
}

const PrivateRoute = ({ component, isAdminRoute, user, isLoggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <RedirectComponent
          user={user}
          isLoggedIn={isLoggedIn}
          component={component}
          {...props}
          isAdminRoute={isAdminRoute}
        />
      )}
    />
  )
}

export default PrivateRoute
