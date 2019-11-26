import React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import style from './style';
import { withStyles } from '@material-ui/styles';

const AppMenuIcon = ({ classes, pictureUrl }) => {
  if (!pictureUrl) return <MenuIcon />;
  return <img alt="profile" src={pictureUrl} width="30" className={classes.profile} />;
};

export default withStyles(style)(AppMenuIcon);
