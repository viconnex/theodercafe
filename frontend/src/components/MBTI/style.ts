import { makeStyles } from '@material-ui/core'

const useStyle = makeStyles(() => {
  return {
    page: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      padding: '16px 0',
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
      height: '100%',
      justifyContent: 'center',
    },
  }
})

export default useStyle
