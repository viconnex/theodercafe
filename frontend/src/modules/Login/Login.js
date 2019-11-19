import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withSnackbar } from 'notistack';

class Login extends Component {
  componentWillMount() {
    const token = new URLSearchParams(window.location.search).get('jwt');
    if (this.props.loginSuccess && token) {
      localStorage.setItem('jwt_token', token);
      return this.props.enqueueSnackbar('Login réussi', { variant: 'success' });
    }
    return this.props.enqueueSnackbar('Il y a eu un problème lors du login', { variant: 'error' });
  }
  render() {
    return <Redirect to={{ pathname: '/' }} />;
  }
}

export default withSnackbar(Login);
