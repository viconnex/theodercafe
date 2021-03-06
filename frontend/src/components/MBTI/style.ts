import { makeStyles } from '@material-ui/core'

const useStyle = makeStyles(() => {
  return {
    page: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '32px',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actions: {
      display: 'flex',
      flexDirection: 'column',
    },
    actionButton: {
      marginTop: '16px',
    },
    chartContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '888px',
      height: '100%',
      justifyContent: 'center',
      marginTop: '32px',
    },
  }
})

export default useStyle
