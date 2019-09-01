import React from 'react';
import { Redirect } from 'react-router-dom';

const Login = () => {
  const parsedPath = window.location.href.split('login/success/')[1];
  if (parsedPath) {
    const token =
      parsedPath.substring(parsedPath.length - 1, parsedPath.length) === '#' ? parsedPath.slice(0, -1) : parsedPath;
    localStorage.setItem('jwt_token', token);
    return <Redirect to="/nimda" />;
  }
  return <Redirect to="/" />;
};

export default Login;
