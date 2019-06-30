import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import './App.css';
import logo from './ui/logo/theodercafe.png';
import RandomQuestion from './components/RandomQuestion';

const style = {
  root: {
    background: 'white',
  },
};

const App = props => {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
      <div className="App">
        <AppBar classes={props.classes} position="fixed">
          <ToolBar>
            <img src={logo} alt="logo" height="20" />
          </ToolBar>
        </AppBar>
        <header className="App-header">
          <RandomQuestion />
        </header>
      </div>
    </SnackbarProvider>
  );
};

export default withStyles(style)(App);
