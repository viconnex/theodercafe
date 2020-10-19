import { makeStyles } from '@material-ui/core'

const useStyle = makeStyles((theme) => {
  return {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      alignItems: 'center',
      position: 'relative',
    },
    questioningContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      width: '100%',
    },
    addButton: {
      bottom: '16px',
      right: '0px',
      position: 'absolute',
    },
    modal: {
      padding: '30px',
    },
  }
})

export default useStyle
