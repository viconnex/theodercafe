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

    addButton: {
      bottom: '16px',
      right: '0px',
      position: 'absolute',
    },
  }
})

export default useStyle
