import React from 'react';
import { getPictureUrl } from 'services/jwtDecode';
import MenuIcon from '@material-ui/icons/Menu';
import style from './style';
import { withStyles } from '@material-ui/styles';

const AppMenuIcon = ({ classes }) => {
  const pictureUrl = getPictureUrl();
  if (!pictureUrl) return <MenuIcon />;
  return <img alt="profile-picture" src={pictureUrl} width="30" className={classes.profile} />;
};

export default withStyles(style)(AppMenuIcon);
