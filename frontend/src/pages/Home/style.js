import { makeStyles } from '@material-ui/core'

const useStyle = makeStyles((theme) => {
  return {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    toolbarSpace: {
      ...theme.mixins.toolbar,
    },
    questioningContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
    },
    addButton: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
    },
    modal: {
      padding: '30px',
    },
  }
})

export default useStyle
