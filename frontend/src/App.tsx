import React, { lazy, Suspense } from 'react'
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import { createMuiTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import { useSnackbar } from 'notistack'
import { MenuDrawer } from 'components/MenuDrawer'
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { IntlProvider } from 'react-intl'

import { About } from 'components/About'
import { PrivateRoute } from 'modules/PrivateRoute'
import { LoginPage } from 'pages/LoginPage'
import { Settings } from 'components/Settings'
import MenuIcon from 'components/MenuIcon/MenuIcon'
import { getLocale, Locale, messages } from 'languages/messages'
import { Home } from 'pages/Home'
import { ThemeProvider } from '@material-ui/styles'
import colors from 'ui/colors'
import { Alterodo } from 'pages/Alterodo'
import useStyle from './App.style'
import logo from './ui/logo/theodercafe.png'
import { useLogout, useSetAuth, useSetUser } from './services/authentication'

const Admin = lazy(() => import('./admin/Admin'))
const Map = lazy(() => import('./pages/Map/Map'))
const MBTI = lazy(() => import('./components/MBTI/MBTI'))

const theme = createMuiTheme({
  palette: {
    primary: { main: colors.theodoBlue },
    secondary: { main: colors.theodoGreen },
  },
})

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { jwtToken, setJwtToken } = useSetAuth({ enqueueSnackbar })
  const { user, setUser, refreshUser } = useSetUser({ jwtToken, setJwtToken })
  const { logout } = useLogout({ setJwtToken, setUser })

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open)
  }

  const classes = useStyle()

  const locale = getLocale()

  return (
    <IntlProvider messages={messages[locale]} locale={locale} defaultLocale={Locale.fr}>
      <ThemeProvider theme={theme}>
        <Router>
          <div className={classes.app}>
            <AppBar classes={{ root: classes.appBar }} position="fixed">
              <ToolBar className={classes.toolBar}>
                <Link to="/">
                  <img src={logo} alt="logo" height="20" />
                </Link>
                <IconButton edge="start" aria-label="Menu" onClick={toggleDrawer(true)}>
                  <MenuIcon pictureUrl={user?.pictureUrl ?? null} />
                </IconButton>
              </ToolBar>
            </AppBar>
            <div className={classes.toolbarSpace} />
            <Suspense fallback={<div>Loading</div>}>
              <Switch>
                <Route exact path="/a-propos" component={About} />
                <Route exact path="/login" component={LoginPage} />
                <PrivateRoute exact path="/admin" component={Admin} user={user} isLoggedIn={!!jwtToken} isAdminRoute />
                <PrivateRoute
                  exact
                  path="/alterodo"
                  component={Alterodo}
                  user={user}
                  isLoggedIn={!!jwtToken}
                  isAdminRoute={false}
                />
                <PrivateRoute
                  exact
                  path="/carte"
                  component={Map}
                  user={user}
                  isLoggedIn={!!jwtToken}
                  isAdminRoute={false}
                />
                <PrivateRoute
                  exact
                  path="/mbti"
                  component={MBTI}
                  user={user}
                  isLoggedIn={!!jwtToken}
                  isAdminRoute={false}
                />
                <PrivateRoute
                  exact
                  path="/settings"
                  component={Settings}
                  user={user}
                  isLoggedIn={!!jwtToken}
                  isAdminRoute={false}
                  refreshUser={refreshUser}
                  componentProps={{ refreshUser }}
                />
                <Route path="/" render={() => <Home user={user} isLoggedIn={!!jwtToken} refreshUser={refreshUser} />} />
              </Switch>
            </Suspense>
            <MenuDrawer open={isDrawerOpen} toggleDrawer={toggleDrawer} user={user} logout={logout} />
          </div>
        </Router>
      </ThemeProvider>
    </IntlProvider>
  )
}

export default App
