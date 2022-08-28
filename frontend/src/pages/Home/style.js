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
    modeSelectorContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
    },
    questionSetSelectorContainer: {
      padding: '2px',
    },
    addButton: {
      bottom: '16px',
      right: '0px',
      position: 'absolute',
    },
  }
})

export default useStyle
