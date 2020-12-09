import React, { lazy, Suspense } from 'react'
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import { createMuiTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import { useSnackbar } from 'notistack'
import { MenuDrawer } from 'components/MenuDrawer'
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { About } from 'components/About'
import { PrivateRoute } from 'modules/PrivateRoute'
import { LoginPage } from 'pages/LoginPage'
import MenuIcon from 'components/MenuIcon/MenuIcon'

import { Home } from 'pages/Home'
import { ThemeProvider } from '@material-ui/styles'
import colors from 'ui/colors'
import { getPictureUrl } from 'services/jwtDecode'
import { Alterodo } from 'pages/Alterodo'
import useStyle from './App.style'
import logo from './ui/logo/theodercafe.png'
import { useSetAuth } from './services/auth/setAuth'

const Admin = lazy(() => import('./admin/Admin'))
const Map = lazy(() => import('./pages/Map/Map'))

const theme = createMuiTheme({
  palette: {
    primary: { main: colors.theodoBlue },
    secondary: { main: colors.theodoGreen },
  },
})

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open)
  }

  const [pictureUrl, setPictureUrl] = React.useState(getPictureUrl())
  const classes = useStyle()

  const { enqueueSnackbar } = useSnackbar()
  useSetAuth(setPictureUrl, enqueueSnackbar)

  return (
    <ThemeProvider theme={theme}>
      <Router>
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
          <div className={classes.toolbarSpace} />
          <Suspense fallback={<div>Loading</div>}>
            <Switch>
              <Route exact path="/a-propos" component={About} />
              <Route exact path="/login" component={LoginPage} />
              <PrivateRoute exact path="/admin" component={Admin} isAdminRoute />
              <PrivateRoute exact path="/alterodo" component={Alterodo} isAdminRoute={false} />
              <PrivateRoute exact path="/carte" component={Map} isAdminRoute={false} />
              <Route path="/" component={Home} />
            </Switch>
          </Suspense>
          <MenuDrawer open={isDrawerOpen} toggleDrawer={toggleDrawer} />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
