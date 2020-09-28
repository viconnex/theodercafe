import { useMediaQuery } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
  }
})

export default useStyles
