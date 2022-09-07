import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import IconButton from '@material-ui/core/IconButton'
import { Link, useHistory } from 'react-router-dom'
import Drawer from '@material-ui/core/Drawer'
import { Button } from '@material-ui/core'
import { login } from 'services/authentication'

import { FormattedMessage, useIntl } from 'react-intl'

const style = (theme) => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 8px',
    minHeight: '68px',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
})

const AppDrawer = ({ classes, toggleDrawer, open, user, logout }) => {
  const intl = useIntl()
  const drawerLinks = [
    { label: intl.formatMessage({ id: 'home.menu.settings' }), path: '/settings' },
    { label: intl.formatMessage({ id: 'home.menu.about' }), path: '/a-propos' },
    { label: intl.formatMessage({ id: 'home.menu.myAlterodo' }), path: '/alterodo' },
    { label: intl.formatMessage({ id: 'home.menu.map' }), path: '/carte' },
    { label: intl.formatMessage({ id: 'home.menu.mbti' }), path: '/mbti' },
  ]

  if (user?.role === 'admin') {
    drawerLinks.push({ label: intl.formatMessage({ id: 'home.menu.admin' }), path: '/admin' })
  }

  const history = useHistory()

  const onLogout = () => {
    logout({ history })
    toggleDrawer(false)
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
        {drawerLinks.map((link) => (
          <Link to={link.path} className={classes.link} key={link.path}>
            <ListItem button onClick={toggleDrawer(false)}>
              <ListItemText primary={link.label} />
            </ListItem>
          </Link>
        ))}
        {user ? (
          <ListItem button onClick={onLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        ) : (
          <ListItem button onClick={login}>
            <Button color="primary" variant="contained">
              <FormattedMessage id="home.login" />
            </Button>
          </ListItem>
        )}
      </List>
    </Drawer>
  )
}

export default withStyles(style)(AppDrawer)
