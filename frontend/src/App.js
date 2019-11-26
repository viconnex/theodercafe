import React, { lazy, Suspense } from 'react';
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { ThemeProvider } from '@material-ui/styles';

import { SnackbarProvider } from 'notistack';
import { Drawer } from 'components/Drawer';
import { About } from 'components/About';
import { PrivateRoute } from 'components/PrivateRoute';
import { MenuIcon } from 'components/MenuIcon';
import { LoginPage, LoginRedirection } from 'pages/Login';
import { Home } from 'pages/Home';
import colors from 'ui/colors';

import logo from './ui/logo/theodercafe.png';
import style from './App.style';

const Admin = lazy(() => import('./admin/Admin'));

const theme = createMuiTheme({
  palette: {
    primary: { main: colors.theodoBlue },
    secondary: { main: colors.theodoBlue },
  },
  status: {
    danger: 'orange',
  },
});

const App = ({ classes, store }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const toggleDrawer = open => () => {
    setIsDrawerOpen(open);
  };
  console.log('store', store);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <SnackbarProvider maxSnack={3} autoHideDuration={1300}>
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
                <Route path="/login/success" render={() => <LoginRedirection loginSuccess />} />
                <Route path="/login/failure" render={() => <LoginRedirection loginSuccess={false} />} />
                <PrivateRoute exact path="/admin" render={() => <Admin store={store} />} component={Admin} />
                <Route path="/" component={Home} />
              </Switch>
            </Suspense>
            <Drawer open={isDrawerOpen} toggleDrawer={toggleDrawer} />
          </div>
        </SnackbarProvider>
      </Router>
    </ThemeProvider>
  );
};

export default withStyles(style)(App);
