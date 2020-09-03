import React, { lazy, Suspense } from 'react'
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import { SnackbarProvider } from 'notistack'
import { MenuDrawer } from 'components/MenuDrawer'
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { About } from 'components/About'
import { PrivateRoute } from 'modules/PrivateRoute'
import { Login } from 'modules/Login'
import { LoginPage } from 'pages/LoginPage'
import MenuIcon from 'components/MenuIcon/MenuIcon'

import { Home } from 'pages/Home'
import { ThemeProvider } from '@material-ui/styles'
import colors from 'ui/colors'
import { getPictureUrl } from 'services/jwtDecode'
import { Alterodo } from 'pages/Alterodo'
import { Map } from 'pages/Map'
import style from './App.style'
import logo from './ui/logo/theodercafe.png'

const Admin = lazy(() => import('./admin/Admin'))

const theme = createMuiTheme({
  palette: {
    primary: { main: colors.theodoBlue },
    secondary: { main: colors.theodoGreen },
  },
  status: {
    danger: 'orange',
  },
})

const App = ({ classes }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open)
  }

  const [pictureUrl, setPictureUrl] = React.useState(getPictureUrl())

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <SnackbarProvider maxSnack={2} autoHideDuration={1300}>
          <div className={classes.app}>
            <AppBar classes={{ root: classes.appBar }} position="fixed">
              <ToolBar className={classes.toolBar}>
                <Link to="/">
                  <img src={logo} alt="logo" height="20" />
                </Link>
                <IconButton edge="start" aria-label="Menu" onClick={toggleDrawer(true)}>
                  <MenuIcon pictureUrl={pictureUrl} />
                </IconButton>
              </ToolBar>
            </AppBar>
            <ToolBar className={classes.shim} />
            <Suspense fallback={<div>Loading</div>}>
              <Switch>
                <Route exact path="/a-propos" component={About} />
                <Route exact path="/login" component={LoginPage} />
                <Route path="/login/success" render={() => <Login loginSuccess setPictureUrl={setPictureUrl} />} />
                <Route path="/login/failure" render={() => <Login loginSuccess={false} />} />
                <PrivateRoute exact path="/admin" component={Admin} isAdminRoute />
                <PrivateRoute exact path="/alterodo" component={Alterodo} isAdminRoute={false} />
                <PrivateRoute exact path="/carte" component={Map} isAdminRoute={false} />
                <Route path="/" component={Home} />
              </Switch>
            </Suspense>
            <MenuDrawer open={isDrawerOpen} toggleDrawer={toggleDrawer} />
          </div>
        </SnackbarProvider>
      </Router>
    </ThemeProvider>
  )
}

export default withStyles(style)(App)
