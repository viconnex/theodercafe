import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import { decodeJWT } from 'services/jwtDecode';

const style = theme => ({
  drawerHeader: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
});

const AppDrawer = ({ classes, toggleDrawer, open }) => {
  const drawerLinks = [
    { label: 'Questions', path: '/' },
    { label: 'A propos', path: '/a-propos' },
    { label: 'Login', path: '/login' },
  ];
  if (localStorage.jwt_token) {
    const decoded = decodeJWT(localStorage.jwt_token);
    if (decoded.role === 'admin') {
      drawerLinks.push({ label: 'Admin', path: '/admin' });
    }
  }

  return (
    <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
      <div className={classes.drawerHeader}>
        <IconButton onClick={toggleDrawer(false)}>
          <ChevronRightIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        {drawerLinks.map(link => (
          <Link to={link.path} className={classes.link} key={link.path}>
            <ListItem button onClick={toggleDrawer(false)}>
              <ListItemText primary={link.label} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default withStyles(style)(AppDrawer);
