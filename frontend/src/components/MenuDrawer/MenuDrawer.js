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
  const drawerLinks = [
    { label: 'Réglages', path: '/settings' },
    { label: 'A propos', path: '/a-propos' },
    { label: 'Mon alterodo', path: '/alterodo' },
    { label: 'La carte', path: '/carte' },
    { label: 'MBTI', path: '/mbti' },
  ]

  if (user?.role === 'admin') {
    drawerLinks.push({ label: 'Admin', path: '/admin' })
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
              Login
            </Button>
          </ListItem>
        )}
      </List>
    </Drawer>
  )
}

export default withStyles(style)(AppDrawer)
