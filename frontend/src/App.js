import React, { lazy, Suspense } from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { SnackbarProvider } from 'notistack';
import { Drawer } from 'components/Drawer';
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { About } from 'components/About';
import { PrivateRoute } from 'modules/PrivateRoute';
import { Login } from 'modules/Login';
import { LoginPage } from 'pages/LoginPage';

import logo from './ui/logo/theodercafe.png';

import style from './App.style';
import { Home } from 'pages/Home';

const Admin = lazy(() => import('./admin/Admin'));

const App = ({ classes }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const toggleDrawer = open => () => {
    setIsDrawerOpen(open);
  };

  return (
    <Router>
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <div className={classes.app}>
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
          <ToolBar className={classes.shim} />
          <Suspense fallback={<div>Loading</div>}>
            <Switch>
              <Route exact path="/a-propos" component={About} />
              <Route exact path="/login" component={LoginPage} />
              <Route path="/login/success" render={() => <Login loginSuccess />} />
              <Route path="/login/failure" render={() => <Login loginSuccess={false} />} />
              <PrivateRoute exact path="/admin" component={Admin} />
              <Route path="/" component={Home} />
            </Switch>
          </Suspense>
          <Drawer open={isDrawerOpen} toggleDrawer={toggleDrawer} />
        </div>
      </SnackbarProvider>
    </Router>
  );
};

export default withStyles(style)(App);
