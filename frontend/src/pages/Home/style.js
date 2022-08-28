import { makeStyles } from '@material-ui/core'

const useStyle = makeStyles(() => {
  return {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      alignItems: 'center',
      position: 'relative',
    },
    modesSelectorContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
      marginTop: '8px',
    },
    addButton: {
      bottom: '16px',
      right: '0px',
      position: 'absolute',
    },
  }
})

export default useStyle
