import { makeStyles } from '@material-ui/core'

const useStyle = makeStyles(() => {
  return {
    container: {
      width: '100%',
      height: '100%',
      padding: '16px 0',
    },
    root: {
      backgroundColor: 'white',
      marginTop: '16px',
    },
    questioning: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    questioningPart: {
      marginLeft: '16px',
    },
  }
})

export default useStyle
