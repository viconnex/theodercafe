import { makeStyles } from '@material-ui/core'
import colors from 'ui/colors'

const useStyle = makeStyles((theme) => ({
  picture: {
    marginTop: '16px',
    borderRadius: '100%',
    width: '100px',
  },
  name: {
    marginTop: '20px',
    fontSize: '22px',
  },
  similarity: {
    marginTop: '12px',
  },
  similarityValue: {
    color: colors.theodoGreen,
  },
  actionsContainer: {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column',
  },
  newQuestioning: {
    marginTop: '12px',
  },
  infoButton: {
    padding: '6px',
  },
}))

export default useStyle
