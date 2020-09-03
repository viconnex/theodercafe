import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { decodeJWT } from 'services/jwtDecode'

const RedirectComponent = ({ component: Component, isAdminRoute, ...props }) => {
  if (!localStorage.jwt_token) {
    return <Redirect to={{ pathname: '/login' }} />
  }
  try {
    const decoded = decodeJWT(localStorage.jwt_token)
    if (decoded.hasExpired) {
      return <Redirect to={{ pathname: '/login' }} />
    }
    if (isAdminRoute && decoded.role !== 'admin') {
      return <div>Tu dois être admin pour accéder à cette page</div>
    }

    return <Component {...props} />
  } catch (error) {
    return <p>Ton token d'authentification n'est pas valide. Vide ton localStorage.</p>
  }
}

const PrivateRoute = ({ component, isAdminRoute, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => <RedirectComponent component={component} {...props} isAdminRoute={isAdminRoute} />}
    />
  )
}

export default PrivateRoute
