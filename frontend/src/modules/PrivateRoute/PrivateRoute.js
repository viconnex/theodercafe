import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const RedirectComponent = ({ component: Component, ...props }) => {
  if (!localStorage.jwt_token) return <Redirect to={{ pathname: '/login' }} />;
  try {
    const decoded = jwtDecode(localStorage.jwt_token);
    if (decoded.exp < new Date().getTime() / 1000) return <Redirect to={{ pathname: '/login' }} />;
    if (decoded.role !== 'admin') return <div>Tu dois être admin pour accéder à cette page</div>;
    return <Component {...props} />;
  } catch (error) {
    return <p>Ton token d'authentification n'est pas valide. Vide ton localStorage.</p>;
  }
};

const PrivateRoute = ({ component, ...rest }) => {
  return <Route {...rest} render={props => <RedirectComponent component={component} {...props} />} />;
};

export default PrivateRoute;
