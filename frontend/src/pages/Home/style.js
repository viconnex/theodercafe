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
      position: 'fixed',
      // --vh for innerHeight in mobile, 40px for button height, 12px for margin
      top: 'calc(var(--vh, 1vh) * 100 - 40px - 12px)',
      right: '12px',
    },
    modal: {
      padding: '30px',
    },
  }
})

export default useStyle
