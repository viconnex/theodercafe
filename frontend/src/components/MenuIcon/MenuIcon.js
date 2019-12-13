import React from 'react';
import style from './style';
import { withStyles } from '@material-ui/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const AppMenuIcon = ({ classes, pictureUrl }) => {
  if (!pictureUrl) return <AccountCircleIcon />;
  return <img alt="profile" src={pictureUrl} width="30" className={classes.profile} />;
};

export default withStyles(style)(AppMenuIcon);
