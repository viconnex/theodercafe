import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Route } from 'react-router-dom'
import { API_BASE_URL, GOOGLE_AUTH_URI } from 'utils/constants/apiConstants'
import { Button, CircularProgress, makeStyles } from '@material-ui/core'

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
        <div>
          <FormattedMessage id="privateRoute.mustBeConnected" />
        </div>
        <div className={classes.login}>
          <Button variant="contained" href={API_BASE_URL + GOOGLE_AUTH_URI}>
            <FormattedMessage id="privateRoute.loginGoogle" />
          </Button>
        </div>
      </div>
    )
  }
  if (isAdminRoute && user.role !== 'admin') {
    return (
      <div>
        <FormattedMessage id="privateRoute.mustBeAdmin" />
      </div>
    )
  }

  return <Component user={user} {...props} />
}

const PrivateRoute = ({ component, isAdminRoute, user, isLoggedIn, ...props }) => {
  return (
    <Route
      {...props}
      render={(addedByRouteProps) => (
        <RedirectComponent
          user={user}
          isLoggedIn={isLoggedIn}
          component={component}
          {...addedByRouteProps}
          {...props.componentProps}
          isAdminRoute={isAdminRoute}
        />
      )}
    />
  )
}

export default PrivateRoute
