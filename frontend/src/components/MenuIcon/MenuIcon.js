import React from 'react';
import { connect } from 'react-redux';

import { getPictureUrl } from 'services/jwtDecode';

import style from './style';
import { withStyles } from '@material-ui/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { getUser, actionTypes } from 'modules/user';

const mapStateToProps = state => ({
  user: getUser(state),
});

const mapDispatchToProps = dispatch => ({
  setUser: pictureUrl => dispatch({ type: actionTypes.SET_USER, payload: { pictureUrl } }),
});

const AppMenuIcon = ({ classes, user, setUser }) => {
  if (!user || !user.pictureUrl) {
    return <MenuIcon />;
  }
  return <img alt="menu-icon" src={user.pictureUrl} width="30" className={classes.profile} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(style)(AppMenuIcon));
