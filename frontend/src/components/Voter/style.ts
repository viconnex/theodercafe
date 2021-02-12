import { makeStyles } from '@material-ui/core'
import colors from 'ui/colors'

const useStyle = makeStyles(() => {
  return {
    voter: {
      display: 'flex',
      marginTop: '16px',
    },
    neutralVote: {
      color: colors.white,
    },
    upVote: {
      color: colors.theodoGreen,
    },
    downVote: {
      color: colors.red,
    },
    thumbContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    count: {
      fontSize: '12px',
    },
  }
})

export default useStyle
