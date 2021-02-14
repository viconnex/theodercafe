import React, { useEffect, useState } from 'react'
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
import { login, logout } from 'services/authentication'

const style = (theme) => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
})

const AppDrawer = ({ classes, toggleDrawer, open, userRole }) => {
  const drawerLinks = [
    { label: 'Questions', path: '/' },
    { label: 'A propos', path: '/a-propos' },
    { label: 'Mon alterodo', path: '/alterodo' },
    { label: 'La carte', path: '/carte' },
    { label: 'MBTI', path: '/mbti' },
  ]

  if (userRole === 'admin') {
    drawerLinks.push({ label: 'Admin', path: '/admin' })
  }

  const history = useHistory()

  const onLogout = () => {
    logout(history)
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
        {userRole ? (
          <ListItem button onClick={onLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        ) : (
          <ListItem button onClick={login}>
            <Button color="primary" variant="contained">
              Login
            </Button>
          </ListItem>
        )}
      </List>
    </Drawer>
  )
}

export default withStyles(style)(AppDrawer)
