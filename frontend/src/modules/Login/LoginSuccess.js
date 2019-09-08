import React from 'react';
import { Redirect } from 'react-router-dom';

const Login = () => {
  const token = new URLSearchParams(window.location.search).get('jwt');
  if (token) {
    localStorage.setItem('jwt_token', token);
    return <Redirect to="/admin" />;
  }
  return <Redirect to="/login/failure" />;
};

export default Login;
