import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { SnackbarProvider } from 'notistack';
import './App.css';
import logo from './ui/logo/theodercafe.png';
import { RandomQuestion } from './components/RandomQuestion';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';

const style = theme => {
  console.log(theme);
  return {
    root: {
      background: 'white',
    },
    toolBar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    drawerHeader: {
      display: 'flex',
      justifyContent: 'flex-start',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
  };
};

const App = ({ classes }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const toggleDrawer = open => () => {
    setIsDrawerOpen(open);
  };

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
      <div className="App">
        <AppBar classes={classes} position="fixed">
          <ToolBar className={classes.toolBar}>
            <img src={logo} alt="logo" height="20" />
            <IconButton edge="start" className={classes.menuButton} aria-label="Menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </ToolBar>
        </AppBar>
        <header className="App-header">
          <RandomQuestion />
        </header>
        <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
          <div className={classes.drawerHeader}>
            <IconButton onClick={toggleDrawer(false)}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button>
              <ListItemText primary="A propos" />
            </ListItem>
          </List>
        </Drawer>
      </div>
    </SnackbarProvider>
  );
};

export default withStyles(style)(App);
