import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { actionTypes } from 'modules/user';
import { decodeJWT } from 'services/jwtDecode';

const mapDispatchToProps = dispatch => ({
  setUser: (token, role, pictureUrl, isAuthenticated) =>
    dispatch({ type: actionTypes.SET_USER, payload: { token, role, pictureUrl, isAuthenticated } }),
});

class LoginRedirection extends Component {
  componentWillMount() {
    const token = new URLSearchParams(window.location.search).get('jwt');
    if (this.props.loginSuccess && token) {
      const decoded = decodeJWT(token);
      localStorage.setItem('jwt_token', token);
      this.props.setUser(token, decoded.role, decoded.pictureUrl, true);
      return this.props.enqueueSnackbar('Login réussi', { variant: 'success' });
    }
    return this.props.enqueueSnackbar('Il y a eu un problème lors du login', { variant: 'error' });
  }
  render() {
    return <Redirect to={{ pathname: '/' }} />;
  }
}

export default compose(
  withSnackbar,
  connect(
    null,
    mapDispatchToProps,
  ),
)(LoginRedirection);
