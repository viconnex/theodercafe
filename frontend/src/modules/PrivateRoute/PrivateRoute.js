import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const RedirectComponent = ({ component: Component, isAdminRoute, userRole, ...props }) => {
  if (!localStorage.jwt_token) {
    return <Redirect to={{ pathname: '/login' }} />
  }
  if (!userRole) {
    return <Redirect to={{ pathname: '/login' }} />
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
