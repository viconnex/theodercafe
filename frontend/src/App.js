import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { SnackbarProvider } from 'notistack';

import { Drawer } from 'components/Drawer';
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import logo from './ui/logo/theodercafe.png';
import { RandomQuestion } from './components/RandomQuestion';
import { About } from 'components/About';

const style = theme => ({
  appBar: {
    background: 'white',
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const App = ({ classes }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const toggleDrawer = open => () => {
    setIsDrawerOpen(open);
  };

  return (
    <Router>
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <div className="App">
          <AppBar classes={{ root: classes.appBar }} position="fixed">
            <ToolBar className={classes.toolBar}>
              <Link to="/">
                <img src={logo} alt="logo" height="20" />
              </Link>
              <IconButton edge="start" className={classes.menuButton} aria-label="Menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            </ToolBar>
          </AppBar>
          <Switch>
            <Route exact path="/a-propos" component={About} />
            <Route path="/" component={RandomQuestion} />
          </Switch>
          <Drawer open={isDrawerOpen} toggleDrawer={toggleDrawer} />
        </div>
      </SnackbarProvider>
    </Router>
  );
};

export default withStyles(style)(App);
