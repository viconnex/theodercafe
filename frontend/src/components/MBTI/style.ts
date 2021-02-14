import { makeStyles } from '@material-ui/core'

const useStyle = makeStyles(() => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      position: 'relative',
    },
  }
})

export default useStyle
